import { INGParser } from '../INGParser';
import { readFileSync } from 'fs';
import { join } from 'path';
import { TransactionType } from '@prisma/client';

describe('INGParser', () => {
  const parser = new INGParser();

  describe('canParse', () => {
    it('should detect ING credit card statement', async () => {
      const content = readFileSync(
        join(__dirname, '../__fixtures__/ing-credit-sample.txt'),
        'utf8'
      );
      const result = await parser.canParse(content);
      expect(result).toBe(true);
    });

    it('should detect ING savings statement', async () => {
      const content = readFileSync(
        join(__dirname, '../__fixtures__/ing-savings-sample.txt'),
        'utf8'
      );
      const result = await parser.canParse(content);
      expect(result).toBe(true);
    });

    it('should reject non-ING statement', async () => {
      const result = await parser.canParse('Some random text with dates 01/01/2024');
      expect(result).toBe(false);
    });
  });

  describe('parse', () => {
    it('should parse credit card transactions correctly', async () => {
      const content = readFileSync(
        join(__dirname, '../__fixtures__/ing-credit-sample.txt'),
        'utf8'
      );
      const transactions = await parser.parse(content);
      
      expect(transactions).toHaveLength(3);
      expect(transactions[0]).toEqual({
        date: expect.any(Date),
        description: expect.any(String),
        amount: 500,
        type: TransactionType.DEBIT,
        balance: 1500
      });
    });

    it('should parse savings transactions correctly', async () => {
      const content = readFileSync(
        join(__dirname, '../__fixtures__/ing-savings-sample.txt'),
        'utf8'
      );
      const transactions = await parser.parse(content);
      
      expect(transactions).toHaveLength(3);
      expect(transactions[0]).toEqual({
        date: expect.any(Date),
        description: expect.any(String),
        amount: 2500,
        type: TransactionType.CREDIT,
        balance: 15500
      });
    });
  });
}); 