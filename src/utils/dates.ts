// src/utils/dates.ts

// "2026-10-23" -> "2026-10"
export const getMonthKey = (isoDate: string): string => isoDate.slice(0, 7);

// "2026-10" -> "out/26"
export function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  const date = new Date(year, month - 1, 1); // local, sem UTC
  const name = new Intl.DateTimeFormat("pt-BR", { month: "short" })
    .format(date)
    .replace(".", "");
  return `${name}/${String(year).slice(-2)}`;
}

// "2026-10-23" -> "23/10/2026"
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split("-");
  return `${day}/${month}/${year}`;
}

export function getCurrentMonthKey(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}