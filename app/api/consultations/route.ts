import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, phone, meta } = body

        if (!name || !phone) {
            return NextResponse.json(
                { error: '이름과 전화번호를 입력해주세요.' },
                { status: 400 }
            )
        }

        const scriptUrl = process.env.GOOGLE_WEBAPP_URL

        if (scriptUrl) {
            // 구글 앱스 스크립트로 데이터 전송 (서버사이드라 CORS 문제 없음)
            await fetch(scriptUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    phone,
                    source: meta?.source || 'landing_page'
                })
            })
        } else {
            console.log('⚠️ GOOGLE_WEBAPP_URL이 설정되지 않았습니다. 전송된 데이터:', { name, phone })
        }

        // 성공 응답 반환 (프론트엔드에서 카카오톡으로 리다이렉트됨)
        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Consultation POST error:', err)
        return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
    }
}
