import { INGParser } from './banks/INGParser';
// import { WestpacParser } from './banks/WestpacParser';
// import { CommBankParser } from './banks/CommBankParser';

export class ParserFactory {
  static getParser(bankType: string) {
    switch (bankType.toLowerCase()) {
      case 'ing':
        return new INGParser();
      // case 'westpac':
      //   return new WestpacParser();
      // case 'commbank':
      //   return new CommBankParser();
      default:
        throw new Error(`Parser not yet implemented for bank type: ${bankType}`);
    }
  }
} 