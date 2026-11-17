interface SummaryCardProps {
  label: string;
  value: string;
  variant?: "default" | "income" | "expense";
}

export function SummaryCard({ label, value, variant = "default" }: SummaryCardProps) {
  return (
    <div className="summary-card">
      <span className="summary-card-label">{label}</span>
      <strong className={`summary-card-value summary-card-value--${variant}`}>
        {value}
      </strong>
    </div>
  );
}