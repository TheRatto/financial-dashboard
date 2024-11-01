export interface ADFPaySlipData {
  // Personal Details
  employeeDetails: {
    name: string;
    employeeId: string;
    rank: string;
    unit: string;
    skillGrade: string;
    serviceCategory: string;
    serviceOption: string;
    jobDescription: string;
    payGrade: string;
    annualSalary: number;
    categorisation: string;
  };

  // Pay Period
  payPeriod: {
    startDate: Date;
    endDate: Date;
    paymentDate: Date;
    payCentre: string;
  };

  // Pay Summary
  paySummary: {
    current: {
      gross: number;
      taxable: number;
      taxes: number;
      deductions: number;
      netPay: number;
    };
    yearToDate: {
      gross: number;
      taxable: number;
      taxes: number;
      deductions: number;
      netPay: number;
    };
  };

  // Earnings
  earnings: Array<{
    description: string;
    dateFrom?: Date;
    rate: number;
    units: number;
    current: number;
    prior?: number;
    total: number;
  }>;

  // Taxes
  taxes: Array<{
    description: string;
    yearToDate: number;
    current: number;
    prior?: number;
    total: number;
  }>;

  // Deductions
  beforeTaxDeductions: Array<{
    description: string;
    dateFrom: Date;
    remainingBalance?: number;
    yearToDate: number;
    current: number;
    prior?: number;
    total: number;
  }>;

  afterTaxDeductions: Array<{
    description: string;
    dateFrom: Date;
    remainingBalance?: number;
    yearToDate: number;
    current: number;
    prior?: number;
    total: number;
  }>;

  // Super
  employerSuper: Array<{
    description: string;
    dateFrom: Date;
    yearToDate: number;
    current: number;
    prior?: number;
    total: number;
  }>;

  // Leave
  leaveBalances: {
    recreationLeave: {
      hours: number;
      days: number;
    };
    longServiceLeave: {
      months: number;
      days: number;
    };
  };

  // Payment Details
  disbursement: Array<{
    bank: string;
    bsb: string;
    accountNumber: string;
    amount: number;
  }>;
} 