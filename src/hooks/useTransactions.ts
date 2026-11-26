import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "../services/transactionService";

export const transactionsQueryKey = ["transactions"] as const;

export function useTransactions() {
  return useQuery({
    queryKey: transactionsQueryKey,
    queryFn: getTransactions,
  });
}