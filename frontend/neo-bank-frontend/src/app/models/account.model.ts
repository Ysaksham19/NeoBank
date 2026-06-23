
export interface Account {
  id: number;
  // backend may send any of these — we handle all in the service
  accountNumber: string;
  accountType: string;
  status: string;
  availableBalance: number;
  ledgerBalance: number;
  ifscCode: string;
  branchName: string;
  branchCode: string;
  currency: string;
  createdAt: string;
}