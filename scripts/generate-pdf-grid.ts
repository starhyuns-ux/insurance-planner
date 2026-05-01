import { PDFDocument, rgb } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

// 이 스크립트는 public/templates 안에 있는 모든 PDF 파일에 
// 50픽셀 간격으로 X, Y 좌표값을 그려서 새로운 PDF로 저장해 줍니다.
// 사용법: 터미널에서 `npx tsx scripts/generate-pdf-grid.ts` 실행

async function generateGridPDFs() {
  const templatesDir = path.join(process.cwd(), 'public', 'templates')
  
  if (!fs.existsSync(templatesDir)) {
    console.error('Error: public/templates 폴더가 존재하지 않습니다.')
    return
  }

  const files = fs.readdirSync(templatesDir).filter(file => file.toLowerCase().endsWith('.pdf') && !file.startsWith('grid_'))
  
  if (files.length === 0) {
    console.log('public/templates 폴더에 원본 PDF 파일이 없습니다.')
    return
  }

  for (const file of files) {
    console.log(`[GRID] ${file} 처리 중...`)
    const filePath = path.join(templatesDir, file)
    const pdfBytes = fs.readFileSync(filePath)
    
    const pdfDoc = await PDFDocument.load(pdfBytes)
    const pages = pdfDoc.getPages()
    
    // 첫 번째 페이지에만 격자 그리기
    if (pages.length > 0) {
      const page = pages[0]
      const { width, height } = page.getSize()

      // 50 단위로 가로선, 세로선 그리기
      const step = 50
      
      // X축 (세로선)
      for (let x = 0; x < width; x += step) {
        page.drawLine({
          start: { x, y: 0 },
          end: { x, y: height },
          thickness: x % 100 === 0 ? 1 : 0.5,
          color: x % 100 === 0 ? rgb(1, 0, 0) : rgb(1, 0.5, 0.5),
          opacity: 0.5,
        })
        page.drawText(`${x}`, { x: x + 2, y: 10, size: 8, color: rgb(1, 0, 0) })
        page.drawText(`${x}`, { x: x + 2, y: height - 10, size: 8, color: rgb(1, 0, 0) })
      }

      // Y축 (가로선)
      for (let y = 0; y < height; y += step) {
        page.drawLine({
          start: { x: 0, y },
          end: { x: width, y },
          thickness: y % 100 === 0 ? 1 : 0.5,
          color: y % 100 === 0 ? rgb(0, 0, 1) : rgb(0.5, 0.5, 1),
          opacity: 0.5,
        })
        page.drawText(`${y}`, { x: 5, y: y + 2, size: 8, color: rgb(0, 0, 1) })
        page.drawText(`${y}`, { x: width - 20, y: y + 2, size: 8, color: rgb(0, 0, 1) })
      }
      
      // 화면 곳곳에 (x, y) 텍스트 뿌리기 (100간격)
      for (let x = 100; x < width; x += 100) {
        for (let y = 100; y < height; y += 100) {
          page.drawText(`(${x},${y})`, { x: x + 2, y: y + 2, size: 8, color: rgb(0, 0, 0), opacity: 0.7 })
        }
      }
    }

    const modifiedPdfBytes = await pdfDoc.save()
    const outPath = path.join(templatesDir, `grid_${file}`)
    fs.writeFileSync(outPath, modifiedPdfBytes)
    console.log(`✅ 저장 완료: public/templates/grid_${file}`)
  }
  
  console.log('\n모든 격자(Grid) PDF가 성공적으로 생성되었습니다!')
  console.log('이 grid_...pdf 파일들을 열어서 빈칸의 위치(X, Y 숫자)를 찾아 lib/pdf-generator.ts 에 입력하세요.')
}

generateGridPDFs().catch(console.error)
