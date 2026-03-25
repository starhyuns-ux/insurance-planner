import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

/**
 * PDF Generator for Insurance Claims
 * Generates a standardized Korean insurance claim form from claim and planner data.
 */
export async function generateClaimPDF(claim: any, planner: any) {
  // Load fonts for Korean support
  // Note: For production, you should use a local font file.
  // Using a generic URL for NanumGothic from a public CDN for this implementation.
  const fontUrl = 'https://cdn.jsdelivr.net/gh/webfontworld/nanum/NanumGothic.ttf'
  const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer())

  const pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const koreanFont = await pdfDoc.embedFont(fontBytes)
  const koreanFontBold = await pdfDoc.embedFont(fontBytes) // Using same for now

  let page = pdfDoc.addPage([595.28, 841.89]) // A4
  const { width, height } = page.getSize()
  const fontSize = 10
  const titleSize = 18

  // Draw Header
  page.drawRectangle({
    x: 40,
    y: height - 100,
    width: width - 80,
    height: 60,
    color: rgb(0.95, 0.95, 0.98),
    borderColor: rgb(0.1, 0.1, 0.4),
    borderWidth: 1,
  })

  page.drawText('보 험 금  청 구  신 청 서', {
    x: width / 2 - 100,
    y: height - 75,
    size: titleSize,
    font: koreanFontBold,
    color: rgb(0.1, 0.1, 0.4),
  })

  // Helper function for table rows
  let currentY = height - 130
  const drawRow = (label: string, value: string | null | undefined, isTitle = false) => {
    if (isTitle) {
      page.drawRectangle({
        x: 40,
        y: currentY - 20,
        width: width - 80,
        height: 20,
        color: rgb(0.9, 0.9, 0.9),
      })
      page.drawText(label, { x: 50, y: currentY - 15, size: fontSize, font: koreanFontBold })
      currentY -= 25
      return
    }

    page.drawText(label, { x: 50, y: currentY, size: fontSize, font: koreanFontBold, color: rgb(0.4, 0.4, 0.4) })
    page.drawText(String(value || '-'), { x: 180, y: currentY, size: fontSize, font: koreanFont })
    
    // Draw separator line
    page.drawLine({
      start: { x: 40, y: currentY - 5 },
      end: { x: width - 40, y: currentY - 5 },
      thickness: 0.5,
      color: rgb(0.8, 0.8, 0.8),
    })
    currentY -= 20
  }

  // 1. Customer Info
  drawRow('1. 인적 사항', null, true)
  drawRow('성 명', claim.customer_name)
  drawRow('주민등록번호', claim.resident_number) // Already masked by the app
  drawRow('연락처', claim.customer_phone)
  drawRow('주 소', claim.address)
  drawRow('계약자 관계', claim.same_as_policyholder ? '본인' : `기타 (${claim.policyholder_name})`)

  currentY -= 15

  // 2. Accident Info
  drawRow('2. 사고 및 진단 내용', null, true)
  drawRow('사고 유형', claim.accident_type)
  drawRow('사고 내용', claim.accident_detail)
  if (claim.accident_type === '교통사고') {
    drawRow('사고 경위', claim.car_accident_detail)
    drawRow('차량 번호', claim.car_plate_number)
    drawRow('자보 처리', claim.car_insurance_claim ? '예' : '아니오')
    if (claim.car_insurance_claim) {
      drawRow('보상 보험사', claim.car_insurance_company)
      drawRow('보상 담당자', claim.car_agent_phone)
    }
  }

  currentY -= 15

  // 3. Payment Info
  drawRow('3. 보험금 수령 계좌', null, true)
  drawRow('은 행 명', claim.bank_name)
  drawRow('계좌 번호', claim.bank_account)
  drawRow('예 금 주', claim.bank_holder)
  drawRow('수령 방법', claim.payment_method === 'GENERAL' ? '일반 송금' : '자동 이체')

  currentY -= 15

  // 4. Planner & Consent Info
  drawRow('4. 접수 및 동의 정보', null, true)
  drawRow('담당 설계사', `${planner?.name} (${planner?.affiliation || '개인'})`)
  drawRow('설계사 연락처', planner?.phone)
  drawRow('개인정보 동의', claim.consent_third_party ? '동의 완료' : '미동의')
  drawRow('동의 일시', claim.consent_at ? new Date(claim.consent_at).toLocaleString('ko-KR') : '-')
  drawRow('서명 방식', claim.signature_type === 'FACE' ? '대면 서명' : '온라인/비대면 서명')

  // Footer footer
  const footerText = '위 내용은 고지된 정보와 일치하며, 보험금 청구를 위한 개인정보 제공에 동의합니다.'
  page.drawText(footerText, {
    x: width / 2 - koreanFont.widthOfTextAtSize(footerText, 10) / 2,
    y: 60,
    size: 10,
    font: koreanFont,
    color: rgb(0.5, 0.5, 0.5),
  })

  const dateStr = `신청일시: ${new Date(claim.created_at).toLocaleString('ko-KR')}`
  page.drawText(dateStr, {
    x: width / 2 - koreanFont.widthOfTextAtSize(dateStr, 9) / 2,
    y: 45,
    size: 9,
    font: koreanFont,
    color: rgb(0.5, 0.5, 0.5),
  })

  // Final Border
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
