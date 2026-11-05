import type { Category } from "../types/category";
import type { TransactionType } from "../types/transaction";

export const categories: Category[] = [
    // Ganho
    { id: "salary", name: "Salário", type: "income", color: "#5fffa0", icon: "Briefcase" },
    { id: "freelance", name: "Freelance", type: "income", color: "#34d399", icon: "Laptop" },
    { id: "investments", name: "Investimentos", type: "income", color: "#2dd4bf", icon: "TrendingUp" },
    { id: "other-income", name: "Outras receitas", type: "income", color: "#a3e635", icon: "Plus" },

    // Gasto
    { id: "housing", name: "Moradia", type: "expense", color: "#ff5c6c", icon: "House" },
    { id: "food", name: "Alimentação", type: "expense", color: "#ffa94d", icon: "Utensils" },
    { id: "transport", name: "Transporte", type: "expense", color: "#5aaeff", icon: "Car" },
    { id: "health", name: "Saúde", type: "expense", color: "#f472b6", icon: "HeartPulse" },
    { id: "education", name: "Educação", type: "expense", color: "#a78bfa", icon: "GraduationCap" },
    { id: "leisure", name: "Lazer", type: "expense", color: "#facc15", icon: "Gamepad2" },
    { id: "subscriptions", name: "Assinaturas", type: "expense", color: "#22d3ee", icon: "Repeat" },
    { id: "other-expense", name: "Outras despesas", type: "expense", color: "#9aa0b8", icon: "Ellipsis" },
];

// Busca rápida por id
const categoriesById = new Map(categories.map((c) => [c.id, c]));

export function getCategoryById(id: string): Category| undefined {
    return categoriesById.get(id);
}

export function getCategoriesByType(type: TransactionType): Category[] {
  return categories.filter((c) => c.type === type);
}