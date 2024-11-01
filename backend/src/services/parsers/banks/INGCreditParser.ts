import { Transaction, StatementParser } from '../../../types/transaction';

export class INGCreditParser implements StatementParser {
  name = 'ING Credit Card';

  canParse(text: string): boolean {
    const ingCreditIdentifiers = [
      'Orange One',
      'Rewards Platinum',
      'Credit Card'
    ];

    const hasDatePattern = /\d{2}\/\d{2}\/\d{4}/.test(text);
    const hasAmountPattern = /(-?\$?\d+,?\d*\.\d{2})/.test(text);
    const hasIngIdentifier = ingCreditIdentifiers.some(id => 
      text.toUpperCase().includes(id.toUpperCase())
    );

    return hasDatePattern && hasAmountPattern && hasIngIdentifier;
  }

  async parse(text: string): Promise<Transaction[]> {
    const transactions: Transaction[] = [];
    const lines = text.split('\n');
    
    let currentTransaction: Partial<Transaction> = {};
    let currentLine = '';
    let pendingAmounts: string[] = [];

    console.log('Starting to parse lines...');

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      console.log('Processing line:', trimmedLine);

      const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})/;
      const dateMatch = trimmedLine.match(datePattern);
      const moneyPattern = /(-?\$?\d+,?\d*\.\d{2})/g;
      const allAmounts = [...trimmedLine.matchAll(moneyPattern)].map(match => match[0]);

      if (allAmounts.length > 0) {
        pendingAmounts = allAmounts;
      }

      if (dateMatch) {
        // Save previous transaction if exists
        if (currentTransaction.date) {
          currentTransaction.description = this.cleanDescription(currentTransaction.description || '');
          this.logTransaction(currentTransaction as Transaction, currentLine);
          transactions.push(currentTransaction as Transaction);
        }

        // Start new transaction
        const [_, day, month, year] = dateMatch;
        currentTransaction = {
          date: new Date(Date.UTC(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            12,
            0,
            0
          )),
          description: trimmedLine.replace(dateMatch[0], '').trim()
        };
        currentLine = trimmedLine;

        if (pendingAmounts.length > 0) {
          const amount = parseFloat(pendingAmounts[0].replace(/[$,]/g, ''));
          currentTransaction.amount = Math.abs(amount);
          currentTransaction.type = amount >= 0 ? 'credit' as const : 'debit' as const;

          if (pendingAmounts.length > 1) {
            const balance = parseFloat(pendingAmounts[pendingAmounts.length - 1].replace(/[$,]/g, ''));
            currentTransaction.balance = balance;
          }
        }
      } else if (currentTransaction.date) {
        // Add to current transaction description
        currentTransaction.description += ' ' + trimmedLine;
        currentLine += ' ' + trimmedLine;

        // If we find amounts on this line and don't have them yet
        if (allAmounts.length > 0 && !currentTransaction.amount) {
          const amount = parseFloat(allAmounts[0].replace(/[$,]/g, ''));
          currentTransaction.amount = Math.abs(amount);
          currentTransaction.type = amount >= 0 ? 'credit' as const : 'debit' as const;

          if (allAmounts.length > 1) {
            const balance = parseFloat(allAmounts[allAmounts.length - 1].replace(/[$,]/g, ''));
            currentTransaction.balance = balance;
          }
        }
      }
    }

    // Add the last transaction if it exists
    if (currentTransaction.date) {
      currentTransaction.description = this.cleanDescription(currentTransaction.description || '');
      this.logTransaction(currentTransaction as Transaction, currentLine);
      transactions.push(currentTransaction as Transaction);
    }

    console.log(`Found ${transactions.length} transactions`);
    return transactions;
  }

  private cleanDescription(description: string): string {
    // Remove date references
    description = description.replace(/Date \d{2}\/\d{2}\/\d{2}/, '');
    
    // Remove card references
    description = description.replace(/Card \d+/, '');
    
    // Remove amounts
    description = description.replace(/(-?\$?\d+,?\d*\.\d{2})/g, '');
    
    // Clean up multiple spaces and trim
    return description.replace(/\s+/g, ' ').trim();
  }

  private logTransaction(transaction: Transaction, originalLine: string) {
    console.log('Successfully parsed transaction:', {
      date: transaction.date.toISOString(),
      description: transaction.description,
      amount: transaction.amount,
      type: transaction.type,
      balance: transaction.balance,
      debug: {
        originalLine,
        foundAmounts: originalLine.match(/(-?\$?\d+,?\d*\.\d{2})/g) || []
      }
    });
  }
} 