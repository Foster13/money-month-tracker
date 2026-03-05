// File: src/stores/transactionStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Transaction, Category, TransactionState, Currency } from "@/types";

/**
 * History action types for undo/redo
 */
export type HistoryAction = 
  | { type: "ADD_TRANSACTION"; transaction: Transaction }
  | { type: "UPDATE_TRANSACTION"; id: string; oldTransaction: Transaction; newTransaction: Transaction }
  | { type: "DELETE_TRANSACTION"; transaction: Transaction }
  | { type: "ADD_CATEGORY"; category: Category }
  | { type: "DELETE_CATEGORY"; category: Category; deletedTransactions: Transaction[] };

/**
 * History state for undo/redo
 */
interface HistoryState {
  past: HistoryAction[];
  future: HistoryAction[];
}

/**
 * Extended transaction state with undo/redo (includes history)
 */
interface ExtendedTransactionState extends TransactionState {
  history: HistoryState;
}

/**
 * Default icon mapping for categories (for migration)
 */
const CATEGORY_ICON_MAP: Record<string, string> = {
  "Salary": "Briefcase",
  "Freelance": "Laptop",
  "Investments": "TrendingUp",
  "Other Income": "DollarSign",
  "Housing": "Home",
  "Transportation": "Car",
  "Food": "UtensilsCrossed",
  "Utilities": "Zap",
  "Healthcare": "Heart",
  "Entertainment": "Film",
  "Shopping": "ShoppingBag",
  "Bills": "FileText",
  "Debts": "CreditCard",
  "Snacks": "Cookie",
  "Other Expenses": "MoreHorizontal",
  "Debt": "CreditCard", // Alternative spelling
};

/**
 * Migrate old categories to add missing icons
 */
const migrateCategories = (categories: Category[]): Category[] => {
  return categories.map(category => {
    // If category already has an icon, keep it
    if (category.icon) {
      return category;
    }
    
    // Try to find icon based on category name
    const icon = CATEGORY_ICON_MAP[category.name] || "Circle";
    
    return {
      ...category,
      icon,
    };
  });
};
const DEFAULT_INCOME_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Salary", type: "income", color: "#10b981", icon: "Briefcase" },
  { name: "Freelance", type: "income", color: "#3b82f6", icon: "Laptop" },
  { name: "Investments", type: "income", color: "#8b5cf6", icon: "TrendingUp" },
  { name: "Other Income", type: "income", color: "#06b6d4", icon: "DollarSign" },
];

/**
 * Default expense categories pre-populated on first run
 */
const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Housing", type: "expense", color: "#ef4444", icon: "Home" },
  { name: "Transportation", type: "expense", color: "#f59e0b", icon: "Car" },
  { name: "Food", type: "expense", color: "#ec4899", icon: "UtensilsCrossed" },
  { name: "Utilities", type: "expense", color: "#6366f1", icon: "Zap" },
  { name: "Healthcare", type: "expense", color: "#14b8a6", icon: "Heart" },
  { name: "Entertainment", type: "expense", color: "#f97316", icon: "Film" },
  { name: "Shopping", type: "expense", color: "#a855f7", icon: "ShoppingBag" },
  { name: "Bills", type: "expense", color: "#dc2626", icon: "FileText" },
  { name: "Debts", type: "expense", color: "#991b1b", icon: "CreditCard" },
  { name: "Snacks", type: "expense", color: "#fb923c", icon: "Cookie" },
  { name: "Other Expenses", type: "expense", color: "#64748b", icon: "MoreHorizontal" },
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
 * Main transaction store with localStorage persistence and undo/redo
 */
