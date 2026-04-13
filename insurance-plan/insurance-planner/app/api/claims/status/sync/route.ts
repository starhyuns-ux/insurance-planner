import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { faxClient } from '@/lib/fax-client'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    // 1. Security Check (Vercel Cron Secret)
    const authHeader = req.headers.get('authorization')
    if (process.env.NODE_ENV === 'production') {
      if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }

    // 2. Fetch all claims in progress
    const { data: pendingClaims, error: fetchError } = await supabaseAdmin
      .from('claims')
      .select('id, fax_receipt_id, insurance_company')
      .eq('fax_status', 'IN_PROGRESS')
      .not('fax_receipt_id', 'is', null)

    if (fetchError) throw fetchError

    if (!pendingClaims || pendingClaims.length === 0) {
      return NextResponse.json({ message: '동기화할 대기 중인 청구 건이 없습니다.' })
    }

    const results = {
      total: pendingClaims.length,
      updated: 0,
      failed: 0,
      errors: [] as string[]
    }

    // 3. Sync each claim
    for (const claim of pendingClaims) {
      try {
        const faxResult = await faxClient.getFaxResult(claim.fax_receipt_id!)
        
        // Map Popbill state/result
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

        // Only update if status has changed or to confirm it's still in progress
        const { error: updateError } = await supabaseAdmin
          .from('claims')
          .update({
            fax_status: finalStatus,
            fax_error: errorMessage || null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', claim.id)

        if (updateError) throw updateError
        results.updated++
      } catch (err: any) {
        console.error(`[SYNC FAILED] Claim ${claim.id}:`, err)
        results.failed++
        results.errors.push(`${claim.insurance_company} 건 오류: ${err.message}`)
      }
    }

    return NextResponse.json({
      success: true,
      summary: results
    })

  } catch (err: any) {
    console.error('[BATCH SYNC ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
