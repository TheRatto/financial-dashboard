import type { BasicParsedTransaction } from './transaction';
import type { PaySlipData } from './payslip';

// Bank statement parser
export interface BankParser {
    name: string;
    canParse(text: string): Promise<boolean>;
    parse(text: string): Promise<BasicParsedTransaction[]>;
}

// Payslip parser
export interface PayslipParser {
    name: string;
    canParse(text: string): Promise<boolean>;
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