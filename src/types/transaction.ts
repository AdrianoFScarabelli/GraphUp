export type TransactionType = "income" | "expense";

export interface Transaction {
    id: string;
    type: TransactionType;
    amountInCents: number;
    date: string;          // "YYYY-MM-DD"
    description: string;
    categoryId: string;
}

// Para criar: o id é gerado pelo banco ou serviço
export type NewTransaction = Omit<Transaction, "id">;