import type { StatementParser } from '../types/transaction';
import { INGParser } from './parsers/banks/INGParser';  // Updated import path

const parsers: StatementParser[] = [
  new INGParser(),
  // Add other parsers here
];

export const findParser = (content: string): StatementParser | undefined => {
  return parsers.find(parser => parser.canParse(content));
}; 