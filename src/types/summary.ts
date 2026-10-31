export interface MonthlySummary {
  month: string;
  income: number;
  expense: number;
  balance: number;
}

export interface CategoryTotal {
  categoryId: string;
  total: number;
}