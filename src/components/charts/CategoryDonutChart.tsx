import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import type { CategoryTotal } from "../../types/summary";
import { getCategoryById } from "../../data/categories";
import { formatCurrency } from "../../utils/currency";
import { tooltipStyle } from "./chartStyles";

interface CategoryDonutChartProps {
  data: CategoryTotal[];
}

export function CategoryDonutChart({ data }: CategoryDonutChartProps) {
  if (data.length === 0) {
    return <p className="empty-state">Sem despesas neste mês.</p>;
  }

  const total = data.reduce((sum, item) => sum + item.total, 0);

  const chartData = data.map((item) => {
    const category = getCategoryById(item.categoryId);
    return {
      name: category?.name ?? "Outros",
      value: item.total,
      color: category?.color ?? "#9aa0b8",
    };
  });

  return (
    <div>
      <div className="donut-chart">
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={65}
              outerRadius={95}
              paddingAngle={2}
              stroke="none"
            >
              {chartData.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => formatCurrency(Number(value))}
              contentStyle={tooltipStyle}
              itemStyle={{ color: "var(--color-text)" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="donut-center">
          <span>Total</span>
          <strong>{formatCurrency(total)}</strong>
        </div>
      </div>

      <ul className="legend-list">
        {chartData.map((item) => (
          <li key={item.name}>
            <span className="legend-dot" style={{ background: item.color }} />
            <span className="legend-name">{item.name}</span>
            <span className="legend-value">
              {formatCurrency(item.value)} ({Math.round((item.value / total) * 100)}%)
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}