export interface Transaction {
  id: number;
  transactionRef: string;
  transactionType: string;   // matches your component's tx.transactionType
  amount: number;
  balanceAfter: number;
  remarks: string;           // matches your component's tx.remarks
  status: string;
  createdAt: string;
  accountNo: string;
  accountId: number;
  customerName: string;
}