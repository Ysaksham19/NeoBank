export interface AdminLoanApplication {
  id: number;
  customerNo: string;
  customerName: string;
  loanProductName: string;
  requestedAmount: number;
  tenure: number;
  status: string;
  adminRemarks: string | null;
  createdAt: string;
}