import { parse } from 'date-fns';
import { ParserManager } from './parsers/ParserManager';
import type { BasicParsedTransaction } from '../types/transaction';

export interface ParsedStatement {
  month: number;
  year: number;
  bankName: string;
  transactions: BasicParsedTransaction[];
}

export class StatementParser {
  private parserManager: ParserManager;

  constructor() {
    this.parserManager = ParserManager.getInstance();
  }

  async parseStatement(text: string): Promise<ParsedStatement> {
    // Find and use appropriate parser
    const parser = await this.parserManager.findBankParser(text);
    if (!parser) {
      throw new Error('No suitable bank statement parser found for this document');
    }

    console.log(`\n✅ Using ${parser.name} parser`);

    // Parse transactions
    const transactions = await parser.parse(text);
    if (transactions.length === 0) {
      throw new Error('No transactions could be parsed from the statement');
    }

    // Get period information
    const endDate = await this.detectStatementPeriod(text);

    return {
      month: endDate.getMonth() + 1,
      year: endDate.getFullYear(),
      bankName: parser.name,
      transactions
    };
  }

  private detectStatementPeriod(text: string): Date {
    const periodRegex = /Statement Period:\s*(\d{1,2}\/\d{1,2}\/\d{4})\s*to\s*(\d{1,2}\/\d{1,2}\/\d{4})/i;
    const periodMatch = text.match(periodRegex);
    return periodMatch ? parse(periodMatch[2], 'dd/MM/yyyy', new Date()) : new Date();
  }
}