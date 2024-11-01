import { Request, Response } from 'express';
import { processStatement } from '../services/pdfService';

export const handleFileUpload = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // Process the PDF file
    const transactions = await processStatement(req.file.path);

    // For now, just return success
    res.json({
      success: true,
      message: 'File uploaded successfully',
      statementId: req.file.filename,
      transactionCount: transactions.length
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};