import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, phone, meta, planner_id } = body

        if (!name || !phone) {
            return NextResponse.json(
                { error: '이름과 전화번호를 입력해주세요.' },
                { status: 400 }
            )
        }

        // 1. Supabase DB에 저장
        const { error: dbError } = await supabaseAdmin
            .from('consultations')
            .insert({
                name,
                phone,
                planner_id: planner_id || null,
                meta: meta || {}
            })

        if (dbError) {
            console.error('Supabase DB Insert Error:', dbError)
        }

        // 2. 구글 앱스 스크립트로 데이터 전송 (기존 로직 유지)
        const scriptUrl = process.env.GOOGLE_WEBAPP_URL

        if (scriptUrl) {
            await fetch(scriptUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name,
                    phone,
                    source: meta?.source || 'landing_page'
                })
            })
        }

        return NextResponse.json({ success: true })
    } catch (err: any) {
        console.error('Consultation POST error:', err)
        return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
    }
}
