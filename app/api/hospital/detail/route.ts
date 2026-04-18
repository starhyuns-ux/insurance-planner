import { NextResponse } from 'next/server'

const API_KEY = process.env.HIRA_API_KEY
const BASE_URL = 'https://apis.data.go.kr/B551182/MadmDtlInfoService2.7'

async function fetchHiraApi(endpoint: string, ykiho: string) {
    const params = new URLSearchParams({
        serviceKey: API_KEY!,
        ykiho,
        _type: 'json',
        numOfRows: '100',
        pageNo: '1',
    })

    try {
        const res = await fetch(`${BASE_URL}/${endpoint}?${params.toString()}`, {
            headers: { Accept: 'application/json' },
            next: { revalidate: 300 }
        })
        if (!res.ok) return null
        const data = await res.json()
        const items = data?.response?.body?.items?.item
        if (!items) return []
        return Array.isArray(items) ? items : [items]
    } catch {
        return null
    }
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
        // Fetch all detail APIs in parallel
        const [dtl, dgsbj, eqp, medOft, nurs, spclDiag] = await Promise.all([
            fetchHiraApi('getDtlInfo2.7', ykiho),
            fetchHiraApi('getDgsbjtInfo2.7', ykiho),
            fetchHiraApi('getEqpInfo2.7', ykiho),
            fetchHiraApi('getMedOftInfo2.7', ykiho),
            fetchHiraApi('getNursigGrdInfo2.7', ykiho),
            fetchHiraApi('getSpclDiagInfo2.7', ykiho),
        ])

        const basic = dtl?.[0] ?? null

        return NextResponse.json({
            success: true,
            detail: {
                basic: basic ? {
                    name: basic.yadmNm,
                    type: basic.clCdNm,
                    addr: basic.addr,
                    tel: basic.telno,
                    fax: basic.hospUrl,
                    estbDd: basic.estbDd,
                    drTotCnt: basic.drTotCnt,
                    sidoNm: basic.sidoCdNm,
                    sgguNm: basic.sgguCdNm,
                    hospUrl: basic.hospUrl,
                    mdtrSDayNm: basic.mdtrSDayNm,
                    mdtrEDayNm: basic.mdtrEDayNm,
                } : null,
                subjects: (dgsbj ?? []).map((i: any) => ({
                    name: i.dgsbjtCdNm,
                    code: i.dgsbjtCd,
                })),
                equipment: (eqp ?? []).map((i: any) => ({
                    name: i.eqpNm,
                    count: i.eqpCnt,
                })),
                medicalStaff: (medOft ?? []).map((i: any) => ({
                    name: i.medOftCdNm,
                    count: i.medCnt,
                })),
                nursingGrade: (nurs ?? []).map((i: any) => ({
                    typeName: i.nursingGrdNm,
                    grade: i.nursingGrd,
                })),
                specialDiag: (spclDiag ?? []).map((i: any) => ({
                    name: i.spclDiagCdNm,
                })),
            }
        })
    } catch (err: any) {
        console.error('HIRA Detail Error:', err)
        return NextResponse.json({ error: '상세 조회 중 오류가 발생했습니다.' }, { status: 500 })
    }
}
