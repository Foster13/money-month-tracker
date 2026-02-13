// File: src/stores/transactionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Category, TransactionState, Currency } from "@/types";

/**
 * Default income categories pre-populated on first run
 */
const DEFAULT_INCOME_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Salary", type: "income", color: "#10b981" },
  { name: "Freelance", type: "income", color: "#3b82f6" },
  { name: "Investments", type: "income", color: "#8b5cf6" },
  { name: "Other Income", type: "income", color: "#06b6d4" },
];

/**
 * Default expense categories pre-populated on first run
 */
const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Housing", type: "expense", color: "#ef4444" },
  { name: "Transportation", type: "expense", color: "#f59e0b" },
  { name: "Food", type: "expense", color: "#ec4899" },
  { name: "Utilities", type: "expense", color: "#6366f1" },
  { name: "Healthcare", type: "expense", color: "#14b8a6" },
  { name: "Entertainment", type: "expense", color: "#f97316" },
  { name: "Shopping", type: "expense", color: "#a855f7" },
  { name: "Other Expenses", type: "expense", color: "#64748b" },
];

/**
 * Default exchange rates (fallback)
 */
const DEFAULT_EXCHANGE_RATES: Record<Currency, number> = {
  IDR: 1,
  USD: 15000,
  SGD: 11000,
  GBP: 19000,
  EUR: 16000,
  JPY: 100,
  AUD: 10000,
  CNY: 2100,
};

/**
 * Generate a unique ID
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Initialize default categories with IDs
 */
const initializeDefaultCategories = (): Category[] => {
  const incomeCategories = DEFAULT_INCOME_CATEGORIES.map((cat) => ({
    ...cat,
    id: generateId(),
  }));
  const expenseCategories = DEFAULT_EXPENSE_CATEGORIES.map((cat) => ({
    ...cat,
    id: generateId(),
  }));
  return [...incomeCategories, ...expenseCategories];
};

/**
 * Main transaction store with localStorage persistence
 */
export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: initializeDefaultCategories(),
      exchangeRates: DEFAULT_EXCHANGE_RATES,
      lastRateUpdate: null,

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: generateId(),
          currency: transaction.currency || "IDR",
        };
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
        }));
      },

      updateTransaction: (id, updates) => {
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
        }));
      },

      deleteTransaction: (id) => {
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        }));
      },

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: generateId(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
        }));
      },

      updateCategory: (id, updates) => {
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          // Also remove transactions with this category
          transactions: state.transactions.filter((t) => t.categoryId !== id),
        }));
      },

      updateExchangeRates: (rates) => {
        set({
          exchangeRates: rates,
          lastRateUpdate: new Date().toISOString(),
        });
      },

      exportData: () => {
        const state = get();
        return JSON.stringify(
          {
            transactions: state.transactions,
            categories: state.categories,
            exchangeRates: state.exchangeRates,
            lastRateUpdate: state.lastRateUpdate,
            exportDate: new Date().toISOString(),
          },
          null,
          2
        );
      },

      importData: (jsonData) => {
        try {
          const data = JSON.parse(jsonData);
          if (data.transactions && data.categories) {
            set({
              transactions: data.transactions,
              categories: data.categories,
              exchangeRates: data.exchangeRates || DEFAULT_EXCHANGE_RATES,
              lastRateUpdate: data.lastRateUpdate || null,
            });
          } else {
            throw new Error("Invalid data format");
          }
        } catch (error) {
          throw new Error("Failed to import data. Please check the file format.");
        }
      },
    }),
    {
      name: "finance-storage",
    }
  )
);
