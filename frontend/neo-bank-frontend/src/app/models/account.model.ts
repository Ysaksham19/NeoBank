export interface Account {
  id: number;
  accountNumber: string;
  accountType: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  status: string;
  branchName: string;
  branchCode: string;
  ifscCode: string;
  createdAt: string;
}
