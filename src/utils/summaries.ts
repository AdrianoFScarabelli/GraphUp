// src/utils/summaries.ts
import type { Transaction } from "../types/transaction";
import type { MonthlySummary, CategoryTotal } from "../types/summary";
import { getMonthKey } from "./dates";

export interface Totals {
  income: number;
  expense: number;
  balance: number;
}

// Tudo em centavos
export function getTotals(transactions: Transaction[]): Totals {
  let income = 0;
  let expense = 0;

  for (const t of transactions) {
    if (t.type === "income") income += t.amountInCents;
    else expense += t.amountInCents;
  }

  return { income, expense, balance: income - expense };
}

export function filterByMonth(
  transactions: Transaction[],
  monthKey: string,
): Transaction[] {
  return transactions.filter((t) => getMonthKey(t.date) === monthKey);
}

// Receitas vs. despesas por mês, em ordem cronológica (para o gráfico de barras)
export function getMonthlySummaries(transactions: Transaction[]): MonthlySummary[] {
  const byMonth = new Map<string, { income: number; expense: number }>();

  for (const t of transactions) {
    const key = getMonthKey(t.date);
    const current = byMonth.get(key) ?? { income: 0, expense: 0 };
    if (t.type === "income") current.income += t.amountInCents;
    else current.expense += t.amountInCents;
    byMonth.set(key, current);
  }

  return [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, { income, expense }]) => ({
      month,
      income,
      expense,
      balance: income - expense,
    }));
}

// Evolução do saldo acumulado (para o gráfico de linha/área)
export function getBalanceEvolution(
  transactions: Transaction[],
): { month: string; balance: number }[] {
  let running = 0;
  return getMonthlySummaries(transactions).map(({ month, balance }) => {
    running += balance;
    return { month, balance: running };
  });
}

// Gastos por categoria, do maior para o menor (para a pizza/rosca)
export function getExpensesByCategory(transactions: Transaction[]): CategoryTotal[] {
  const totals = new Map<string, number>();

  for (const t of transactions) {
    if (t.type !== "expense") continue;
    totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amountInCents);
  }

  return [...totals.entries()]
    .map(([categoryId, total]) => ({ categoryId, total }))
    .sort((a, b) => b.total - a.total);
}

// Lista de meses disponíveis, do mais recente ao mais antigo (para o filtro)
export function getAvailableMonths(transactions: Transaction[]): string[] {
  return [...new Set(transactions.map((t) => getMonthKey(t.date)))]
    .sort()
    .reverse();
}