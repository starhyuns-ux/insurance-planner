import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function PATCH(request: Request) {
    try {
        const { id, status } = await request.json()
        
        if (!id || !status) {
            return NextResponse.json({ error: '상담 ID와 변경할 상태값이 필요합니다.' }, { status: 400 })
        }

        const { data, error } = await supabaseAdmin
            .from('consultations')
            .update({ status })
            .eq('id', id)
            .select()

        if (error) {
            console.error('Update status error:', error)
            
            // Provide specific database error insights
            if (error.code === '42703') {
                return NextResponse.json({ error: '데이터베이스에 status 컬럼이 아직 생성되지 않았습니다 (DB 구조 오류).' }, { status: 500 })
            }
            
            return NextResponse.json({ error: `접근 또는 업데이트 실패: ${error.message}` }, { status: 500 })
        }

        return NextResponse.json({ success: true, data })
    } catch (err: any) {
        console.error('API Error updating status:', err)
        return NextResponse.json({ error: '서버 에러가 발생했습니다.' }, { status: 500 })
    }
}
