import { StatementParser } from '../../types/transaction';
import { INGParser } from './banks/INGParser';
import { INGCreditParser } from './banks/INGCreditParser';

export class ParserRegistry {
  private parsers: StatementParser[] = [];

  constructor() {
    // Register all bank parsers
    // Note: Order matters - put more specific parsers first
    this.registerParser(new INGCreditParser()); // More specific parser
    this.registerParser(new INGParser());       // More general parser
  }

  registerParser(parser: StatementParser) {
    this.parsers.push(parser);
    console.log(`Registered parser: ${parser.name}`);
  }

  findParser(text: string): StatementParser | null {
    console.log('Looking for suitable parser...');
    
    for (const parser of this.parsers) {
      console.log(`Trying ${parser.name}...`);
      if (parser.canParse(text)) {
        console.log(`Found matching parser: ${parser.name}`);
        return parser;
      }
    }

    console.log('No suitable parser found for this statement');
    return null;
  }
} 