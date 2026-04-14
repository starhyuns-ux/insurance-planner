import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { generateClaimPDF } from '@/lib/pdf-generator'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const claimId = searchParams.get('claimId')

    if (!claimId) {
      return NextResponse.json({ error: 'claimId is required' }, { status: 400 })
    }

    // 1. Fetch Claim Data
    const { data: claim, error: fetchError } = await supabaseAdmin
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single()

    if (fetchError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    // 2. Fetch Planner Info
    const { data: planner } = await supabaseAdmin
      .from('planners')
      .select('name, phone, email, affiliation')
      .eq('id', claim.planner_id)
      .single()

    // 3. Generate PDF Claim Form
    console.log(`[CLAIM PREVIEW] Generating PDF for ${claim.customer_name}...`)
    const claimPdfBuffer = await generateClaimPDF(claim, planner)
    
    // 4. Return as PDF stream
    return new NextResponse(claimPdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="claim_preview_${claimId}.pdf"`,
        'Cache-Control': 'no-store, max-age=0'
      }
    })

  } catch (err: any) {
    console.error('[CLAIM PREVIEW ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
