import { BankParser, PayslipParser } from '../../types/parser';
import { INGParser } from './banks/INGParser';
import { ADFPaySlipParser } from './payslips/ADFPaySlipParser';

export class ParserManager {
  private static instance: ParserManager;
  private bankParsers: BankParser[] = [];
  private payslipParsers: PayslipParser[] = [];

  private constructor() {
    // Register default parsers
    this.registerBankParser(new INGParser());
    this.registerPayslipParser(new ADFPaySlipParser());
  }

  static getInstance(): ParserManager {
    if (!ParserManager.instance) {
      ParserManager.instance = new ParserManager();
    }
    return ParserManager.instance;
  }

  registerBankParser(parser: BankParser) {
    this.bankParsers.push(parser);
    console.log(`Registered bank parser: ${parser.name}`);
  }

  registerPayslipParser(parser: PayslipParser) {
    this.payslipParsers.push(parser);
    console.log(`Registered payslip parser: ${parser.name}`);
  }

  async findBankParser(text: string): Promise<BankParser | null> {
    for (const parser of this.bankParsers) {
      if (await parser.canParse(text)) {
        return parser;
      }
    }
    return null;
  }

  async findPayslipParser(text: string): Promise<PayslipParser | null> {
    for (const parser of this.payslipParsers) {
      if (await parser.canParse(text)) {
        return parser;
      }
    }
    return null;
  }

  async findParser(text: string): Promise<BankParser | PayslipParser | null> {
    return (await this.findBankParser(text)) || (await this.findPayslipParser(text));
  }
} 