import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { supabase } from '@/lib/supabaseClient'

export async function GET(request: Request) {
  try {
    // Check auth
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: '인증 헤더가 필요합니다.' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)

    if (userError || !user) {
      return NextResponse.json({ error: '인증 토큰이 유효하지 않습니다.' }, { status: 401 })
    }

    // Fetch referral history
    const { data: referrals, error: refError } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })

    if (refError) {
      return NextResponse.json({ error: '추천 이력을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: referrals })

  } catch (err: any) {
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
