import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCompactCurrency, formatCurrency } from "../../utils/currency";
import { formatMonthLabel } from "../../utils/dates";
import { tooltipStyle } from "./chartStyles";

interface BalanceEvolutionChartProps {
  data: { month: string; balance: number }[];
}

export function BalanceEvolutionChart({ data }: BalanceEvolutionChartProps) {
  const chartData = data.map((item) => ({
    label: formatMonthLabel(item.month),
    Saldo: item.balance,
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart
        data={chartData}
        margin={{ top: 8, right: 16, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <CartesianGrid stroke="var(--color-border)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="var(--color-text-muted)"
          tickMargin={16}
          height={36}
          padding={{ left: 20, right: 20 }}
        />
        <YAxis
          stroke="var(--color-text-muted)"
          width={88}
          tickMargin={12}
          tickFormatter={(value: number) => formatCompactCurrency(value)}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={tooltipStyle}
          itemStyle={{ color: "var(--color-text)" }}
        />
        <Area
          type="monotone"
          dataKey="Saldo"
          stroke="var(--color-primary)"
          strokeWidth={2}
          fill="url(#balanceGradient)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}