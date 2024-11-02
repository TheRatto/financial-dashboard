import type { BankParser } from '../../../types/parser';
import type { BasicParsedTransaction } from '../../../types/transaction';
import { TransactionType } from '@prisma/client';
import { parse } from 'date-fns';

export class INGParser implements BankParser {
  name = 'ING';

  private patterns = {
    date: /(\d{2}\/\d{2}\/\d{4})/,
    amount: /(-?\$?\d+,?\d*\.\d{2})/g,
    creditCard: /(Orange One|Rewards Platinum|Credit Card)/i,
    savings: /(Savings Maximiser|Savings Account)/i,
    datePattern: /^(\d{2})\/(\d{2})\/(\d{4})/,
    moneyPattern: /(-?\$?\d+,?\d*\.\d{2})/g
  };

  async canParse(text: string): Promise<boolean> {
    console.log('\n=== ING Parser Detection ===');
    
    const hasING = text.includes('ING') || 
                   text.includes('Orange One') || 
                   text.includes('Savings Maximiser');
    const hasDate = this.patterns.date.test(text);
    const hasAmount = this.patterns.amount.test(text);
    const isStatement = hasING && hasDate && hasAmount;

    console.log('Detection Results:', {
      hasING,
      hasDate,
      hasAmount,
      firstChars: text.substring(0, 200)
    });

    return isStatement;
  }

  async parse(text: string): Promise<BasicParsedTransaction[]> {
    const transactions: BasicParsedTransaction[] = [];
    const lines = text.split('\n');
    const accountType = this.detectAccountType(text);
    
    console.log(`\n=== Starting ING ${accountType} Parser ===`);
    console.log(`Processing ${lines.length} lines`);

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.includes('Interest rate')) continue;

      if (accountType === 'credit') {
        const transaction = await this.parseCreditCardLine(trimmedLine);
        if (transaction) {
          transactions.push({
            ...transaction,
            balance: transaction.balance || 0  // Ensure balance is always provided
          });
        }
      } else {
        const transaction = await this.parseSavingsLine(trimmedLine);
        if (transaction) {
          transactions.push({
            ...transaction,
            balance: transaction.balance || 0  // Ensure balance is always provided
          });
        }
      }
    }

    console.log('\n=== Parsing Summary ===');
    console.log(`Total lines processed: ${lines.length}`);
    console.log(`Successful transactions: ${transactions.length}`);
    console.log(`Account type: ${accountType}`);

    return transactions;
  }

  private detectAccountType(text: string): 'credit' | 'savings' {
    return this.patterns.creditCard.test(text) ? 'credit' : 'savings';
  }

  private async parseCreditCardLine(
    line: string
  ): Promise<BasicParsedTransaction | null> {
    const dateMatch = line.match(this.patterns.datePattern);
    if (!dateMatch) return null;

    const amounts = [...line.matchAll(this.patterns.moneyPattern)]
      .map(match => this.parseAmount(match[0]));
    
    if (amounts.length < 1) return null;

    const amount = amounts[0];
    const balance = amounts.length > 1 ? amounts[amounts.length - 1] : 0;
    
    return {
      date: new Date(parseInt(dateMatch[3]), parseInt(dateMatch[2]) - 1, parseInt(dateMatch[1])),
      description: line.replace(dateMatch[0], '').replace(this.patterns.moneyPattern, '').trim(),
      amount: Math.abs(amount),
      type: amount >= 0 ? TransactionType.CREDIT : TransactionType.DEBIT,
      balance
    };
  }

  private async parseSavingsLine(line: string): Promise<BasicParsedTransaction | null> {
    const dateMatch = line.match(this.patterns.date);
    if (!dateMatch) return null;

    const date = dateMatch[1];
    let remainingText = line.replace(dateMatch[0], '').trim();
    const amounts = [...remainingText.matchAll(this.patterns.moneyPattern)].map(match => match[0]);

    if (amounts.length < 1) return null;

    const amount = this.parseAmount(amounts[0]);
    const balance = amounts.length > 1 ? this.parseAmount(amounts[amounts.length - 1]) : undefined;
    const description = this.cleanDescription(
      remainingText.replace(this.patterns.moneyPattern, '').trim(),
      'savings'
    );

    return {
      date: parse(date, 'dd/MM/yyyy', new Date()),
      description,
      amount: Math.abs(amount),
      type: amount >= 0 ? TransactionType.CREDIT : TransactionType.DEBIT,
      balance: balance || 0
    };
  }

  private parseAmount(text: string): number {
    const cleanText = text.replace(/[$,]/g, '').trim();
    const amount = parseFloat(cleanText);
    
    if (isNaN(amount)) {
      throw new Error(`Invalid amount format: ${text}`);
    }
    
    return amount;
  }

  private cleanDescription(description: string, accountType: 'credit' | 'savings'): string {
    let cleaned = description;

    if (accountType === 'credit') {
      cleaned = cleaned
        .replace(/Date \d{2}\/\d{2}\/\d{2}/, '')
        .replace(/Card \d+/, '')
        .replace(this.patterns.moneyPattern, '');
    }

    // Common cleaning
    cleaned = cleaned
      .replace(/\s+/g, ' ')
      .trim();

    return cleaned;
  }
} 