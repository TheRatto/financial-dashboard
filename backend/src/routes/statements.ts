import express from 'express';
import multer from 'multer';
import { StatementParser } from '../services/statementParser';
import { prisma } from '../db/';
import path from 'path';
import PDFParser from 'pdf-parse';
import fs from 'fs/promises';
import crypto from 'crypto';
import { importTransactions } from '../services/transactionService';
import { format } from 'date-fns';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (_req, file, cb) => {
    // Generate a random filename to prevent collisions
    const hash = crypto.createHash('md5').update(Date.now().toString()).digest('hex');
    cb(null, hash + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'));
    }
  }
});

router.post('/upload', upload.single('file'), async (req, res): Promise<void> => {
  try {
    const file = req.file;
    const { accountId } = req.body;

    console.log('\n=== Upload Request ===');
    console.log('File:', file?.originalname);
    console.log('Account ID:', accountId);

    if (!file || !accountId) {
      res.status(400).json({ error: 'Missing file or account ID' });
      return;
    }

    // Read and parse PDF
    const dataBuffer = await fs.readFile(file.path);
    const pdfData = await PDFParser(dataBuffer);
    const parser = new StatementParser();
    const parsedStatement = await parser.parseStatement(pdfData.text, accountId);

    // Get date range from transactions
    const transactions = parsedStatement.transactions;
    if (transactions.length === 0) {
      throw new Error('No transactions found in statement');
    }

    // Sort transactions by date to ensure correct range
    transactions.sort((a, b) => a.date.getTime() - b.date.getTime());
    
    const firstDate = transactions[0].date;
    const lastDate = transactions[transactions.length - 1].date;
    
    // Format the statement name
    const mainMonth = format(lastDate, 'MMMM yyyy');
    const dateRange = `(${format(firstDate, 'dd MMM')} to ${format(lastDate, 'dd MMM')})`;
    const uploadTime = format(new Date(), 'dd-MM-yyyy HH:mm');
    const statementName = `${mainMonth} ${dateRange} - Uploaded ${uploadTime}`;

    console.log('Generated statement name:', statementName);

    // Check for existing statement - simplify the check
    const existingStatement = await prisma.statement.findFirst({
      where: {
        accountId,
        month: lastDate.getMonth() + 1,
        year: lastDate.getFullYear(),
      }
    });

    if (existingStatement) {
      console.log('Duplicate statement found:', {
        existing: {
          month: existingStatement.month,
          year: existingStatement.year,
        },
        attempted: {
          month: lastDate.getMonth() + 1,
          year: lastDate.getFullYear(),
        }
      });
      await fs.unlink(file.path);
      res.status(400).json({ 
        error: 'A statement has already been uploaded for this month' 
      });
      return;
    }

    // Create statement record
    const result = await prisma.$transaction(async () => {
      console.log('Creating new statement with:', {  // Debug log
        fileName: statementName,
        month: lastDate.getMonth() + 1,
        year: lastDate.getFullYear(),
        bankName: parsedStatement.bankName,
        accountId
      });

      const newStatement = await prisma.statement.create({
        data: {
          fileName: statementName,
          filePath: file.path,
          month: lastDate.getMonth() + 1,  // Use actual date instead of parsed
          year: lastDate.getFullYear(),
          bankName: parsedStatement.bankName,
          accountId: accountId,
        },
      });

      console.log('Created statement:', newStatement);  // Debug log

      // Then import the transactions using the existing service
      const transactions = await importTransactions(
        parsedStatement.transactions.map(t => ({
          ...t,
          accountId,
          statementId: newStatement.id
        }))
      );

      return {
        statement: newStatement,
        transactionCount: transactions.length
      };
    });

    res.json({ 
      success: true, 
      ...result
    });

  } catch (error) {
    console.error('\n=== Upload Error ===');
    console.error('Error details:', error);
    res.status(500).json({ 
      error: 'Failed to process statement',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Delete statement endpoint
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.$transaction(async () => {
      // First, delete all transactions associated with this statement
      await prisma.transaction.updateMany({
        where: { statementId: id },
        data: { deleted: true }
      });

      // Then delete the statement
      await prisma.statement.delete({
        where: { id }
      });
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Statement deletion error:', error);
    res.status(500).json({ error: 'Failed to delete statement' });
  }
});

// Get statements for account
router.get('/account/:accountId', async (req, res) => {
  try {
    const { accountId } = req.params;
    const statements = await prisma.statement.findMany({
      where: {
        accountId: accountId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${statements.length} statements for account ${accountId}`);  // Debug log
    res.json(statements);
  } catch (error) {
    console.error('Error fetching statements:', error);
    res.status(500).json({ error: 'Failed to fetch statements' });
  }
});

export default router;