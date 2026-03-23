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
                    .select('id, phone')
                    .eq('referral_code', meta.referrer_code)
                    .single()

                if (guestReferrer && guestReferrer.phone !== phone) {
                    await supabaseAdmin.from('referrals').insert({
                        referrer_guest_id: guestReferrer.id,
                        referee_name: name,
                        referee_phone: phone,
                        referee_type: 'CONSULTATION',
                        referred_consultation_id: consultationId,
                        status: 'PENDING'
                    })
                }
            }
        }

        // 2. 구글 앱스 스크립트로 데이터 전송 (기존 로직 유지)
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

        // 3. 브라우저 푸시 알림 전송
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

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Consultation POST error:', err)
        return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
    }
}
