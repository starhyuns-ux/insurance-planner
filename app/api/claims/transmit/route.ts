import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'

export async function POST(req: NextRequest) {
  try {
    const { claimId } = await req.json()
    if (!claimId) {
      return NextResponse.json({ error: 'claimId is required' }, { status: 400 })
    }

    // Fetch the claim with all its data
    const { data: claim, error: fetchError } = await supabaseAdmin
      .from('claims')
      .select('*')
      .eq('id', claimId)
      .single()

    if (fetchError || !claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 })
    }

    // Fetch planner info
    const { data: planner } = await supabaseAdmin
      .from('planners')
      .select('name, phone, email, affiliation')
      .eq('id', claim.planner_id)
      .single()

    /**
     * TRANSMISSION LOGIC
     * 
     * In a real-world production scenario, this is where you would integrate with:
     * - Popbill Fax API (팝빌): https://developers.popbill.com/guide/fax
     * - Aligo Fax API (알리고): https://smartsms.aligo.in/doc_fax.html
     * - Email API (SendGrid / Resend / Nodemailer)
     * 
     * Example Popbill fax call (pseudocode):
     *   await popbill.Fax.sendFax({
     *     senderNum: planner.phone,
     *     receiverNum: INSURANCE_FAX_NUMBERS[claim.insurance_company],
     *     files: claim.image_urls,
     *   })
     * 
     * For now, we log the transmission details and mark the claim as SENT.
     */
    console.log(`[CLAIM TRANSMISSION] Claim #${claimId}`)
    console.log(`  Company: ${claim.insurance_company}`)
    console.log(`  Customer: ${claim.customer_name}`)
    console.log(`  Planner: ${planner?.name} (${planner?.phone})`)
    console.log(`  Documents: ${claim.image_urls?.length || 0} files`)
    console.log(`  Description: ${claim.description}`)

    // Simulate transmission delay (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Update claim transmission status to SENT
    const { error: updateError } = await supabaseAdmin
      .from('claims')
      .update({
        transmission_status: 'SENT',
        status: 'IN_PROGRESS',
        updated_at: new Date().toISOString(),
      })
      .eq('id', claimId)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: `${claim.insurance_company}으로 자료 송신이 완료되었습니다.`,
    })
  } catch (err: any) {
    console.error('[CLAIM TRANSMISSION ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
