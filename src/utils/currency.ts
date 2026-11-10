const brl = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export const formatCurrency = (cents: number): string => brl.format(cents / 100);

// Para o formulário: "1.234,56" ou "1234,56" -> 123456 (centavos)
export function parseCurrencyToCents(input: string): number {
  const normalized = input
    .replace(/[^\d,.-]/g, "") // remove "R$", espaços etc.
    .replace(/\./g, "")       // remove separador de milhar
    .replace(",", ".");       // vírgula decimal -> ponto

  const value = Number(normalized);
  return Number.isFinite(value) ? Math.round(value * 100) : 0;
}