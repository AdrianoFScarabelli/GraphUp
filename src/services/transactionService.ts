import { generateMockTransactions } from "../data/mockTransactions";
import type { Transaction } from "../types/transaction";

let transactions: Transaction[] = generateMockTransactions();

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getTransactions(): Promise<Transaction[]> {
  await delay();
  return [...transactions];
}