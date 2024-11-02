import { BankParser } from '../../types/parser';
import { INGParser } from './banks/INGParser';

export class ParserRegistry {
  private parsers: BankParser[] = [];

  constructor() {
    this.registerParser(new INGParser());
  }

  registerParser(parser: BankParser) {
    this.parsers.push(parser);
    console.log(`Registered parser: ${parser.name}`);
  }

  async findParser(text: string): Promise<BankParser | null> {
    console.log('Looking for suitable parser...');
    
    for (const parser of this.parsers) {
      console.log(`Trying ${parser.name}...`);
      const canParse = await parser.canParse(text);
      if (canParse) {
        console.log(`Found matching parser: ${parser.name}`);
        return parser;
      }
    }

    console.log('No suitable parser found for this statement');
    return null;
  }
} 