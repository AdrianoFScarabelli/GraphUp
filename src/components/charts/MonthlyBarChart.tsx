import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MonthlySummary } from "../../types/summary";
import { formatCurrency } from "../../utils/currency";
import { formatMonthLabel } from "../../utils/dates";

const compact = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

interface MonthlyBarChartProps {
  data: MonthlySummary[];
}

export function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  const chartData = data.map((m) => ({
    label: formatMonthLabel(m.month),
    Receitas: m.income,
    Despesas: m.expense,
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>

      <BarChart
        data={chartData}
        barGap={8}             // Espaço entre a barra de Receitas e a de Despesas
        barCategoryGap="15%"   // Espaço entre os grupos de cada mês (jun/26, jul/26...)
      >
        
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis dataKey="label" stroke="var(--color-text-muted)" />
        <YAxis
          stroke="var(--color-text-muted)"
          width={80}
          tickFormatter={(value: number) => `R$ ${compact.format(value / 100)}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            background: "var(--color-surface-raised)",
            border: "1px solid var(--color-border)",
            borderRadius: 12,
          }}
        />

        <Legend
          iconType="circle"                     // Troca o quadrado por círculo
          iconSize={20}                         // Tamanho do ícone
          wrapperStyle={{ paddingTop: "24px" }} // Distância entre o gráfico e a legenda
          itemSorter={() => 0}
          formatter={(value) => (
            <span style={{ color: "var(--color-text)", marginLeft: 4 }}>
              {value}
            </span>
          )}
        />
        
          <Bar dataKey="Receitas" fill="var(--color-income)" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Despesas" fill="var(--color-expense)" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}