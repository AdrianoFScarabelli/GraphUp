import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTransactions } from "../hooks/useTransactions";
import { SummaryCard } from "../components/ui/SummaryCard";
import { MonthlyBarChart } from "../components/charts/MonthlyBarChart";
import { CategoryDonutChart } from "../components/charts/CategoryDonutChart";
import { BalanceEvolutionChart } from "../components/charts/BalanceEvolutionChart";
import { RecentTransactions } from "../components/dashboard/RecentTransactions";
import { formatCurrency } from "../utils/currency";
import { formatMonthLabel, getCurrentMonthKey } from "../utils/dates";
import {
  filterByMonth,
  getAvailableMonths,
  getBalanceEvolution,
  getExpensesByCategory,
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

  const monthTransactions = useMemo(
    () => filterByMonth(transactions ?? [], activeMonth),
    [transactions, activeMonth],
  );

  const totals = useMemo(() => getTotals(monthTransactions), [monthTransactions]);

  const expensesByCategory = useMemo(
    () => getExpensesByCategory(monthTransactions),
    [monthTransactions],
  );

  const monthly = useMemo(() => getMonthlySummaries(transactions ?? []), [transactions]);

  const evolution = useMemo(() => getBalanceEvolution(transactions ?? []), [transactions]);

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

      <section className="charts-grid">
        <div className="card">
          <h2>Receitas vs. despesas</h2>
          <MonthlyBarChart data={monthly} />
        </div>

        <div className="card">
          <h2>Despesas por categoria</h2>
          <CategoryDonutChart data={expensesByCategory} />
        </div>
      </section>

      <section className="charts-grid">
        <div className="card">
          <h2>Saldo acumulado</h2>
          <BalanceEvolutionChart data={evolution} />
        </div>

        <div className="card">
          <div className="card-header">
            <h2>Últimas transações</h2>
            <Link to="/app/transacoes" className="card-link">
              Ver todas
            </Link>
          </div>
          <RecentTransactions transactions={monthTransactions} />
        </div>
      </section>
    </div>
  );
}