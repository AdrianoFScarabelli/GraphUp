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
import { tooltipStyle } from "./chartStyles";

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
    <ResponsiveContainer width="100%" height={375}>
      <BarChart
        data={chartData}
        barGap={8}
        barCategoryGap="15%"
        margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
      >
        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="var(--color-text-muted)"
          tickMargin={12}
          height={36}
        />
        <YAxis
          stroke="var(--color-text-muted)"
          width={88}
          tickMargin={12}
          tickFormatter={(value: number) => `R$ ${compact.format(value / 100)}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
          formatter={(value) => formatCurrency(Number(value))}
          itemSorter={(item) => (item.name === "Receitas" ? 0 : 1)}
          contentStyle={tooltipStyle}
        />

        <Legend
          iconType="circle"
          iconSize={20}
          wrapperStyle={{ paddingTop: "24px", paddingBottom: "0px" }}
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