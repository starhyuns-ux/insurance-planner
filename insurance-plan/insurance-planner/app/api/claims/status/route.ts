import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { faxClient } from '@/lib/fax-client'

export async function POST(req: NextRequest) {
  try {
    const { claimId, getPreview = false } = await req.json()
    
    if (!claimId) {
      return NextResponse.json({ error: 'claimId is required' }, { status: 400 })
    }

    // 1. Fetch Claim Data
    const { data: claim, error: fetchError } = await supabaseAdmin
      .from('claims')
      .select('id, fax_receipt_id, insurance_company')
      .eq('id', claimId)
      .single()

    if (fetchError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    if (!claim.fax_receipt_id) {
      return NextResponse.json({ error: '이 청구 건은 전송된 이력이 없습니다.' }, { status: 400 })
    }

    // 2. Fetch Result from Popbill
    let faxResult: any
    let previewUrl: string | undefined

    try {
      faxResult = await faxClient.getFaxResult(claim.fax_receipt_id)
      
      if (getPreview) {
        previewUrl = await faxClient.getPreviewURL(claim.fax_receipt_id)
      }
    } catch (apiErr: any) {
      console.error('[POPBILL STATUS ERROR]', apiErr)
      return NextResponse.json({ error: `팝빌 조회 실패: ${apiErr.message}` }, { status: 502 })
    }

    // Map Popbill state/result to a friendly status
    // state: 1(대기), 2(성공), 3(완료-결과확인가능), 4(취소)
    // result: {state} = 3 인 경우 결과코드 (1이 성공)
    let finalStatus = 'IN_PROGRESS'
    let errorMessage = ''

    if (faxResult.state === 3) {
      if (faxResult.result === 1) {
        finalStatus = 'COMPLETED'
      } else {
        finalStatus = 'FAILED'
        errorMessage = `전송 실패 (코드: ${faxResult.result})`
      }
    } else if (faxResult.state === 4) {
      finalStatus = 'CANCELLED'
    }

    // 3. Update Database
    const { error: updateError } = await supabaseAdmin
      .from('claims')
      .update({
        fax_status: finalStatus,
        fax_error: errorMessage || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', claimId)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      status: finalStatus,
      details: faxResult,
      previewUrl
    })

  } catch (err: any) {
    console.error('[CLAIM STATUS UPDATE ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
