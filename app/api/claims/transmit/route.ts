import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { generateClaimPDF } from '@/lib/pdf-generator'
import { faxClient } from '@/lib/fax-client'

import { INSURANCE_COMPANIES } from '@/lib/constants/insurance'


export async function POST(req: NextRequest) {
  try {
    const { claimId, overrideFax } = await req.json()
    console.log(`[CLAIM TRANSMIT] Started for Claim ID: ${claimId}`)

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
    let claimPdfBuffer: Buffer
    try {
      console.log(`[CLAIM TRANSMIT] Generating PDF for ${claim.customer_name}...`)
      claimPdfBuffer = await generateClaimPDF(claim, planner)
      console.log('[CLAIM TRANSMIT] PDF generated successfully.')
    } catch (pdfErr: any) {
      console.error('[CLAIM TRANSMIT] PDF Generation Failed:', pdfErr)
      return NextResponse.json({ error: `청구서 PDF 생성 실패: ${pdfErr.message}` }, { status: 500 })
    }

    // 3b. Upload PDF to Storage for archiving/viewing
    let claimPdfUrl = ''
    try {
      const pdfPath = `claims/generated/claim_${claimId}_${Date.now()}.pdf`
      const { error: uploadError } = await supabaseAdmin.storage
        .from('planner-assets')
        .upload(pdfPath, claimPdfBuffer, { contentType: 'application/pdf', upsert: true })
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabaseAdmin.storage
          .from('planner-assets')
          .getPublicUrl(pdfPath)
        claimPdfUrl = publicUrl
        console.log(`[CLAIM TRANSMIT] PDF archived at: ${claimPdfUrl}`)
      }
    } catch (archiveErr) {
      console.warn('[CLAIM TRANSMIT] PDF Archiving failed (non-critical):', archiveErr)
    }

    // 4. Collect All Files (Generated Form + Customer Attachments)
    const filesToTransmit: Buffer[] = [claimPdfBuffer]
    
    // Download customer attachments from Supabase storage
    if (claim.image_urls && claim.image_urls.length > 0) {
      console.log(`[CLAIM TRANSMIT] Downloading ${claim.image_urls.length} attachments...`)
      for (const url of claim.image_urls) {
        try {
          // Robust path extraction from Supabase public URL
          // Format: .../object/public/{bucket}/{path/to/file}
          let path = ''
          if (url.includes('/public/planner-assets/')) {
            path = url.split('/public/planner-assets/')[1]
          } else {
            path = url.split('/').slice(-3).join('/')
          }

          console.log(`[CLAIM TRANSMIT] Downloading file from path: ${path}`)
          const { data: fileData, error: dlError } = await supabaseAdmin.storage
            .from('planner-assets')
            .download(path)
          
          if (dlError) throw dlError
          if (fileData) {
            filesToTransmit.push(Buffer.from(await fileData.arrayBuffer()))
            console.log(`[CLAIM TRANSMIT] Attachment downloaded: ${path}`)
          }
        } catch (downloadErr: any) {
          console.error(`[CLAIM TRANSMIT] Failed to download attachment: ${url}`, downloadErr)
          // We don't stop the whole process if one image fails, but we log it
        }
      }
    }

    // 5. Transmit via Fax API
    // 우선순위: overrideFax (사용자 입력) > INSURANCE_COMPANIES (매핑) > Default
    const targetFax = overrideFax || INSURANCE_COMPANIES[claim.insurance_company]?.fax || '0505-000-0000'
    
    if (targetFax === '0505-000-0000' && !overrideFax) {
      return NextResponse.json({ 
        error: `${claim.insurance_company}의 팩스 번호가 등록되어 있지 않습니다. 직접 팩스 번호를 입력해주세요.` 
      }, { status: 400 })
    }

    console.log(`[CLAIM TRANSMIT] Sending fax to ${targetFax}...`)
    let faxResult: any
    try {
      faxResult = await faxClient.sendFax({
        receiverName: claim.insurance_company || '보험사 보상과',
        receiverNum: targetFax,
        senderName: planner?.name || '보상청구지원',
        senderNum: planner?.phone || '010-0000-0000',
        title: `[보상청구] ${claim.customer_name} 고객님 보상 신청 건`,
        files: filesToTransmit.map((data, index) => ({ 
          name: `claim_doc_${index + 1}.pdf`, 
          data 
        })),
      })
      console.log(`[CLAIM TRANSMIT] Fax sent successfully. Receipt: ${faxResult.receiptId}`)
    } catch (faxErr: any) {
      console.error('[CLAIM TRANSMIT] Fax Transmission Failed:', faxErr)
      return NextResponse.json({ error: `팩스 전송 실패: ${faxErr.message}` }, { status: 502 })
    }

    // 6. Update Database with transmission details & MASK sensitive data (PIPA Compliance)
    console.log(`[CLAIM TRANSMIT] Masking sensitive data for Claim ID: ${claimId} after success...`)
    
    // Create masked versions of sensitive data
    const rawResNum = claim.resident_number || ''
    const maskedResNum = rawResNum.includes('-') 
      ? `${rawResNum.split('-')[0]}-${rawResNum.split('-')[1].charAt(0)}******`
      : `${rawResNum.substring(0, 6)}-*******`

    const rawBankAcc = claim.bank_account || ''
    const maskedBankAcc = rawBankAcc.length > 4
      ? rawBankAcc.substring(0, 2) + '*'.repeat(rawBankAcc.length - 4) + rawBankAcc.slice(-2)
      : '****'

    const { error: updateError } = await supabaseAdmin
      .from('claims')
      .update({
        transmission_status: 'SENT',
        status: 'IN_PROGRESS',
        fax_receipt_id: faxResult.receiptId,
        fax_status: faxResult.status,
        fax_sent_at: new Date().toISOString(),
        fax_pages: filesToTransmit.length,
        // claim_pdf_url: claimPdfUrl, // 제거: DB에 컬럼이 없어 오류 발생
        // PIPA: Overwrite original sensitive data with masked versions
        resident_number: maskedResNum,
        bank_account: maskedBankAcc,
        updated_at: new Date().toISOString(),
      })
      .eq('id', claimId)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: `${claim.insurance_company} (${targetFax})으로 총 ${filesToTransmit.length}매의 서류가 성공적으로 전송되었습니다.`,
      receiptId: faxResult.receiptId,
      claimPdfUrl: claimPdfUrl
    })

  } catch (err: any) {
    console.error('[CLAIM TRANSMISSION ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
