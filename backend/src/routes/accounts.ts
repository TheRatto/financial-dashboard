import express from 'express';
import { PrismaClient, Prisma } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Add proper type for the where clause
type AccountWhereInput = Prisma.AccountWhereInput;

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
    const where: AccountWhereInput = {
      deleted: null
    };
    
    const accounts = await prisma.account.findMany({ where });
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

// Delete account
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const hardDelete = req.query.hard === 'true';

    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { 
          id,
          deleted: null
        },
      });

      if (!account) {
        return { status: 404, error: 'Account not found or already deleted' };
      }

      if (hardDelete) {
        await tx.account.delete({
          where: { id },
        });
      } else {
        await tx.account.update({
          where: { id },
          data: { 
            deleted: new Date(),
          },
        });
      }

      return { status: 204 };
    });

    if (result.status === 404) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Failed to delete account' });
  }
});

// Add restore route to undo soft deletes
router.post('/:id/restore', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.account.findFirst({
        where: { 
          id,
          deleted: { not: null }
        },
      });

      if (!account) {
        return { status: 404, error: 'Account not found or not deleted' };
      }

      const restored = await tx.account.update({
        where: { id },
        data: { 
          deleted: null,
        },
      });

      return { status: 200, data: restored };
    });

    if (result.status === 404) {
      res.status(404).json({ error: result.error });
      return;
    }

    res.json(result.data);
  } catch (error) {
    console.error('Error restoring account:', error);
    res.status(500).json({ error: 'Failed to restore account' });
  }
});

export default router; 