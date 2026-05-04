const { PDFDocument } = require('pdf-lib');
const fs = require('fs');

async function run() {
  const bytes = fs.readFileSync('/Users/stroy/insurance-plan/insurance-planner/public/templates/hyundaifire.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  const page5 = pages[4]; // 5th page
  
  // Extract content stream
  const { Contents } = page5.node.normalizedEntries();
  const contents = Array.isArray(Contents) ? Contents : [Contents];
  
  for (const content of contents) {
    const stream = pdfDoc.context.lookup(content);
    const decoded = stream.decode();
    const text = new TextDecoder().decode(decoded);
    console.log('--- STREAM ---');
    console.log(text);
  }
}
run();
