import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get('phone')

    if (!phone) {
        return NextResponse.json({ error: '전화번호를 입력해주세요.' }, { status: 400 })
    }

    try {
        const { data, error } = await supabaseAdmin
            .from('guest_referrers')
            .select('*')
            .eq('phone', phone)
            .single()

        if (error || !data) {
            return NextResponse.json({ error: '등록된 정보를 찾을 수 없습니다.' }, { status: 404 })
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                id: data.id,
                name: data.name,
                referral_code: data.referral_code,
                points_balance: data.points_balance,
                total_referrals: data.total_referrals
            }
        })
    } catch (err) {
        return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
    }
}
