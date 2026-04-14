import { NextResponse } from 'next/server'

const API_KEY = process.env.HIRA_API_KEY
const HOSP_INFO_URL = 'https://apis.data.go.kr/B551182/hospInfoServicev2'
const DIAG_URL = 'https://apis.data.go.kr/B551182/hospDiagInfoService1'

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

/**
 * Step 1 인증 체인:
 * 병원기본목록(getHospBasisList)에서 clCd=31(의원)으로 조회해
 * 암호화된 요양기호(ykiho)를 획득합니다.
 */
async function getEncryptedYkiho(yadmNm: string): Promise<string | null> {
    try {
        const params = new URLSearchParams({
            serviceKey: API_KEY!,
            yadmNm,
            clCd: '31',   // 의원급 고정
            numOfRows: '1',
            pageNo: '1',
        })

        const res = await fetch(`${HOSP_INFO_URL}/getHospBasisList?${params.toString()}`, {
            next: { revalidate: 3600 }
        })

        if (!res.ok) return null

        const xml = await res.text()
        const resultCode = extractXmlValue(xml, 'resultCode')
        if (resultCode && resultCode !== '00') return null

        const items = extractXmlItems(xml)
        // 암호화 ykiho 필드 (포털 응답 기준)
        return items[0]?.ykiho || items[0]?.hpid || null
    } catch {
        return null
    }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const plainYkiho = searchParams.get('ykiho')
    const yadmNm = searchParams.get('yadmNm') || ''

    if (!plainYkiho && !yadmNm) {
        return NextResponse.json({ error: '기관코드(ykiho) 또는 기관명(yadmNm)이 필요합니다.' }, { status: 400 })
    }

    if (!API_KEY) {
        return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 })
    }

    try {
        // ─── Step 1: 암호화 ykiho 인증 획득 ──────────────────────────────
        let encryptedYkiho: string | null = null

        if (yadmNm) {
            encryptedYkiho = await getEncryptedYkiho(yadmNm)
        }

        // 암호화 ykiho 취득 실패 시 원래 ykiho로 폴백 시도
        const finalYkiho = encryptedYkiho || plainYkiho

        if (!finalYkiho) {
            return NextResponse.json({
                error: '의원 인증 정보를 가져오지 못했습니다. 의원급 기관인지 확인해 주세요.',
                diseases: []
            })
        }

        // ─── Step 2: 진료질환 상위 5개 조회 ──────────────────────────────
        const params = new URLSearchParams({
            serviceKey: API_KEY,
            ykiho: finalYkiho,
            numOfRows: '5',
            pageNo: '1',
        })

        const res = await fetch(`${DIAG_URL}/getClinicTop5List1?${params.toString()}`, {
            next: { revalidate: 3600 }
        })

        if (!res.ok) {
            return NextResponse.json({
                error: `진료질환 API 호출 실패: ${res.status}`,
                diseases: [],
                authStep: encryptedYkiho ? 'encrypted' : 'fallback'
            }, { status: 502 })
        }

        const xml = await res.text()

        const resultCode = extractXmlValue(xml, 'resultCode')
        if (resultCode && resultCode !== '00') {
            const resultMsg = extractXmlValue(xml, 'resultMsg')
            return NextResponse.json({
                error: `API 오류: ${resultMsg || resultCode}`,
                diseases: [],
                authStep: encryptedYkiho ? 'encrypted' : 'fallback'
            })
        }

        const items = extractXmlItems(xml)

        return NextResponse.json({
            success: true,
            authStep: encryptedYkiho ? 'encrypted_ykiho' : 'plain_ykiho_fallback',
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
