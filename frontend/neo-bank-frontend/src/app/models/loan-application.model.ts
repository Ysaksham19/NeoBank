export interface LoanApplication {
  applicationId:         number;
  productName:           string;
  requestedAmount:       number;
  requestedTenureMonths: number;
  monthlyIncome:         number | null;
  loanPurpose:           string | null;
  status:                string;
  adminRemarks:          string | null;
  appliedAt:             string;
}