import express from 'express';
import { TransactionType } from '@prisma/client';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '../services/transactionService';

const router = express.Router();

// Get transactions
router.get('/', async (req, res) => {
  try {
    const accountId = req.query.accountId as string | undefined;
    const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
    const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

    const transactions = await getTransactions(accountId, startDate, endDate);
    res.json(transactions);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Create transaction
router.post('/', async (req, res) => {
  try {
    const { date, description, amount, type, category, accountId, tags } = req.body;

    const transaction = await createTransaction({
      date: new Date(date),
      description,
      amount,
      type: type as TransactionType,
      category,
      accountId,
      tags
    });

    res.json(transaction);
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Failed to create transaction' });
  }
});

// Update transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { date, description, amount, type, category, tags, deleted } = req.body;

    const transaction = await updateTransaction(id, {
      ...(date && { date: new Date(date) }),
      ...(description && { description }),
      ...(amount && { amount }),
      ...(type && { type: type as TransactionType }),
      ...(category !== undefined && { category }),
      ...(tags && { tags }),
      ...(deleted !== undefined && { deleted })
    });

    res.json(transaction);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Failed to update transaction' });
  }
});

// Delete transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await deleteTransaction(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

export default router;