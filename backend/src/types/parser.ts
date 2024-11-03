import { BasicParsedTransaction } from './transaction';
import { PaySlipData } from './payslip';

// Base parser interface
export interface DocumentParser {
  name: string;
  canParse(text: string): Promise<boolean>;
}

// Bank statement parser
export interface BankParser extends DocumentParser {
  name: string;
  parse(text: string): Promise<BasicParsedTransaction[]>;
}

// Payslip parser
export interface PayslipParser extends DocumentParser {
  name: string;
  parse(text: string): Promise<PaySlipData>;
}

export interface StatementMetadata {
    bankName: string;
    accountName?: string;
    period?: {
        startDate: Date;
        endDate: Date;
    };
} 