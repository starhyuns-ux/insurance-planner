import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 결제 내역 조회
export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: '인증 실패' }, { status: 401 })
    }

    const { data: payments, error } = await supabaseAdmin
      .from('subscription_payments')
      .select('*')
      .eq('planner_id', user.id)
      .order('created_at', { ascending: false })
      .limit(12)

    if (error) throw error

    return NextResponse.json({ data: payments || [] })
  } catch (err: any) {
    console.error('[payment/history]', err)
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 })
  }
}
