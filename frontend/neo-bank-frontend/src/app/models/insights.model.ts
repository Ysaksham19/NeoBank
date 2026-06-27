export interface TrendEntry {
  monthLabel: string;
  year: number;
  month: number;
  totalIncome: number;
  totalExpense: number;
}

export interface FinancialInsights {
  userId: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  trendSummary: TrendEntry[];
}