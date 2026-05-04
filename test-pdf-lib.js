const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

async function test() {
  try {
    const bytes = fs.readFileSync('public/templates/hyundaifire.pdf');
    const pdfDoc = await PDFDocument.load(bytes, { ignoreEncryption: true });
    await pdfDoc.save();
    console.log("hyundaifire.pdf Save successful");
  } catch (e) {
    console.error("hyundaifire.pdf error:", e.message);
  }
}
test();
