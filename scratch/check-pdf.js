const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function checkPdf() {
  const filePath = path.join(process.cwd(), 'public', 'templates', 'hyundaifire.pdf');
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  const page = pdfDoc.getPages()[0];
  const { width, height } = page.getSize();
  console.log(`Page Size: ${width} x ${height}`);
}

checkPdf().catch(console.error);
