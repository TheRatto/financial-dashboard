import * as fs from 'fs';
// @ts-ignore
import pdfParse from 'pdf-parse';

export class PDFParser {
    async parse(filePath: string): Promise<string> {
        try {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        } catch (error) {
            console.error('Error parsing PDF:', error);
            throw new Error('Failed to parse PDF file');
        }
    }
} 