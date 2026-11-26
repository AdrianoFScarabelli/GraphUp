import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addTransaction,
  deleteTransaction,
  updateTransaction,
} from "../services/transactionService";
import type { NewTransaction } from "../types/transaction";
import { transactionsQueryKey } from "./useTransactions";

export function useAddTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: NewTransaction) => addTransaction(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: NewTransaction }) =>
      updateTransaction(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTransaction(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: transactionsQueryKey }),
  });
}