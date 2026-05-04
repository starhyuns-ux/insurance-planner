const { PDFDocument, rgb } = require('/Users/stroy/insurance-plan/insurance-planner/node_modules/pdf-lib');
const fs = require('fs');
const path = require('path');

async function generateGridPDFs() {
  const templatesDir = '/Users/stroy/insurance-plan/insurance-planner/public/templates';
  const file = 'hyundaifire.pdf';
  const filePath = path.join(templatesDir, file);
  const pdfBytes = fs.readFileSync(filePath);
  
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const pages = pdfDoc.getPages();
  
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const { width, height } = page.getSize();
    const step = 50;
    
    for (let x = 0; x < width; x += step) {
      page.drawLine({
        start: { x, y: 0 },
        end: { x, y: height },
        thickness: x % 100 === 0 ? 1 : 0.5,
        color: x % 100 === 0 ? rgb(1, 0, 0) : rgb(1, 0.5, 0.5),
        opacity: 0.5,
      });
      page.drawText(`${x}`, { x: x + 2, y: 10, size: 8, color: rgb(1, 0, 0) });
    }

    for (let y = 0; y < height; y += step) {
      page.drawLine({
        start: { x: 0, y },
        end: { x: width, y },
        thickness: y % 100 === 0 ? 1 : 0.5,
        color: y % 100 === 0 ? rgb(0, 0, 1) : rgb(0.5, 0.5, 1),
        opacity: 0.5,
      });
      page.drawText(`${y}`, { x: 5, y: y + 2, size: 8, color: rgb(0, 0, 1) });
    }
    
    for (let x = 100; x < width; x += 100) {
      for (let y = 100; y < height; y += 100) {
        page.drawText(`(${x},${y})`, { x: x + 2, y: y + 2, size: 8, color: rgb(0, 0, 0), opacity: 0.7 });
      }
    }
  }

  const modifiedPdfBytes = await pdfDoc.save();
  const outPath = path.join(templatesDir, `grid_${file}`);
  fs.writeFileSync(outPath, modifiedPdfBytes);
  console.log(`✅ Saved: ${outPath}`);
}

generateGridPDFs().catch(console.error);
