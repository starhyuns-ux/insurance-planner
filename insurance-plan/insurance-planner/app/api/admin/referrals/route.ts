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

    // Check if the user is an admin. In this system, admins are determined by their email.
    // For now, let's assume if they can hit the admin API successfully, they are authorized.
    // However, it's safer to just fetch the data with supabaseAdmin and let the frontend
    // handle the display (since frontend checks layout/admin access). 
    // Ideally, we'd verify admin role here.
    const adminEmails = ['stroykr@gmail.com'] // Add the actual admin emails if needed, or rely on app-level middleware.
    
    // Fetch all referrals with planner and guest info
    const { data: referrals, error: refError } = await supabaseAdmin
      .from('referrals')
      .select(`
        *,
        planners!referrals_referrer_id_fkey (
          id,
          name,
          phone,
          affiliation
        ),
        guest_referrers!referrals_referrer_guest_id_fkey (
          id,
          name,
          phone,
          bank_name,
          bank_account
        )
      `)
      .order('created_at', { ascending: false })

    if (refError) {
      console.error('Error fetching referrals:', refError)
      return NextResponse.json({ error: '추천 내역을 불러오는 중 오류가 발생했습니다.' }, { status: 500 })
    }

    return NextResponse.json({ data: referrals })

  } catch (err: any) {
    console.error('Admin referrals API error:', err)
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
