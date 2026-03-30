import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const KAKAO_SECRET_KEY = process.env.KAKAO_PAY_SECRET_KEY!
const KAKAO_CID = process.env.KAKAO_PAY_CID || 'TC0ONETIME'

// 카카오페이 결제 취소
export async function POST(req: NextRequest) {
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

    const { orderId, cancelReason } = await req.json()
    if (!orderId) {
      return NextResponse.json({ error: 'orderId가 필요합니다.' }, { status: 400 })
    }

    // 해당 결제가 본인 것인지 확인
    const { data: payment } = await supabaseAdmin
      .from('subscription_payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('planner_id', user.id)
      .single()

    if (!payment || payment.status !== 'DONE') {
      return NextResponse.json({ error: '취소 가능한 결제 내역을 찾을 수 없습니다.' }, { status: 404 })
    }

    // 카카오페이 Cancel API
    const kakaoRes = await fetch('https://open-api.kakaopay.com/online/v1/payment/cancel', {
      method: 'POST',
      headers: {
        'Authorization': `SECRET_KEY ${KAKAO_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: KAKAO_CID,
        tid: payment.payment_key,
        cancel_amount: payment.amount,
        cancel_tax_free_amount: 0,
        cancel_vat_amount: Math.floor(payment.amount * 10 / 110),
      }),
    })

    const kakaoData = await kakaoRes.json()

    if (!kakaoRes.ok) {
      return NextResponse.json(
        { error: kakaoData.extras?.method_result_message || '취소 실패' },
        { status: 400 }
      )
    }

    // DB 업데이트
    await supabaseAdmin
      .from('subscription_payments')
      .update({ status: 'CANCELED', canceled_at: new Date().toISOString() })
      .eq('order_id', orderId)

    // 활성 결제가 없으면 구독 비활성화
    const { data: activePayments } = await supabaseAdmin
      .from('subscription_payments')
      .select('id')
      .eq('planner_id', user.id)
      .eq('status', 'DONE')
      .gt('period_end', new Date().toISOString())
      .limit(1)

    if (!activePayments || activePayments.length === 0) {
      await supabaseAdmin
        .from('planners')
        .update({ subscription_status: 'inactive' })
        .eq('id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('[payment/cancel]', err)
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 })
  }
}
