import { NextResponse } from 'next/server'

const API_KEY = process.env.HIRA_API_KEY
const BASE_URL = 'https://apis.data.go.kr/B551182/MadmDtlInfoService2.7'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const keyword = searchParams.get('keyword') || ''
    const pageNo = searchParams.get('pageNo') || '1'
    const numOfRows = searchParams.get('numOfRows') || '20'

    if (!keyword.trim()) {
        return NextResponse.json({ error: '검색어를 입력해주세요.' }, { status: 400 })
    }

    if (!API_KEY) {
        return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 })
    }

    try {
        const params = new URLSearchParams({
            serviceKey: API_KEY,
            yadmNm: keyword,
            pageNo,
            numOfRows,
            _type: 'json',
        })

        const res = await fetch(`${BASE_URL}/getDtlInfo2.7?${params.toString()}`, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 60 }
        })

        if (!res.ok) {
            return NextResponse.json({ error: `API 호출 실패: ${res.status}` }, { status: 502 })
        }

        const data = await res.json()
        const items = data?.response?.body?.items?.item

        // Normalize: single item returns object, multiple returns array
        const list = items
            ? Array.isArray(items) ? items : [items]
            : []

        return NextResponse.json({
            success: true,
            totalCount: data?.response?.body?.totalCount ?? 0,
            items: list.map((item: any) => ({
                ykiho: item.ykiho,
                name: item.yadmNm,
                type: item.clCdNm,
                addr: item.addr,
                tel: item.telno,
                sidoNm: item.sidoCdNm,
                sgguNm: item.sgguCdNm,
                estbDd: item.estbDd,
                drTotCnt: item.drTotCnt,
            }))
        })
    } catch (err: any) {
        console.error('HIRA Search Error:', err)
        return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 })
    }
}
