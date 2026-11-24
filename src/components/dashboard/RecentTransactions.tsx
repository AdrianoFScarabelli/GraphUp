import type { Transaction } from "../../types/transaction";
import { getCategoryById } from "../../data/categories";
import { CategoryIcon } from "../ui/CategoryIcon";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

interface RecentTransactionsProps {
  transactions: Transaction[];
  limit?: number;
}

export function RecentTransactions({ transactions, limit = 6 }: RecentTransactionsProps) {
  const items = transactions.slice(0, limit);

  if (items.length === 0) {
    return <p className="empty-state">Nenhuma transação neste mês.</p>;
  }

  return (
    <ul className="transaction-list">
      {items.map((t) => {
        const category = getCategoryById(t.categoryId);
        const color = category?.color ?? "#9aa0b8";
        const sign = t.type === "income" ? "+" : "-";

        return (
          <li key={t.id} className="transaction-item">
            <span
              className="transaction-icon"
              style={{ color, background: `color-mix(in srgb, ${color} 18%, transparent)` }}
            >
              <CategoryIcon name={category?.icon ?? ""} />
            </span>

            <div className="transaction-info">
              <span className="transaction-description">{t.description}</span>
              <span className="transaction-meta">
                {category?.name ?? "Sem categoria"} · {formatDate(t.date)}
              </span>
            </div>

            <strong className={`transaction-amount transaction-amount--${t.type}`}>
              {sign} {formatCurrency(t.amountInCents)}
            </strong>
          </li>
        );
      })}
    </ul>
  );
}