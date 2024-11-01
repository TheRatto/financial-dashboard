import pdf from 'pdf-parse';

export const pdfToText = async (buffer: Buffer): Promise<string> => {
  try {
    const data = await pdf(buffer);
    return data.text;
  } catch (error) {
    console.error('Error converting PDF to text:', error);
    throw new Error('Failed to convert PDF to text');
  }
};