import type { Request, Response } from 'express';
import { extractTextFromPDF } from '../services/pdfService';
import { ParserManager } from '../services/parsers/ParserManager';
import type { BasicParsedTransaction } from '../types/transaction';
import type { PaySlipData } from '../types/payslip';

export const handleFileUpload = async (req: Request, res: Response<ApiResponse>) => {
  try {
    console.log('Upload request received:', {
      headers: req.headers,
      file: req.file ? {
        mimetype: req.file.mimetype,
        size: req.file.size,
        originalname: req.file.originalname
      } : 'No file'
    });

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        success: false,
        message: 'Only PDF files are allowed'
      });
    }

    // Extract text from PDF
    const text = await extractTextFromPDF(req.file.buffer);
    console.log('PDF text extracted, length:', text.length);
    
    // Find appropriate parser
    const parserManager = ParserManager.getInstance();
    const parser = await parserManager.findParser(text);
    if (!parser) {
      return res.status(400).json({
        success: false,
        message: 'No suitable parser found for this document'
      });
    }

    console.log('Parser found:', parser.name);

    // Parse document
    const result = await parser.parse(text);

    // Helper function to check if result is a bank statement
    const isBankStatement = (
      result: BasicParsedTransaction[] | PaySlipData
    ): result is BasicParsedTransaction[] => {
      return Array.isArray(result);
    };

    // Handle different result types
    if (isBankStatement(result)) {
      return res.json({
        success: true,
        type: 'bank_statement',
        message: 'Bank statement processed successfully',
        transactions: result,
        transactionCount: result.length
      });
    } else {
      return res.json({
        success: true,
        type: 'payslip',
        message: 'Payslip processed successfully',
        payslip: result
      });
    }

  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    });
  }
};

// Add type for the response
interface SuccessResponse {
  success: true;
  type: 'bank_statement' | 'payslip';
  message: string;
  transactions?: BasicParsedTransaction[];
  transactionCount?: number;
  payslip?: PaySlipData;
}

interface ErrorResponse {
  success: false;
  message: string;
}

type ApiResponse = SuccessResponse | ErrorResponse;