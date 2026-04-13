import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const guestId = cookieStore.get('guest_session_id')?.value

    if (!guestId) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    // 1. Fetch guest profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('guest_referrers')
      .select('*')
      .eq('id', guestId)
      .single()

    if (profileError || !profile) {
      return NextResponse.json({ error: '사용자 정보를 찾을 수 없습니다.' }, { status: 404 })
    }

    // 2. Fetch referrals
    const { data: referrals, error: referralsError } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referrer_guest_id', guestId)
      .order('created_at', { ascending: false })

    if (referralsError) {
      throw referralsError
    }

    // Calculate stats
    const totalPoints = referrals?.reduce((sum, ref) => sum + (ref.reward_amount || 0), 0) || 0
    const completedCount = referrals?.filter(ref => ref.status === 'PAID').length || 0

    return NextResponse.json({ 
      success: true, 
      profile: {
        id: profile.id,
        name: profile.name,
        phone: profile.phone,
        referral_code: profile.referral_code,
        bank_name: profile.bank_name,
        bank_account: profile.bank_account
      },
      referrals: referrals || [],
      stats: {
        totalPoints,
        completedCount,
        pendingCount: referrals?.filter(ref => ref.status === 'PENDING').length || 0
      }
    })

  } catch (err) {
    console.error('guest/referrals/me error:', err)
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
