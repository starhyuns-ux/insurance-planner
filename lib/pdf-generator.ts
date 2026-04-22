import { PDFDocument, rgb } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'

// Coordinate mappings for specific insurance companies
// Coordinates are in points (1/72 inch), starting from bottom-left
const COMPANY_TEMPLATES: Record<string, any> = {
  '삼성화재': {
    templatePath: '/templates/samsung_fire.pdf',
    fields: {
      customer_name: { x: 100, y: 700, size: 10 },
      resident_number: { x: 100, y: 680, size: 10 },
      customer_phone: { x: 100, y: 660, size: 10 },
      address: { x: 100, y: 640, size: 10 },
      bank_name: { x: 300, y: 500, size: 10 },
      bank_account: { x: 300, y: 480, size: 10 },
      accident_detail: { x: 100, y: 400, size: 10, maxWidth: 400 },
    }
  },
  '현대해상': {
    templatePath: '/templates/hyundai_marine.pdf',
    fields: {
      customer_name: { x: 120, y: 720, size: 10 },
      // ... more coordinates
    }
  }
}

/**
 * PDF Generator for Insurance Claims
 * Generates a company-specific PDF if a template exists, 
 * otherwise falls back to a standardized Korean insurance claim form.
 */
export async function generateClaimPDF(claim: any, planner: any) {
  // Load fonts for Korean support - using multiple reliable CDNs
  const fontUrls = [
    'https://fonts.gstatic.com/s/nanumgothic/v21/PN_oTa62_f0p9OAwOTo3fYNfmsS_P6E.ttf',
    'https://cdn.jsdelivr.net/gh/google/fonts/ofl/nanumgothic/NanumGothic-Regular.ttf',
    'https://github.com/google/fonts/raw/main/ofl/nanumgothic/NanumGothic-Regular.ttf'
  ]
  
  let fontBytes: ArrayBuffer | null = null
  let lastError: any = null

  for (const url of fontUrls) {
    try {
      console.log(`[PDF] Attempting to load font from: ${url}`)
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })
      
      if (res.ok) {
        fontBytes = await res.arrayBuffer()
        console.log(`[PDF] Successfully loaded font from: ${url}`)
        break
      } else {
        console.warn(`[PDF] Failed to load font from ${url}: ${res.status} ${res.statusText}`)
      }
    } catch (err: any) {
      console.warn(`[PDF] Error fetching font from ${url}:`, err.message)
      lastError = err
    }
  }

  if (!fontBytes) {
    throw new Error(`한글 폰트 로드 실패: 외부 폰트 서버(Google/Jsdelivr)에 접속할 수 없습니다. (${lastError?.message || 'Unknown error'})`)
  }

  const companyConfig = COMPANY_TEMPLATES[claim.insurance_company]
  let pdfDoc: PDFDocument

  // 1. Try to load company-specific template
  if (companyConfig) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const templateRes = await fetch(`${baseUrl}${companyConfig.templatePath}`)
      
      if (templateRes.ok) {
        const templateBytes = await templateRes.arrayBuffer()
        pdfDoc = await PDFDocument.load(templateBytes)
        pdfDoc.registerFontkit(fontkit)
        const koreanFont = await pdfDoc.embedFont(fontBytes)
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]

        // Fill fields based on mapping
        for (const [key, coord] of Object.entries(companyConfig.fields) as [string, any][]) {
          const value = claim[key] || '-'
          firstPage.drawText(String(value), {
            x: coord.x,
            y: coord.y,
            size: coord.size || 10,
            font: koreanFont,
            color: rgb(0, 0, 0),
          })
        }

        const pdfBytes = await pdfDoc.save()
        return Buffer.from(pdfBytes)
      }
    } catch (err) {
      console.warn(`[PDF] Failed to load template for ${claim.insurance_company}, falling back to standard form.`, err)
    }
  }

  // 2. Fallback to Standard Form Generation (Existing Logic)
  pdfDoc = await PDFDocument.create()
  pdfDoc.registerFontkit(fontkit)
  const koreanFont = await pdfDoc.embedFont(fontBytes)
  const koreanFontBold = await pdfDoc.embedFont(fontBytes)

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

  page.drawText('보 험 금  청 구  신 신청 서', {
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

  // 4. Consent Info Summary
  drawRow('4. 동의 정보 요약', null, true)
  drawRow('개인정보 동의', claim.consent_third_party ? '동의 완료 (상세 내역 2페이지 참조)' : '미동의')
  drawRow('동의 일시', claim.consent_at ? new Date(claim.consent_at).toLocaleString('ko-KR') : '-')
  drawRow('서명 방식', '전자 자필 서명 (Handwritten)')

  // Footer on Page 1
  const footerText = '본 서류는 보험금 청구를 위한 개인정보 제공 동의서와 함께 법적 효력을 갖습니다.'
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

  // Final Border for Page 1
  page.drawRectangle({
    x: 30,
    y: 30,
    width: width - 60,
    height: height - 60,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  })

  // ------------------------------------------------------------------
  // PAGE 2: Detailed Personal (Credit) Information Consent Form
  // ------------------------------------------------------------------
  const consentPage = pdfDoc.addPage([595.28, 841.89])
  const cpWidth = consentPage.getSize().width
  const cpHeight = consentPage.getSize().height

  consentPage.drawText('개인(신용)정보 처리 동의서 (보상청구용)', {
    x: cpWidth / 2 - 140,
    y: cpHeight - 60,
    size: 14,
    font: koreanFontBold,
  })

  let cpY = cpHeight - 90
  const drawConsentText = (text: string, size = 8, isBold = false) => {
    const lines = text.split('\n')
    for (const line of lines) {
      consentPage.drawText(line, {
        x: 50,
        y: cpY,
        size,
        font: isBold ? koreanFontBold : koreanFont,
      })
      cpY -= size + 4
    }
  }

  drawConsentText('보험사 및 보험협회 등 관계 기관은 「개인정보보호법」 및 「신용정보의 이용 및 보호에 관한 법률」에 따라 \n본인의 개인(신용)정보를 처리하고자 하는 경우 본인의 동의를 얻어야 합니다.', 8)
  cpY -= 5

  const drawSectionHeader = (num: string, title: string) => {
    consentPage.drawRectangle({ x: 45, y: cpY - 15, width: cpWidth - 90, height: 18, color: rgb(0.95, 0.95, 0.95) })
    consentPage.drawText(`${num}. ${title}`, { x: 50, y: cpY - 10, size: 9, font: koreanFontBold })
    consentPage.drawText('[V] 본인 동의함  [V] 수익자 동의함', { x: cpWidth - 200, y: cpY - 10, size: 8, font: koreanFontBold, color: rgb(0.2, 0.5, 0.2) })
    cpY -= 25
  }

  drawSectionHeader('1', '개인(신용)정보 수집·이용에 관한 사항')
  drawConsentText('- 목적: 보험금 지급·심사, 보험사고 조사, 보험계약 관리, 민원 처리, 법령상 의무이행 등\n- 항목: 성명, 주민번호, 주소, 연락처, 계좌정보, 질병 및 상해정보, 진료기록 등\n- 보유기간: 수집·이용 동의일로부터 거래종료 후 5년까지', 8)
  cpY -= 10

  drawSectionHeader('2', '개인(신용)정보의 조회에 관한 사항')
  drawConsentText('- 목적: 보험사고 조사, 보험금 지급·심사\n- 조회기관: 보험요율산출기관, 보험협회, 의료기관, 공공기관 등\n- 조회정보: 보험계약정보, 보험금 지급정보, 사고정보, 질병 및 상해 관련 정보 등', 8)
  cpY -= 10

  drawSectionHeader('3', '개인(신용)정보의 제공에 관한 사항')
  drawConsentText('- 제공받는 자: 타 보험사, 재보험사, 보험협회, 손해사정법인, 의료기관, 법률자문 등\n- 목적: 보험사고 조사, 보험금 지급·심사, 분쟁해결, 법령상 업무수행 등\n- 기간: 제공받는 자의 목적 달성 시까지 (최대 5년)', 8)
  cpY -= 10

  drawSectionHeader('4', '민감정보 및 고유식별정보 처리에 관한 사항')
  drawConsentText('상기 1~3항의 목적과 관련하여 귀하의 민감정보(질병·상해정보) 및 \n고유식별정보(주민등록번호, 외국인등록번호)를 처리하는 것에 동의합니다.', 8, true)
  cpY -= 20

  // Signature Block
  consentPage.drawRectangle({
    x: cpWidth / 2 - 120,
    y: cpY - 150,
    width: 240,
    height: 140,
    borderColor: rgb(0.7, 0.7, 0.7),
    borderWidth: 1,
  })

  // Try to embed Signature Image
  if (claim.image_urls && claim.image_urls.length > 0) {
    try {
      const signatureUrl = claim.image_urls[0] // Standard: First image is signature
      console.log(`[PDF GENERATOR] Fetching signature image from: ${signatureUrl}`)
      const sigResponse = await fetch(signatureUrl)
      if (sigResponse.ok) {
        const sigImageBytes = await sigResponse.arrayBuffer()
        const sigImage = await pdfDoc.embedPng(sigImageBytes)
        
        const dims = sigImage.scale(0.4)
        consentPage.drawImage(sigImage, {
          x: cpWidth / 2 - dims.width / 2,
          y: cpY - 130,
          width: dims.width,
          height: dims.height,
        })
      }
    } catch (err) {
      console.error('[PDF GENERATOR] Failed to embed signature image:', err)
      consentPage.drawText('(서명 데이터 로드 실패)', { x: cpWidth / 2 - 40, y: cpY - 80, size: 10, font: koreanFont, color: rgb(1, 0, 0) })
    }
  }

  consentPage.drawText('위 본인(및 수익자)은 상기 내용을 충분히 이해하고 동의합니다.', {
    x: cpWidth / 2 - 130,
    y: cpY - 180,
    size: 10,
    font: koreanFontBold,
  })

  const signatureName = `${claim.customer_name} (인/서명)`
  consentPage.drawText(signatureName, {
    x: cpWidth / 2 - koreanFontBold.widthOfTextAtSize(signatureName, 12) / 2,
    y: cpY - 200,
    size: 12,
    font: koreanFontBold,
  })

  const finalStamp = `동의 일시: ${new Date(claim.consent_at || claim.created_at).toLocaleString('ko-KR')}`
  consentPage.drawText(finalStamp, {
    x: cpWidth / 2 - koreanFont.widthOfTextAtSize(finalStamp, 9) / 2,
    y: cpY - 220,
    size: 9,
    font: koreanFont,
  })

  // Final Border for Page 2
  consentPage.drawRectangle({
    x: 30,
    y: 30,
    width: cpWidth - 60,
    height: cpHeight - 60,
    borderColor: rgb(0.8, 0.8, 0.8),
    borderWidth: 0.5,
  })

  const pdfBytes = await pdfDoc.save()
  return Buffer.from(pdfBytes)
}
