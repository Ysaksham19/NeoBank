export interface Transaction {
  id: number;
  transactionRef: string;
  transactionType: string;         // 'DEPOSIT' | 'DEBIT' | 'TRANSFER'
  transactionStatus: string;       // 'SUCCESS' | 'PENDING' | 'FAILED'
  amount: number;
  availableBalanceAfter: number;   // matches backend DTO field
  ledgerBalanceAfter: number;      // matches backend DTO field
  remarks: string;
  createdAt: string;

  // sender account (always present)
  accountId: number;
  accountNo: string;

  // receiver account (TRANSFER only, null otherwise)
  receiverAccountId: number | null;
  receiverAccountNo: string | null;
}