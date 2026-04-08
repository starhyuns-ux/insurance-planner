import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import crypto from 'crypto'

export async function POST(request: Request) {
    try {
        const { name, phone } = await request.json()

        if (!name || !phone) {
            return NextResponse.json(
                { error: '이름과 전화번호를 입력해주세요.' },
                { status: 400 }
            )
        }

        // 1. 휴대폰 번호 중복 확인
        const { data: existingGuest } = await supabaseAdmin
            .from('guest_referrers')
            .select('id, referral_code')
            .eq('phone', phone)
            .single()

        if (existingGuest) {
            return NextResponse.json({ 
                success: true, 
                message: '이미 등록된 번호입니다.',
                referral_code: existingGuest.referral_code 
            })
        }

        // 2. 고유 추천 코드 생성 (6자리)
        const referral_code = crypto.randomBytes(3).toString('hex').toUpperCase()

        // 3. guest_referrers 테이블에 저장
        const { error } = await supabaseAdmin
            .from('guest_referrers')
            .insert({
                name,
                phone,
                referral_code,
                points_balance: 0,
                total_referrals: 0
            })

        if (error) {
            console.error('Guest registration error:', error)
            return NextResponse.json({ error: '등록 중 오류가 발생했습니다.' }, { status: 500 })
        }

        return NextResponse.json({ 
            success: true, 
            referral_code 
        })

    } catch (err) {
        console.error('Guest registration catch error:', err)
        return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
    }
}
