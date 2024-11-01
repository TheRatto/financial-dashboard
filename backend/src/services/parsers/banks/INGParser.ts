import { TransactionType } from '@prisma/client';
import { parse } from 'date-fns';

interface BasicParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  balance: number;
}

export class INGParser {
  name = 'ING';

  canParse(text: string): boolean {
    console.log('\n=== ING Parser Detection ===');
    console.log('Text length:', text.length);
    console.log('First 200 characters:', text.substring(0, 200));
    
    const isING = text.includes('ING');
    console.log('Contains "ING":', isING);
    
    return isING;
  }

  private cleanDescription(rawDesc: string): string {
    const descMatch = rawDesc.match(/((?:BPAY Bill Payment|Salary Deposit|Osko (?:Payment|Deposit)|Internal Transfer|Pay Anyone|EFTPOS Purchase|Visa Purchase|Direct Debit|Deposit|Intl (?:Atmpurchase|Transaction Fee)).*?)(?:\s*-\s*Receipt\s*\d+)?$/);
    return descMatch ? descMatch[1].trim() : '';
  }

  private parseTransactionLine(line: string): BasicParsedTransaction | null {
    const dateRegex = /(\d{2}\/\d{2}\/\d{4})([-]?\d+[,.]?\d+)?([,.]?\d+)?(.*)/;
    const match = line.match(dateRegex);
    
    if (match) {
      const date = parse(match[1], 'dd/MM/yyyy', new Date());
      const description = this.cleanDescription(match[4]);
      const numbers = line.match(/-?\d+[,.]\d+/g);
      if (numbers && numbers.length >= 2) {
        const amount = Math.abs(parseFloat(numbers[0].replace(',', '')));
        const balance = parseFloat(numbers[numbers.length - 1].replace(',', ''));
        const type = line.startsWith('-') ? TransactionType.DEBIT : TransactionType.CREDIT;

        return {
          date,
          description,
          amount,
          type,
          balance
        };
      }
    }
    return null;
  }

  async parse(text: string): Promise<BasicParsedTransaction[]> {
    const transactions: BasicParsedTransaction[] = [];
    const lines = text.split('\n');

    console.log('\n=== ING Parser Starting ===');
    let lineCount = 0;
    let dateMatches = 0;
    
    for (const line of lines) {
      lineCount++;
      
      if (!line.trim() || line.includes('Date') || line.includes('Description')) {
        continue;
      }

      if (line.match(/^\d{2}\/\d{2}\/\d{4}/)) {
        dateMatches++;
        console.log(`\n[Line ${lineCount}] Processing: "${line}"`);
        console.log('Found date:', line.substring(0, 10));
        
        const transaction = this.parseTransactionLine(line);
        if (transaction) {
          transactions.push(transaction);
          console.log('\nParsed Transaction:');
          console.log('------------------');
          console.log(`Date: ${transaction.date.toISOString()}`);
          console.log(`Description: ${transaction.description}`);
          console.log(`Amount: ${transaction.amount} (${transaction.type})`);
          console.log(`Balance: ${transaction.balance}`);
          console.log('------------------');
        }
      }
    }

    console.log('\n=== ING Parser Summary ===');
    console.log('Total lines processed:', lineCount);
    console.log('Lines with date matches:', dateMatches);
    console.log('Transactions successfully parsed:', transactions.length);

    if (transactions.length > 0) {
      console.log('\nFirst transaction:', transactions[0]);
      console.log('Last transaction:', transactions[transactions.length - 1]);
    }

    return transactions;
  }
} 