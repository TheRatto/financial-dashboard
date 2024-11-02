export interface PaySlipData {
  employer: string;
  paymentDate: Date;
  payPeriod: {
    startDate: Date;
    endDate: Date;
  };
  grossPay: number;
  netPay: number;
  earnings: Array<{
    description: string;
    amount: number;
  }>;
  deductions: Array<{
    description: string;
    amount: number;
  }>;
  taxWithheld: number;
  yearToDate: {
    grossPay: number;
    taxWithheld: number;
    superannuation: number;
  };
} 