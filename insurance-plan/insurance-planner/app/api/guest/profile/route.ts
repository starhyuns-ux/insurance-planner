import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies()
    const guestId = cookieStore.get('guest_session_id')?.value

    if (!guestId) {
      return NextResponse.json({ error: '인증이 필요합니다.' }, { status: 401 })
    }

    const { bank_name, bank_account } = await request.json()

    if (!bank_name || !bank_account) {
      return NextResponse.json({ error: '은행명과 계좌번호를 입력해주세요.' }, { status: 400 })
    }

    const { error: updateError } = await supabaseAdmin
      .from('guest_referrers')
      .update({
        bank_name,
        bank_account
      })
      .eq('id', guestId)

    if (updateError) {
      throw updateError
    }

    return NextResponse.json({ success: true, message: '계좌 정보가 저장되었습니다.' })
  } catch (err) {
    console.error('guest/profile update error:', err)
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
