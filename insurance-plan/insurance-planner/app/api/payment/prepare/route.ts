import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const KAKAO_SECRET_KEY = process.env.KAKAO_PAY_SECRET_KEY!
const KAKAO_CID = process.env.KAKAO_PAY_CID || 'TC0ONETIME' // 테스트: TC0ONETIME, 운영: 가맹점 CID

// 카카오페이 결제 준비 - Ready API 호출
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

    // 주문번호 생성
    const now = new Date()
    const ts = now.toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)
    const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
    const orderId = `SUB_${ts}_${rand}`

    const origin = req.headers.get('origin') || 'https://stroy.kr'

    // 카카오페이 Ready API 호출
    const kakaoRes = await fetch('https://open-api.kakaopay.com/online/v1/payment/ready', {
      method: 'POST',
      headers: {
        'Authorization': `SECRET_KEY ${KAKAO_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cid: KAKAO_CID,
        partner_order_id: orderId,
        partner_user_id: user.id,
        item_name: '보험 플래너 구독 (월정액)',
        quantity: 1,
        total_amount: 5900,
        vat_amount: 536,       // 5900 * 10/110 ≈ 536
        tax_free_amount: 0,
        approval_url: `${origin}/payment/success?orderId=${orderId}`,
        fail_url: `${origin}/payment/fail`,
        cancel_url: `${origin}/payment/cancel`,
      }),
    })

    if (!kakaoRes.ok) {
      const errData = await kakaoRes.json()
      console.error('[kakao ready error]', errData)
      return NextResponse.json(
        { error: errData.extras?.method_result_message || '카카오페이 결제 준비 실패' },
        { status: 400 }
      )
    }

    const kakaoData = await kakaoRes.json()
    // tid: 결제 고유번호, next_redirect_pc_url: PC용 결제창 URL

    // DB에 결제 레코드 생성 (payment_key 필드에 tid 임시 저장)
    const { error: insertError } = await supabaseAdmin
      .from('subscription_payments')
      .insert({
        planner_id: user.id,
        order_id: orderId,
        payment_key: kakaoData.tid, // tid를 임시로 저장
        amount: 5900,
        status: 'PENDING',
        method: '카카오페이',
      })

    if (insertError) throw insertError

    return NextResponse.json({
      orderId,
      redirectUrl: kakaoData.next_redirect_pc_url,      // PC
      mobileRedirectUrl: kakaoData.next_redirect_mobile_url, // 모바일
      tid: kakaoData.tid,
    })
  } catch (err: any) {
    console.error('[payment/prepare]', err)
    return NextResponse.json({ error: err.message || '서버 오류' }, { status: 500 })
  }
}
