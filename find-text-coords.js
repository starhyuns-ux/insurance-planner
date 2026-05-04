const { PDFDocument, PDFName, PDFString, PDFHexString } = require('/Users/stroy/insurance-plan/insurance-planner/node_modules/pdf-lib');
const fs = require('fs');

async function run() {
  const bytes = fs.readFileSync('/Users/stroy/insurance-plan/insurance-planner/public/templates/hyundaifire.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  const page5 = pages[4];
  
  const { Contents } = page5.node.normalizedEntries();
  const contents = Array.isArray(Contents) ? Contents : [Contents];
  
  for (const content of contents) {
    const stream = pdfDoc.context.lookup(content);
    const decoded = stream.decode();
    const text = new TextDecoder().decode(decoded);
    
    // Look for text operators like (string) Tj or [string] TJ
    // And try to find coordinates before them (e.g. 1 0 0 1 x y Tm)
    const lines = text.split('\n');
    let lastX = 0, lastY = 0;
    for (let line of lines) {
      const tmMatch = line.match(/([0-9.-]+)\s+([0-9.-]+)\s+Tm/);
      if (tmMatch) {
        lastX = parseFloat(tmMatch[1]);
        lastY = parseFloat(tmMatch[2]);
      }
      const tdMatch = line.match(/([0-9.-]+)\s+([0-9.-]+)\s+Td/);
      if (tdMatch) {
        lastX += parseFloat(tdMatch[1]);
        lastY += parseFloat(tdMatch[2]);
      }
      
      // Look for strings (highly simplified)
      if (line.includes('Tj') || line.includes('TJ')) {
        console.log(`Pos: (${Math.round(lastX)}, ${Math.round(lastY)}) -> ${line}`);
      }
    }
  }
}
run();
