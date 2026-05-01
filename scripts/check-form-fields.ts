import { PDFDocument } from 'pdf-lib';
import fs from 'fs';

async function checkFormFields(pdfPath: string) {
    const pdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(pdfBytes);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log(`File: ${pdfPath}`);
    console.log(`Number of fields: ${fields.length}`);
    if (fields.length > 0) {
        fields.forEach(field => {
            const name = field.getName();
            // get widgets for coordinates
            const widgets = field.acroField.getWidgets();
            if (widgets.length > 0) {
                const rect = widgets[0].getRectangle();
                console.log(`Field: ${name}, x: ${rect.x.toFixed(2)}, y: ${rect.y.toFixed(2)}, width: ${rect.width.toFixed(2)}, height: ${rect.height.toFixed(2)}`);
            } else {
                console.log(`Field: ${name} (no widget/rect found)`);
            }
        });
    } else {
        console.log('No form fields found in this PDF.');
    }
    console.log('---');
}

async function main() {
    const files = [
        'public/templates/aigfire.PDF',
        'public/templates/chubbfire.pdf'
    ];
    for (const file of files) {
        try {
            await checkFormFields(file);
        } catch (e) {
            console.error(`Error processing ${file}:`, e);
        }
    }
}

main();
