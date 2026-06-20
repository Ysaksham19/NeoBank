export interface Transaction {
  id: number;
  transactionRef: string;
  transactionType: string;
  transactionStatus: string;
  amount: number;
  availableBalanceAfter: number;
  ledgerBalanceAfter: number;
  remarks: string;
  createdAt: string;
}
