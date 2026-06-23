export interface LoanProduct {
  id: number;
  productName: string;
  minAmount: number;
  maxAmount: number;
  annualInterestRate: number;
  allowedTenures: string;
}