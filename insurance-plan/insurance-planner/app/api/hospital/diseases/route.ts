import { NextResponse } from 'next/server'

const API_KEY = process.env.HIRA_API_KEY
const BASE_URL = 'https://apis.data.go.kr/B551182/hospDiagInfoService1'

// XML 태그값 추출 헬퍼
function extractXmlValue(xml: string, tag: string): string {
    const match = xml.match(new RegExp(`<${tag}[^>]*>([^<]*)</${tag}>`, 'i'))
    return match ? match[1].trim() : ''
}

function extractXmlItems(xml: string): Record<string, string>[] {
    const itemMatches = xml.match(/<item>([\s\S]*?)<\/item>/gi)
    if (!itemMatches) return []

    return itemMatches.map(item => {
        const tagMatches = item.match(/<(\w+)>([^<]*)<\/\1>/g) || []
        const obj: Record<string, string> = {}
        tagMatches.forEach(tag => {
            const m = tag.match(/<(\w+)>([^<]*)<\/\1>/)
            if (m) obj[m[1]] = m[2].trim()
        })
        return obj
    })
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const ykiho = searchParams.get('ykiho')

    if (!ykiho) {
        return NextResponse.json({ error: '기관코드(ykiho)가 필요합니다.' }, { status: 400 })
    }

    if (!API_KEY) {
        return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 })
    }

    try {
        const params = new URLSearchParams({
            serviceKey: API_KEY,
            ykiho,
            numOfRows: '5',
            pageNo: '1',
        })

        const res = await fetch(`${BASE_URL}/getClinicTop5List1?${params.toString()}`, {
            next: { revalidate: 3600 }
        })

        if (!res.ok) {
            return NextResponse.json({ error: `API 호출 실패: ${res.status}` }, { status: 502 })
        }

        const xml = await res.text()

        // 에러 체크
        const resultCode = extractXmlValue(xml, 'resultCode')
        if (resultCode && resultCode !== '00') {
            const resultMsg = extractXmlValue(xml, 'resultMsg')
            return NextResponse.json({ error: `API 오류: ${resultMsg || resultCode}`, diseases: [] })
        }

        const items = extractXmlItems(xml)

        return NextResponse.json({
            success: true,
            diseases: items.map(item => ({
                rank: item.rank || item.disNo,
                name: item.disNm,
                code: item.disCd,
                count: item.patCnt,
            })).filter(d => d.name)
        })
    } catch (err: any) {
        console.error('HIRA Diag Error:', err)
        return NextResponse.json({ error: '서버 오류가 발생했습니다.', diseases: [] }, { status: 500 })
    }
}
