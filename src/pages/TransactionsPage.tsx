import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { useDeleteTransaction } from "../hooks/useTransactionMutations";
import { useDebouncedValue } from "../hooks/useDebouncedValue";
import { TransactionsTable } from "../components/transactions/TransactionsTable";
import { getCategoriesByType } from "../data/categories";
import { formatCurrency } from "../utils/currency";
import { formatMonthLabel } from "../utils/dates";
import { getAvailableMonths, getTotals } from "../utils/summaries";
import { filterTransactions, type TransactionFilters } from "../utils/transactionFilters";

export function TransactionsPage() {
  const { data: transactions, isPending, isError } = useTransactions();
  const deleteMutation = useDeleteTransaction();

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText, 300);

  const typeParam = searchParams.get("tipo");
  const filters: TransactionFilters = {
    month: searchParams.get("mes") ?? "all",
    type: typeParam === "income" || typeParam === "expense" ? typeParam : "all",
    categoryId: searchParams.get("categoria") ?? "all",
    search: debouncedSearch,
  };

  const months = useMemo(() => getAvailableMonths(transactions ?? []), [transactions]);

  // Com ~200 itens não precisa de useMemo: o cálculo é instantâneo
  const filtered = filterTransactions(transactions ?? [], filters);
  const totals = getTotals(filtered);

  const hasActiveFilters =
    filters.month !== "all" ||
    filters.type !== "all" ||
    filters.categoryId !== "all" ||
    searchText !== "";

  function updateFilter(key: "mes" | "tipo" | "categoria", value: string) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === "all") next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }

  function clearFilters() {
    setSearchParams({}, { replace: true });
    setSearchText("");
  }

  function handleDelete(id: string) {
    // Provisório
    if (window.confirm("Excluir esta transação?")) {
      deleteMutation.mutate(id);
    }
  }

  if (isPending) return <p>Carregando...</p>;
  if (isError) return <p>Não foi possível carregar as transações.</p>;

  // Quando qualquer filtro muda, a tabela é recriada e volta as 15 primeiras linhas
  const tableKey = `${filters.month}|${filters.type}|${filters.categoryId}|${filters.search}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Transações</h1>
          <p className="page-subtitle">Veja, filtre e gerencie suas movimentações</p>
        </div>
      </div>

      <section className="filters">
        <input
          type="search"
          className="input filters-search"
          placeholder="Buscar por descrição ou categoria"
          aria-label="Buscar por descrição ou categoria"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select
          className="select"
          aria-label="Filtrar por mês"
          value={filters.month}
          onChange={(e) => updateFilter("mes", e.target.value)}
        >
          <option value="all">Todos os meses</option>
          {months.map((month) => (
            <option key={month} value={month}>
              {formatMonthLabel(month)}
            </option>
          ))}
        </select>

        <select
          className="select"
          aria-label="Filtrar por tipo"
          value={filters.type}
          onChange={(e) => updateFilter("tipo", e.target.value)}
        >
          <option value="all">Receitas e despesas</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>

        <select
          className="select"
          aria-label="Filtrar por categoria"
          value={filters.categoryId}
          onChange={(e) => updateFilter("categoria", e.target.value)}
        >
          <option value="all">Todas as categorias</option>
          <optgroup label="Receitas">
            {getCategoriesByType("income").map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="Despesas">
            {getCategoriesByType("expense").map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </optgroup>
        </select>

        {hasActiveFilters && (
          <button type="button" className="button-ghost" onClick={clearFilters}>
            Limpar filtros
          </button>
        )}
      </section>

      <p className="results-summary">
        {filtered.length} {filtered.length === 1 ? "transação" : "transações"} · Receitas{" "}
        <span className="text-income">{formatCurrency(totals.income)}</span> · Despesas{" "}
        <span className="text-expense">{formatCurrency(totals.expense)}</span>
      </p>

      {deleteMutation.isError && (
        <p role="alert" className="error-message">
          Não foi possível excluir a transação. Tente novamente.
        </p>
      )}

      <section className="card card--flush">
        <TransactionsTable
          key={tableKey}
          transactions={filtered}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      </section>
    </div>
  );
}