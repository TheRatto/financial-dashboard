import fs from 'fs';
import pdf from 'pdf-parse';

// Keep the existing extractTextFromPDF function for compatibility
export async function extractTextFromPDF(input: Buffer | string): Promise<string> {
  try {
    const buffer = typeof input === 'string' 
      ? fs.readFileSync(input) 
      : input;
    
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
}

// Add new PDFService class but don't enforce its usage yet
export class PDFService {
  async extractText(input: Buffer | string): Promise<string> {
    return extractTextFromPDF(input);
  }

  static isPDF(filename: string): boolean {
    return filename.toLowerCase().endsWith('.pdf');
  }
}

export const pdfService = new PDFService();