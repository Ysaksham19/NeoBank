export interface AdminTransaction {
  id: number;
  transactionRef: string;
  customerNo: string | null;
  customerName: string | null;
  senderAccountNo: string | null;
  receiverAccountNo: string | null;
  transactionType: string;
  transactionStatus: string;
  amount: number;
  availableBalanceAfter: number;
  ledgerBalanceAfter: number;
  remarks: string | null;
  createdAt: string;
}