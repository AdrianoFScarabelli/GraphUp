import type { Transaction, TransactionType } from "../types/transaction";
import { getMonthKey } from "./dates";
import { getCategoryById } from "../data/categories";

export interface TransactionFilters {
  month: string;
  type: TransactionType | "all";
  categoryId: string;
  search: string;
}

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function filterTransactions(
  transactions: Transaction[],
  filters: TransactionFilters,
): Transaction[] {
  const search = normalizeText(filters.search);

  return transactions.filter((t) => {
    if (filters.month !== "all" && getMonthKey(t.date) !== filters.month) return false;
    if (filters.type !== "all" && t.type !== filters.type) return false;
    if (filters.categoryId !== "all" && t.categoryId !== filters.categoryId) return false;

    if (search) {
      const categoryName = getCategoryById(t.categoryId)?.name ?? "";
      const searchable = normalizeText(`${t.description} ${categoryName}`);
      if (!searchable.includes(search)) return false;
    }

    return true;
  });
}