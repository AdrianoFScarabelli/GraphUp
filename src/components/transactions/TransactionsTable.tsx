import { useState } from "react";
import type { Transaction } from "../../types/transaction";
import { getCategoryById } from "../../data/categories";
import { CategoryIcon } from "../ui/CategoryIcon";
import { formatCurrency } from "../../utils/currency";
import { formatDate } from "../../utils/dates";

const PAGE_SIZE = 15;

interface TransactionsTableProps {
  transactions: Transaction[];
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

export function TransactionsTable({
  transactions,
  onDelete,
  isDeleting = false,
}: TransactionsTableProps) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (transactions.length === 0) {
    return (
      <p className="empty-state empty-state--padded">
        Nenhuma transação encontrada com esses filtros.
      </p>
    );
  }

  const visible = transactions.slice(0, visibleCount);
  const remaining = transactions.length - visible.length;

  return (
    <>
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th className="align-right">Valor</th>
              <th>
                <span className="sr-only">Ações</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.map((t) => {
              const category = getCategoryById(t.categoryId);
              const color = category?.color ?? "#9aa0b8";
              const sign = t.type === "income" ? "+" : "-";

              return (
                <tr key={t.id}>
                  <td className="cell-date">{formatDate(t.date)}</td>
                  <td>{t.description}</td>
                  <td>
                    <span className="category-cell">
                      <span
                        className="category-badge"
                        style={{
                          color,
                          background: `color-mix(in srgb, ${color} 18%, transparent)`,
                        }}
                      >
                        <CategoryIcon name={category?.icon ?? ""} size={16} />
                      </span>
                      {category?.name ?? "Sem categoria"}
                    </span>
                  </td>
                  <td className={`cell-amount transaction-amount--${t.type}`}>
                    {sign} {formatCurrency(t.amountInCents)}
                  </td>
                  <td className="cell-actions">
                    <button
                      type="button"
                      className="button-ghost button-danger"
                      onClick={() => onDelete(t.id)}
                      disabled={isDeleting}
                      aria-label={`Excluir ${t.description}`}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {remaining > 0 && (
        <div className="table-footer">
          <button
            type="button"
            className="button-ghost"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Mostrar mais ({remaining} restantes)
          </button>
        </div>
      )}
    </>
  );
}