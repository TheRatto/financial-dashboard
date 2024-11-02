import { TransactionType } from '@prisma/client';
import { parse } from 'date-fns';
import { INGParser } from './parsers/banks/INGParser';
import { prisma } from '../db/index';
import { BankParser } from '../types/parser';

export interface BasicParsedTransaction {
  date: Date;
  description: string;
  amount: number;
  type: TransactionType;
  balance: number;
}

export interface ParsedStatement {
  month: number;
  year: number;
  bankName: string;
  transactions: BasicParsedTransaction[];
}

export class StatementParser {
  private parsers: BankParser[] = [
    new INGParser(),
  ];

  async parseStatement(text: string, accountId: string): Promise<ParsedStatement> {
    // Add account validation
    const accountRegex = /Account:\s*(.*?)(?:\r|\n|$)/;
    const accountMatch = text.match(accountRegex);
    
    if (accountMatch) {
      const account = await prisma.account.findUnique({
        where: { id: accountId }
      });
      
      if (!account || !accountMatch[1].includes(account.name)) {
        throw new Error('Statement does not match the selected account');
      }
    }

    // Add period detection at the start
    const periodRegex = /Statement Period:\s*(\d{1,2}\/\d{1,2}\/\d{4})\s*to\s*(\d{1,2}\/\d{1,2}\/\d{4})/i;
    const periodMatch = text.match(periodRegex);
    const endDate = periodMatch ? parse(periodMatch[2], 'dd/MM/yyyy', new Date()) : new Date();

    console.log('\n=== Statement Parser Starting ===');
    console.log('PDF text length:', text.length);

    // Find the appropriate parser
    console.log('\n=== Testing Available Parsers ===');
    for (const p of this.parsers) {
      console.log(`Testing ${p.name} parser...`);
      const canParse = await p.canParse(text);
      console.log(`Result: ${canParse ? 'MATCHED' : 'Not matched'}`);
    }

    const parser = this.parsers.find(p => p.canParse(text));
    if (!parser) {
      throw new Error('No suitable parser found for this statement format');
    }

    console.log(`\n✅ Using ${parser.name} parser`);

    // Parse transactions
    const transactions = await parser.parse(text);

    if (transactions.length === 0) {
      throw new Error('No transactions could be parsed from the statement');
    }

    // Return statement info using the detected period
    return {
      month: endDate.getMonth() + 1,
      year: endDate.getFullYear(),
      bankName: parser.name,
      transactions
    };
  }
}

// Template for new bank parsers
export abstract class BaseBankParser implements BankParser {
  abstract name: string;
  abstract canParse(text: string): Promise<boolean>;
  abstract parse(text: string): Promise<BasicParsedTransaction[]>;

  protected parseDate(dateStr: string, formatStr: string): Date {
    try {
      return parse(dateStr, formatStr, new Date());
    } catch (error) {
      throw new Error(`Failed to parse date: ${dateStr} with format ${formatStr}`);
    }
  }

  protected parseAmount(amountStr: string): number {
    return parseFloat(amountStr.replace(/[$,]/g, ''));
  }
}