export const useTransactionStore = create<ExtendedTransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      categories: initializeDefaultCategories(),
      exchangeRates: DEFAULT_EXCHANGE_RATES,
      lastRateUpdate: null,
      history: {
        past: [],
        future: [],
      },

      // Helper to add action to history
      addToHistory: (action: HistoryAction) => {
        set((state) => ({
          history: {
            past: [...state.history.past.slice(-9), action], // Keep last 10 actions
            future: [], // Clear future when new action is performed
          },
        }));
      },

      addTransaction: (transaction) => {
        const newTransaction: Transaction = {
          ...transaction,
          id: generateId(),
          currency: transaction.currency || "IDR",
        };
        
        set((state) => ({
          transactions: [...state.transactions, newTransaction],
          history: {
            past: [
              ...state.history.past.slice(-9),
              { type: "ADD_TRANSACTION", transaction: newTransaction },
            ],
            future: [],
          },
        }));
      },

      updateTransaction: (id, updates) => {
        const state = get();
        const oldTransaction = state.transactions.find((t) => t.id === id);
        
        if (!oldTransaction) return;
        
        const newTransaction = { ...oldTransaction, ...updates };
        
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? newTransaction : t
          ),
          history: {
            past: [
              ...state.history.past.slice(-9),
              { 
                type: "UPDATE_TRANSACTION", 
                id, 
                oldTransaction, 
                newTransaction 
              },
            ],
            future: [],
          },
        }));
      },

      deleteTransaction: (id) => {
        const state = get();
        const transaction = state.transactions.find((t) => t.id === id);
        
        if (!transaction) return;
        
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
          history: {
            past: [
              ...state.history.past.slice(-9),
              { type: "DELETE_TRANSACTION", transaction },
            ],
            future: [],
          },
        }));
      },

      addCategory: (category) => {
        const newCategory: Category = {
          ...category,
          id: generateId(),
        };
        set((state) => ({
          categories: [...state.categories, newCategory],
          history: {
            past: [
              ...state.history.past.slice(-9),
              { type: "ADD_CATEGORY", category: newCategory },
            ],
            future: [],
          },
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
        const state = get();
        const category = state.categories.find((c) => c.id === id);
        const deletedTransactions = state.transactions.filter((t) => t.categoryId === id);
        
        if (!category) return;
        
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
          transactions: state.transactions.filter((t) => t.categoryId !== id),
          history: {
            past: [
              ...state.history.past.slice(-9),
              { type: "DELETE_CATEGORY", category, deletedTransactions },
            ],
            future: [],
          },
        }));
      },

      // Undo functionality
      undo: () => {
        const state = get();
        const { past, future } = state.history;
        
        if (past.length === 0) return;
        
        const action = past[past.length - 1];
        const newPast = past.slice(0, -1);
        
        switch (action.type) {
          case "ADD_TRANSACTION":
            set((state) => ({
              transactions: state.transactions.filter((t) => t.id !== action.transaction.id),
              history: {
                past: newPast,
                future: [action, ...future],
              },
            }));
            break;
            
          case "UPDATE_TRANSACTION":
            set((state) => ({
              transactions: state.transactions.map((t) =>
                t.id === action.id ? action.oldTransaction : t
              ),
              history: {
                past: newPast,
                future: [action, ...future],
              },
            }));
            break;
            
          case "DELETE_TRANSACTION":
            set((state) => ({
              transactions: [...state.transactions, action.transaction],
              history: {
                past: newPast,
                future: [action, ...future],
              },
            }));
            break;
            
          case "ADD_CATEGORY":
            set((state) => ({
              categories: state.categories.filter((c) => c.id !== action.category.id),
              history: {
                past: newPast,
                future: [action, ...future],
              },
            }));
            break;
            
          case "DELETE_CATEGORY":
            set((state) => ({
              categories: [...state.categories, action.category],
              transactions: [...state.transactions, ...action.deletedTransactions],
              history: {
                past: newPast,
                future: [action, ...future],
              },
            }));
            break;
        }
      },

      // Redo functionality
      redo: () => {
        const state = get();
        const { past, future } = state.history;
        
        if (future.length === 0) return;
        
        const action = future[0];
        const newFuture = future.slice(1);
        
        switch (action.type) {
          case "ADD_TRANSACTION":
            set((state) => ({
              transactions: [...state.transactions, action.transaction],
              history: {
                past: [...past, action],
                future: newFuture,
              },
            }));
            break;
            
          case "UPDATE_TRANSACTION":
            set((state) => ({
              transactions: state.transactions.map((t) =>
                t.id === action.id ? action.newTransaction : t
              ),
              history: {
                past: [...past, action],
                future: newFuture,
              },
            }));
            break;
            
          case "DELETE_TRANSACTION":
            set((state) => ({
              transactions: state.transactions.filter((t) => t.id !== action.transaction.id),
              history: {
                past: [...past, action],
                future: newFuture,
              },
            }));
            break;
            
          case "ADD_CATEGORY":
            set((state) => ({
              categories: [...state.categories, action.category],
              history: {
                past: [...past, action],
                future: newFuture,
              },
            }));
            break;
            
          case "DELETE_CATEGORY":
            set((state) => ({
              categories: state.categories.filter((c) => c.id !== action.category.id),
              transactions: state.transactions.filter(
                (t) => !action.deletedTransactions.some((dt) => dt.id === t.id)
              ),
              history: {
                past: [...past, action],
                future: newFuture,
              },
            }));
            break;
        }
      },

      // Check if undo is available
      canUndo: () => {
        return get().history.past.length > 0;
      },

      // Check if redo is available
      canRedo: () => {
        return get().history.future.length > 0;
      },

      // Clear history
      clearHistory: () => {
        set({
          history: {
            past: [],
            future: [],
          },
        });
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
              categories: migrateCategories(data.categories), // Migrate categories on import
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
      // Add migration on rehydration
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Migrate categories if they don't have icons
          const migratedCategories = migrateCategories(state.categories);
          if (JSON.stringify(migratedCategories) !== JSON.stringify(state.categories)) {
            state.categories = migratedCategories;
          }
        }
      },
    }
  )
);
