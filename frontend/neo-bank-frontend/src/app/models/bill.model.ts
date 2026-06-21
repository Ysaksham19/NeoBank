export interface Bill {
  id: number;
  category: string;
  billerName: string;
  amount: number;
  dueDate: string;
  status: string;        // 'PENDING' | 'PAID' | 'OVERDUE'
  accountId?: number;    // ← needed for createBill payload
}