import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const KAKAO_SECRET_KEY = process.env.KAKAO_PAY_SECRET_KEY!
const KAKAO_CID = process.env.KAKAO_PAY_CID || 'TC0ONETIME'

// 카카오페이 결제 승인 - pg_token + tid로 Approve API 호출
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

    const { orderId, pgToken } = await req.json()

    if (!orderId || !pgToken) {
      return NextResponse.json({ error: '필수 파라미터 누락 (orderId, pgToken)' }, { status: 400 })
    }

    // DB에서 주문 조회 (tid 가져오기)
    const { data: payment, error: findErr } = await supabaseAdmin
      .from('subscription_payments')
      .select('*')
      .eq('order_id', orderId)
      .eq('planner_id', user.id)
      .single()

    if (findErr || !payment) {
      return NextResponse.json({ error: '주문을 찾을 수 없습니다.' }, { status: 404 })
    }

    if (payment.status === 'DONE') {
      // 이미 처리된 경우 성공으로 간주 (새로고침 방어)
      return NextResponse.json({
        success: true,
        orderId,
        amount: payment.amount,
        periodEnd: payment.period_end,
        alreadyDone: true,
      })
    }

    const tid = payment.payment_key // prepare 단계에서 저장한 tid

    // 카카오페이 Approve API 호출
    const kakaoRes = await fetch('https://open-api.kakaopay.com/online/v1/payment/approve', {
      method: 'POST',
      headers: {
        'Authorization': `SECRET_KEY ${KAKAO_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: KAKAO_CID,
        tid,
        partner_order_id: orderId,
        partner_user_id: user.id,
        pg_token: pgToken,
      }),
    })

    const kakaoData = await kakaoRes.json()

    if (!kakaoRes.ok) {
      await supabaseAdmin
        .from('subscription_payments')
        .update({ status: 'FAILED' })
        .eq('order_id', orderId)

      return NextResponse.json(
        { error: kakaoData.extras?.method_result_message || kakaoData.msg || '결제 승인 실패' },
        { status: 400 }
      )
    }

    // 구독 기간 계산 (1개월 연장)
    const now = new Date()
    const { data: planner } = await supabaseAdmin
      .from('planners')
      .select('subscription_end_date, subscription_status')
      .eq('id', user.id)
      .single()

    let newPeriodStart = now
    let newPeriodEnd = new Date(now)
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1)

    if (planner?.subscription_status === 'active' && planner?.subscription_end_date) {
      const currentEnd = new Date(planner.subscription_end_date)
      if (currentEnd > now) {
        newPeriodStart = currentEnd
        newPeriodEnd = new Date(currentEnd)
        newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1)
      }
    }

    // 카카오페이 응답에서 카드 정보 파싱
    const cardInfo = kakaoData.payment_method_type === 'CARD'
      ? kakaoData.card_info
      : null

    // 결제 내역 업데이트
    await supabaseAdmin
      .from('subscription_payments')
      .update({
        status: 'DONE',
        method: kakaoData.payment_method_type === 'CARD' ? '카카오페이(카드)' : '카카오페이(머니)',
        card_number: cardInfo?.card_number?.slice(-4) || null,
        card_company: cardInfo?.kakaopay_issuer_corp || null,
        paid_at: kakaoData.approved_at || now.toISOString(),
        period_start: newPeriodStart.toISOString(),
        period_end: newPeriodEnd.toISOString(),
      })
      .eq('order_id', orderId)

    // 플래너 구독 상태 업데이트
    await supabaseAdmin
      .from('planners')
      .update({
        subscription_status: 'active',
        subscription_end_date: newPeriodEnd.toISOString(),
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      orderId,
      amount: kakaoData.amount?.total || payment.amount,
      method: kakaoData.payment_method_type,
      cardInfo: cardInfo
        ? `${cardInfo.kakaopay_issuer_corp || ''} ****${cardInfo.card_number?.slice(-4) || ''}`
        : '카카오머니',
      periodEnd: newPeriodEnd.toISOString(),
    })
  } catch (err: any) {
    console.error('[payment/confirm]', err)
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 })
  }
}
