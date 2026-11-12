import { generateMockTransactions } from "../data/mockTransactions";
import type { NewTransaction, Transaction } from "../types/transaction";

let transactions: Transaction[] = generateMockTransactions();

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const sortByDateDesc = (list: Transaction[]) =>
  [...list].sort((a, b) => b.date.localeCompare(a.date));

export async function getTransactions(): Promise<Transaction[]> {
  await delay();
  return sortByDateDesc(transactions);
}

export async function addTransaction(data: NewTransaction): Promise<Transaction> {
  await delay();
  const created: Transaction = { ...data, id: crypto.randomUUID() };
  transactions = [created, ...transactions];
  return created;
}

export async function updateTransaction(
  id: string,
  data: NewTransaction,
): Promise<Transaction> {
  await delay();
  if (!transactions.some((t) => t.id === id)) {
    throw new Error("Transação não encontrada.");
  }
  const updated: Transaction = { ...data, id };
  transactions = transactions.map((t) => (t.id === id ? updated : t));
  return updated;
}

export async function deleteTransaction(id: string): Promise<void> {
  await delay();
  if (!transactions.some((t) => t.id === id)) {
    throw new Error("Transação não encontrada.");
  }
  transactions = transactions.filter((t) => t.id !== id);
}