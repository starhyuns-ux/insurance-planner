import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone, name } = await request.json()

    if (!phone || !name) {
      return NextResponse.json({ error: '이름과 휴대폰 번호를 모두 입력해주세요.' }, { status: 400 })
    }

    // TODO: Integrate actual SMS gateway (e.g., Aligo, PortOne, Toss) here.
    // For now, we use a mock approach where the code is always '123456'.
    console.log(`[Mock SMS] Sending verification code 123456 to ${phone} for ${name}`)

    return NextResponse.json({ 
      success: true, 
      message: '인증번호(123456)가 발송되었습니다.' 
    })

  } catch (err) {
    console.error('request-code error:', err)
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
