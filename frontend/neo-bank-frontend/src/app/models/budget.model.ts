export interface Budget {
  id: number;
  category: string;
  budgetMonth: string;
  limitAmount: number;
  spentAmount: number;
  remainingAmount: number;
}