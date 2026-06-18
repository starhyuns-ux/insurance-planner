import { NextResponse } from 'next/server';
import { PDFDocument, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'public', 'templates');
    const file = 'hyundaifire.pdf';
    const filePath = path.join(templatesDir, file);
    
    const pdfBytes = fs.readFileSync(filePath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    
    for (const page of pages) {
      const { width, height } = page.getSize();
      const step = 50;
      for (let x = 0; x < width; x += step) {
        page.drawLine({ start: { x, y: 0 }, end: { x, y: height }, thickness: 0.5, color: rgb(1, 0, 0), opacity: 0.3 });
        page.drawText(`${x}`, { x: x + 2, y: 10, size: 8, color: rgb(1, 0, 0) });
      }
      for (let y = 0; y < height; y += step) {
        page.drawLine({ start: { x: 0, y }, end: { x: width, y }, thickness: 0.5, color: rgb(0, 0, 1), opacity: 0.3 });
        page.drawText(`${y}`, { x: 5, y: y + 2, size: 8, color: rgb(0, 0, 1) });
      }
      for (let x = 100; x < width; x += 100) {
        for (let y = 100; y < height; y += 100) {
          page.drawText(`(${x},${y})`, { x: x + 2, y: y + 2, size: 8, color: rgb(0, 0, 0), opacity: 0.5 });
        }
      }
    }

    const modifiedPdfBytes = await pdfDoc.save();
    
    return new NextResponse(modifiedPdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="grid_hyundaifire.pdf"',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
