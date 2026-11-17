import { useMemo, useState } from "react";
import { useTransactions } from "../hooks/useTransactions";
import { SummaryCard } from "../components/ui/SummaryCard";
import { MonthlyBarChart } from "../components/charts/MonthlyBarChart";
import { formatCurrency } from "../utils/currency";
import { formatMonthLabel, getCurrentMonthKey } from "../utils/dates";
import {
  filterByMonth,
  getAvailableMonths,
  getMonthlySummaries,
  getTotals,
} from "../utils/summaries";

export function DashboardPage() {
  const { data: transactions, isPending, isError } = useTransactions();
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());

  const months = useMemo(() => getAvailableMonths(transactions ?? []), [transactions]);

  // Se o mês escolhido não existir nos dados, usar o mais recente
  const activeMonth = months.includes(selectedMonth)
    ? selectedMonth
    : (months[0] ?? selectedMonth);

  const totals = useMemo(
    () => getTotals(filterByMonth(transactions ?? [], activeMonth)),
    [transactions, activeMonth],
  );

  const monthly = useMemo(() => getMonthlySummaries(transactions ?? []), [transactions]);

  if (isPending) return <p>Carregando...</p>;
  if (isError) return <p>Não foi possível carregar as transações.</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>
          <p className="page-subtitle">Resumo das suas finanças</p>
        </div>

        <select
          className="select"
          aria-label="Selecionar mês"
          value={activeMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          {months.map((month) => (
            <option key={month} value={month}>
              {formatMonthLabel(month)}
            </option>
          ))}
        </select>
      </div>

      <section className="summary-grid">
        <SummaryCard
          label="Saldo do mês"
          value={formatCurrency(totals.balance)}
          variant={totals.balance < 0 ? "expense" : "default"}
        />
        <SummaryCard label="Receitas" value={formatCurrency(totals.income)} variant="income" />
        <SummaryCard label="Despesas" value={formatCurrency(totals.expense)} variant="expense" />
      </section>

      <section className="card">
        <h2>Receitas vs. despesas</h2>
        <MonthlyBarChart data={monthly} />
      </section>
    </div>
  );
}