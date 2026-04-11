import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import webpush from 'web-push'

// Configure web push
const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
        'mailto:admin@stroy.kr',
        VAPID_PUBLIC_KEY,
        VAPID_PRIVATE_KEY
    )
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, phone, meta, planner_id } = body

        if (!name || !phone) {
            return NextResponse.json(
                { error: '이름과 전화번호를 입력해주세요.' },
                { status: 400 }
            )
        }

        // 1. Supabase DB에 저장 (returning id for referral link)
        const { data: insertedData, error: dbError } = await supabaseAdmin
            .from('consultations')
            .insert({
                name,
                phone,
                planner_id: planner_id || null,
                meta: meta || {}
            })
            .select('id')
            .single()

        if (dbError) {
            console.error('Supabase DB Insert Error:', dbError)
        }

        const consultationId = insertedData?.id;

        // 1-1. 추천인 로직 연동 (Referral Processing)
        if (meta?.referrer_code && consultationId) {
            // 1) 추천인(설계사) 조회
            const { data: referrerPlanner } = await supabaseAdmin
                .from('planners')
                .select('id, phone')
                .eq('referral_code', meta.referrer_code)
                .single()

            if (referrerPlanner) {
                // 자기 추천 방지 (상담 전화번호와 추천인 전화번호 비교)
                if (referrerPlanner.phone !== phone) {
                    await supabaseAdmin.from('referrals').insert({
                        referrer_id: referrerPlanner.id,
                        referee_name: name,
                        referee_phone: phone,
                        referee_type: 'CONSULTATION',
                        referred_consultation_id: consultationId,
                        status: 'PENDING'
                    })
                }
            } else {
                // 2) 비회원 추천인 조회
                const { data: guestReferrer } = await supabaseAdmin
                    .from('guest_referrers')
                    .select('id, phone, points_balance, total_referrals')
                    .eq('referral_code', meta.referrer_code)
                    .single()

                // 리워드 조건 확인 (공백 제거 후 유효성)
                const isBirthFilled = meta?.birth_date && meta.birth_date.trim().length > 0;
                const isPremiumFilled = meta?.monthly_premium && meta.monthly_premium.trim().length > 0;
                const hasRequiredFields = isBirthFilled && isPremiumFilled;

                if (guestReferrer && hasRequiredFields) {
                    // 자기 번호로 꼼수 추천하는 것 방지 (하이픈 제거 후 순수 숫자로만 비교)
                    const referrerVal = (guestReferrer.phone || '').replace(/[^0-9]/g, '');
                    const applicantVal = (phone || '').replace(/[^0-9]/g, '');

                    if (referrerVal !== applicantVal) {
                        // 소개 보상(500p) 및 통계 업데이트
                        await supabaseAdmin.from('referrals').insert({
                            referrer_guest_id: guestReferrer.id,
                            referee_name: name,
                            referee_phone: phone,
                            referee_type: 'CONSULTATION',
                            referred_consultation_id: consultationId,
                            reward_amount: 500,
                            status: 'APPROVED' // 실시간 자동 승인
                        })

                        // 비회원 추천인의 포인트 잔액 500 증가 업데이트
                        await supabaseAdmin
                            .from('guest_referrers')
                            .update({ 
                                points_balance: (guestReferrer.points_balance || 0) + 500,
                                total_referrals: (guestReferrer.total_referrals || 0) + 1
                            })
                            .eq('id', guestReferrer.id)
                    }
                }
            }
        }

        // 2. 신청자 본인의 '리워드 지갑' 자동 생성/조회 (Auto-create Wallet for Applicant)
        let applicantReferralCode = '';
        try {
            const { data: existingGuest } = await supabaseAdmin
                .from('guest_referrers')
                .select('referral_code')
                .eq('phone', phone)
                .single()

            if (existingGuest) {
                applicantReferralCode = existingGuest.referral_code;
            } else {
                // 새 지갑 생성
                const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
                const { data: newGuest } = await supabaseAdmin
                    .from('guest_referrers')
                    .insert({
                        name,
                        phone,
                        referral_code: newCode
                    })
                    .select('referral_code')
                    .single()
                
                if (newGuest) applicantReferralCode = newGuest.referral_code;
            }
        } catch (walletErr) {
            console.error('Auto Wallet Creation Error:', walletErr)
        }

        // 3. 구글 앱스 스크립트로 데이터 전송 (기존 로직 유지)
        const scriptUrl = process.env.GOOGLE_WEBAPP_URL

        if (scriptUrl) {
            await fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    source: meta?.source || 'landing_page'
                })
            }).catch(e => console.error("Google WebApp Error:", e))
        }

        // 4. 브라우저 푸시 알림 전송
        if (planner_id && VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
            try {
                const { data: subscriptions } = await supabaseAdmin
                    .from('push_subscriptions')
                    .select('subscription')
                    .eq('planner_id', planner_id)

                if (subscriptions && subscriptions.length > 0) {
                    const pushPayload = JSON.stringify({
                        title: '📋 새로운 상담 신청!',
                        body: `${name}님이 상담을 신청했습니다. (${phone})`,
                        url: '/dashboard'
                    })

                    const pushPromises = subscriptions.map(async (sub: any) => {
                        try {
                            await webpush.sendNotification(sub.subscription, pushPayload)
                        } catch (pushErr: any) {
                            if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
                                await supabaseAdmin
                                    .from('push_subscriptions')
                                    .delete()
                                    .eq('endpoint', sub.subscription.endpoint)
                                console.log('Removed expired push subscription')
                            }
                        }
                    })

                    await Promise.allSettled(pushPromises)
                    console.log(`Push notifications sent to ${subscriptions.length} device(s)`)
                }
            } catch (pushError) {
                console.error('Push notification error:', pushError)
            }
        }

        return NextResponse.json({ 
            success: true, 
            referral_code: applicantReferralCode 
        })
    } catch (err: any) {
        console.error('Consultation POST error:', err)
        return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
    }
}
