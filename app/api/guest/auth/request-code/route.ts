import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { phone, name } = await request.json()

    if (!phone || !name) {
      return NextResponse.json({ error: '이름과 휴대폰 번호를 모두 입력해주세요.' }, { status: 400 })
    }

    // SMS Gateway Integration Point
    // Current behavior: Mock verification code for testing purposes.
    const MOCK_CODE = '123456'
    
    console.log(`[SMS AUTH] Sending verification code ${MOCK_CODE} to ${phone} for ${name}`)

    return NextResponse.json({ 
      success: true, 
      message: `인증번호(${MOCK_CODE})가 발송되었습니다.` 
    })

  } catch (err) {
    console.error('request-code error:', err)
    return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
  }
}
