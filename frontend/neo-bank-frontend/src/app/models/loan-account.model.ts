export interface LoanAccount {
  loanAccountId:      number;
  productName:        string;
  principalAmount:    number;
  outstandingBalance: number;
  emiAmount:          number;
  annualInterestRate: number;
  tenureMonths:       number;
  status:             string;
  disbursedAt:        string | null;
  closedAt:           string | null;
}