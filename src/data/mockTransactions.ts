import type { Transaction, TransactionType } from "../types/transaction";

// ---------- Gerador de transações falsas (mulberry32) ----------
type Random = () => number;

function mulberry32(seed: number): Random {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const randInt = (rand: Random, min: number, max: number) =>
  Math.floor(rand() * (max - min + 1)) + min;

const pick = <T>(rand: Random, items: T[]): T =>
  items[Math.floor(rand() * items.length)];

// Arredonda para múltiplos de 10 centavos (valores mais realistas)
const roundTo10 = (cents: number) => Math.round(cents / 10) * 10;

// Monta "YYYY-MM-DD" sem passar por UTC (evita bug de fuso horário)
const toIsoDate = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

// ---------- Modelos de transação ----------
interface FixedSpec {
  type: TransactionType;
  categoryId: string;
  day: number;
  amountInCents: number;
  description: string;
}

interface VariableSpec {
  type: TransactionType;
  categoryId: string;
  count: [min: number, max: number]; // quantas por mês
  amount: [min: number, max: number]; // em centavos
  descriptions: string[];
}

// Acontecem todo mês, no mesmo dia e com o mesmo valor
const fixedSpecs: FixedSpec[] = [
  { type: "income", categoryId: "salary", day: 5, amountInCents: 450000, description: "Salário" },
  { type: "expense", categoryId: "housing", day: 10, amountInCents: 120000, description: "Aluguel" },
  { type: "expense", categoryId: "housing", day: 15, amountInCents: 9990, description: "Internet" },
  { type: "expense", categoryId: "education", day: 8,  amountInCents: 8900, description: "Curso online" },
  { type: "expense", categoryId: "subscriptions", day: 12, amountInCents: 3990, description: "Netflix" },
  { type: "expense", categoryId: "subscriptions", day: 14, amountInCents: 2190, description: "Spotify" },
];

// Variam em quantidade, valor e dia
const variableSpecs: VariableSpec[] = [
  { type: "income",  categoryId: "freelance", count: [0, 2], amount: [30000, 120000], descriptions: ["Projeto de site", "Manutenção de landing page", "Ajustes de interface"] },
  { type: "income",  categoryId: "investments", count: [0, 1], amount: [2000, 15000], descriptions: ["Dividendos", "Rendimento CDB"] },
  { type: "expense", categoryId: "housing", count: [1, 1], amount: [9000, 18000], descriptions: ["Conta de luz"] },
  { type: "expense", categoryId: "food", count: [10, 16], amount: [1500, 9000], descriptions: ["Supermercado", "Padaria", "Restaurante", "Delivery", "Lanche"] },
  { type: "expense", categoryId: "transport", count: [6, 10], amount: [800, 4500], descriptions: ["Uber", "Combustível", "Passagem de ônibus", "Estacionamento"] },
  { type: "expense", categoryId: "leisure", count: [2, 5], amount: [3000, 15000], descriptions: ["Cinema", "Jogo", "Show", "Bar com amigos"] },
  { type: "expense", categoryId: "health", count: [0, 2], amount: [5000, 20000], descriptions: ["Farmácia", "Consulta", "Exame"] },
  { type: "expense", categoryId: "other-expense", count: [1, 3], amount: [2000, 12000], descriptions: ["Presente", "Compra online", "Conserto"] },
];

// ---------- Gerador ----------
export function generateMockTransactions(monthsBack = 6, seed = 42): Transaction[] {
  const rand = mulberry32(seed);
  const today = new Date();
  const result: Transaction[] = [];
  let counter = 1;

  const add = (
    type: TransactionType,
    categoryId: string,
    amountInCents: number,
    date: string,
    description: string,
  ) => {
    result.push({ id: `mock-${counter++}`, type, categoryId, amountInCents, date, description });
  };

  for (let i = monthsBack - 1; i >= 0; i--) {
    const ref = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const year = ref.getFullYear();
    const month = ref.getMonth();

    // No mês atual, não gera datas no futuro
    const isCurrentMonth = i === 0;
    const lastDay = isCurrentMonth
      ? today.getDate()
      : new Date(year, month + 1, 0).getDate();

    for (const spec of fixedSpecs) {
      if (spec.day <= lastDay) {
        add(spec.type, spec.categoryId, spec.amountInCents, toIsoDate(year, month, spec.day), spec.description);
      }
    }

    for (const spec of variableSpecs) {
      const count = randInt(rand, spec.count[0], spec.count[1]);
      for (let n = 0; n < count; n++) {
        add(
          spec.type,
          spec.categoryId,
          roundTo10(randInt(rand, spec.amount[0], spec.amount[1])),
          toIsoDate(year, month, randInt(rand, 1, lastDay)),
          pick(rand, spec.descriptions),
        );
      }
    }
  }

  // Mais recentes primeiro
  return result.sort((a, b) => b.date.localeCompare(a.date));
}