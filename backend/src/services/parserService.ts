import { BankParser, PayslipParser } from '../types/parser';
import { INGParser } from './parsers/banks/INGParser';
import { ADFPaySlipParser } from './parsers/payslips/ADFPaySlipParser';

// Initialize parsers
const bankParsers: BankParser[] = [
  new INGParser(),
  // Add other bank parsers here
];

const payslipParsers: PayslipParser[] = [
  new ADFPaySlipParser(),
  // Add other payslip parsers here
];

// Find appropriate bank statement parser
export const findBankParser = async (text: string): Promise<BankParser | undefined> => {
  for (const parser of bankParsers) {
    if (await parser.canParse(text)) {
      return parser;
    }
  }
  return undefined;
};

// Find appropriate payslip parser
export const findPayslipParser = async (text: string): Promise<PayslipParser | undefined> => {
  for (const parser of payslipParsers) {
    if (await parser.canParse(text)) {
      return parser;
    }
  }
  return undefined;
};

// Generic find parser function
export const findParser = async (text: string): Promise<BankParser | PayslipParser | undefined> => {
  // Try bank parsers first
  const bankParser = await findBankParser(text);
  if (bankParser) return bankParser;

  // Try payslip parsers next
  const payslipParser = await findPayslipParser(text);
  if (payslipParser) return payslipParser;

  // No suitable parser found
  return undefined;
}; 