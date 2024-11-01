import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Create account
router.post('/', async (req, res) => {
  try {
    const { accountName, bankId } = req.body;
    
    const account = await prisma.account.create({
      data: {
        name: accountName,
        bankId: bankId,
      },
    });

    res.json(account);
  } catch (error) {
    console.error('Error creating account:', error);
    res.status(500).json({ error: 'Failed to create account' });
  }
});

// Get all accounts
router.get('/', async (_req, res) => {
  try {
    const accounts = await prisma.account.findMany();
    res.json(accounts);
  } catch (error) {
    console.error('Error fetching accounts:', error);
    res.status(500).json({ error: 'Failed to fetch accounts' });
  }
});

// Get single account
router.get('/:id', async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const account = await prisma.account.findUnique({
      where: { id },
    });
    
    if (!account) {
      res.status(404).json({ error: 'Account not found' });
      return;
    }
    
    res.json(account);
  } catch (error) {
    console.error('Error fetching account:', error);
    res.status(500).json({ error: 'Failed to fetch account' });
  }
});

export default router; 