export interface INGTransaction {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  balance?: number;
}

export interface INGStatement {
  accountType: string;
  openingBalance: number;
  closingBalance: number;
  totalMoneyIn: number;
  totalMoneyOut: number;
  transactions: INGTransaction[];
} 