// File: src/types/index.ts

/**
 * Supported currencies
 */
export type Currency = "IDR" | "USD" | "SGD" | "GBP" | "EUR" | "JPY" | "AUD" | "CNY";

/**
 * Exchange rate data
 */
export interface ExchangeRate {
  currency: Currency;
  rate: number; // Rate to IDR
  lastUpdated: string;
}

/**
 * Represents a financial category (income or expense)
 */
export interface Category {
  id: string;
  name: string;
  type: "income" | "expense";
  color?: string;
}

/**
 * Represents a single financial transaction
 */
export interface Transaction {
  id: string;
  amount: number;
  currency: Currency;
  categoryId: string;
  date: string; // ISO date string
  description: string;
  type: "income" | "expense";
}

/**
 * Store state for transactions
 */
export interface TransactionState {
  transactions: Transaction[];
  categories: Category[];
  exchangeRates: Record<Currency, number>;
  lastRateUpdate: string | null;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateExchangeRates: (rates: Record<Currency, number>) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
}

/**
 * Store state for simulation mode (non-persistent)
 */
export interface SimulationState {
  transactions: Transaction[];
  categories: Category[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  clearSimulation: () => void;
  loadFromMain: (transactions: Transaction[], categories: Category[]) => void;
}
