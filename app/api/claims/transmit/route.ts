import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseServer'
import { generateClaimPDF } from '@/lib/pdf-generator'
import { faxClient } from '@/lib/fax-client'

// Mapping of insurance companies to their central fax numbers (placeholder values)
const INSURANCE_FAX_NUMBERS: Record<string, string> = {
  '삼성화재': '0505-162-0777',
  '현대해상': '0507-774-6060',
  'DB손해보험': '0505-181-4861',
  'KB손해보험': '0505-136-6500',
  '메리츠화재': '0505-021-3400',
  '흥국화재': '0504-800-0168',
  '롯데손해보험': '0507-333-9999',
  'MG손해보험': '0505-088-1646',
  '한화손해보험': '0505-181-0005', // 기존 placeholder
  '교보생명': '02-721-3842',
  'KB라이프생명': '02-6220-9912',
  'NH농협생명': '02-3786-8540',
  '동양생명': '0502-779-1004',
  '미래에셋생명': '0505-130-0000',
  // 삼성생명, 한화생명, 신한라이프 등은 고정 팩스 없음 (UI에서 입력을 유도해야 함)
}

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
    // 우선순위: overrideFax (사용자 입력) > INSURANCE_FAX_NUMBERS (매핑) > Default
    const targetFax = overrideFax || INSURANCE_FAX_NUMBERS[claim.insurance_company] || '0505-000-0000'
    
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
        files: filesToTransmit,
      })
      console.log(`[CLAIM TRANSMIT] Fax sent successfully. Receipt: ${faxResult.receiptId}`)
    } catch (faxErr: any) {
      console.error('[CLAIM TRANSMIT] Fax Transmission Failed:', faxErr)
      return NextResponse.json({ error: `팩스 전송 실패: ${faxErr.message}` }, { status: 502 })
    }

    // 6. Update Database with transmission details
    const { error: updateError } = await supabaseAdmin
      .from('claims')
      .update({
        transmission_status: 'SENT',
        status: 'IN_PROGRESS',
        fax_receipt_id: faxResult.receiptId,
        fax_status: faxResult.status,
        fax_sent_at: new Date().toISOString(),
        fax_pages: filesToTransmit.length,
        updated_at: new Date().toISOString(),
      })
      .eq('id', claimId)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: `${claim.insurance_company} (${targetFax})으로 총 ${filesToTransmit.length}매의 서류가 성공적으로 전송되었습니다.`,
      receiptId: faxResult.receiptId
    })

  } catch (err: any) {
    console.error('[CLAIM TRANSMISSION ERROR]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
