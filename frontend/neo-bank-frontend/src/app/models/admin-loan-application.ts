export interface AdminLoanApplication {
  applicationId:         number;
  customerName:          string;
  customerNo:            string;
  productName:           string;
  requestedAmount:       number;
  requestedTenureMonths: number;
  status:                string;
  adminRemarks:          string | null;
  appliedAt:             string;
}