import { useTransactions } from "../hooks/useTransactions";
import { useAddTransaction, useDeleteTransaction } from "../hooks/useTransactionMutations";
import { getTodayIsoDate } from "../utils/dates";

export function TransactionsPage() {
  const { data: transactions = [] } = useTransactions();
  const addMutation = useAddTransaction();
  const deleteMutation = useDeleteTransaction();

  return (
    <div>
      <h1>Transações ({transactions.length})</h1>

      <button
        disabled={addMutation.isPending}
        onClick={() =>
          addMutation.mutate({
            type: "expense",
            categoryId: "food",
            amountInCents: 5000,
            date: getTodayIsoDate(),
            description: "Teste",
          })
        }
      >
        {addMutation.isPending ? "Adicionando..." : "Adicionar teste"}
      </button>

      <ul>
        {transactions.slice(0, 5).map((t) => (
          <li key={t.id}>
            {t.description} · {t.date}{" "}
            <button
              disabled={deleteMutation.isPending}
              onClick={() => deleteMutation.mutate(t.id)}
            >
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}