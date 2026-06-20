export interface AdminAccount {
  id: number;
  accountNo: string;
  customerNo: string;
  customerName: string;
  accountType: string;
  currency: string;
  availableBalance: number;
  ledgerBalance: number;
  status: string;
  createdAt: string;
}