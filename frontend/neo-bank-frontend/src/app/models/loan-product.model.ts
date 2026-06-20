export interface LoanProduct {
  id: number;
  productName: string;
  loanType: string;
  minAmount: number;
  maxAmount: number;
  annualInterestRate: number;
  allowedTenures: string;
  description: string;
}
