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
  | { type: "DELETE_CATEGORY"; category: Category; deletedTransactions: Transaction[] }
  | { type: "BULK_DELETE"; transactions: Transaction[] }
  | { type: "BULK_UPDATE"; updates: Array<{ id: string; oldTransaction: Transaction; newTransaction: Transaction }> };

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
      selectedTransactionIds: new Set<string>(),
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
        
        set((state) => {
          // Remove deleted transaction from selection set
          const newSelection = new Set(state.selectedTransactionIds);
          newSelection.delete(id);
          
          return {
            transactions: state.transactions.filter((t) => t.id !== id),
            selectedTransactionIds: newSelection,
            history: {
              past: [
                ...state.history.past.slice(-9),
                { type: "DELETE_TRANSACTION", transaction },
              ],
              future: [],
            },
          };
        });
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
        
        try {
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
              
            case "BULK_DELETE":
              set((state) => ({
                transactions: [...state.transactions, ...action.transactions],
                history: {
                  past: newPast,
                  future: [action, ...future],
                },
              }));
              break;
              
            case "BULK_UPDATE":
              set((state) => ({
                transactions: state.transactions.map((t) => {
                  // Find the update that matches this exact transaction
                  // We need to match by more than just ID to handle duplicates
                  const update = action.updates.find((u) => 
                    u.newTransaction.id === t.id &&
                    u.newTransaction.amount === t.amount &&
                    u.newTransaction.currency === t.currency &&
                    u.newTransaction.date === t.date &&
                    u.newTransaction.description === t.description &&
                    u.newTransaction.type === t.type
                  );
                  return update ? update.oldTransaction : t;
                }),
                history: {
                  past: newPast,
                  future: [action, ...future],
                },
              }));
              break;
          }
        } catch (error) {
          throw new Error(`Failed to undo operation: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      },

      // Redo functionality
      redo: () => {
        const state = get();
        const { past, future } = state.history;
        
        if (future.length === 0) return;
        
        const action = future[0];
        const newFuture = future.slice(1);
        
        try {
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
              
            case "BULK_DELETE":
              set((state) => ({
                transactions: state.transactions.filter(
                  (t) => !action.transactions.some((dt) => dt.id === t.id)
                ),
                history: {
                  past: [...past, action],
                  future: newFuture,
                },
              }));
              break;
              
            case "BULK_UPDATE":
              set((state) => ({
                transactions: state.transactions.map((t) => {
                  // Find the update that matches this exact transaction
                  // We need to match by more than just ID to handle duplicates
                  const update = action.updates.find((u) => 
                    u.oldTransaction.id === t.id &&
                    u.oldTransaction.amount === t.amount &&
                    u.oldTransaction.currency === t.currency &&
                    u.oldTransaction.date === t.date &&
                    u.oldTransaction.description === t.description &&
                    u.oldTransaction.type === t.type
                  );
                  return update ? update.newTransaction : t;
                }),
                history: {
                  past: [...past, action],
                  future: newFuture,
                },
              }));
              break;
          }
        } catch (error) {
          throw new Error(`Failed to redo operation: ${error instanceof Error ? error.message : 'Unknown error'}`);
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

      // Selection methods
      selectTransaction: (id) => {
        set((state) => {
          const newSelection = new Set(state.selectedTransactionIds);
          newSelection.add(id);
          return { selectedTransactionIds: newSelection };
        });
      },

      deselectTransaction: (id) => {
        set((state) => {
          const newSelection = new Set(state.selectedTransactionIds);
          newSelection.delete(id);
          return { selectedTransactionIds: newSelection };
        });
      },

      toggleTransaction: (id) => {
        set((state) => {
          const newSelection = new Set(state.selectedTransactionIds);
          if (newSelection.has(id)) {
            newSelection.delete(id);
          } else {
            newSelection.add(id);
          }
          return { selectedTransactionIds: newSelection };
        });
      },

      selectAll: (ids) => {
        set({ selectedTransactionIds: new Set(ids) });
      },

      clearSelection: () => {
        set({ selectedTransactionIds: new Set<string>() });
      },

      // Bulk operations
      bulkDelete: (ids) => {
        const state = get();
        
        // Filter to only valid transaction IDs (silently ignore invalid ones)
        const validIds = ids.filter((id) => state.transactions.some((t) => t.id === id));
        const transactionsToDelete = state.transactions.filter((t) => validIds.includes(t.id));
        
        if (transactionsToDelete.length === 0) return;
        
        set((state) => ({
          transactions: state.transactions.filter((t) => !validIds.includes(t.id)),
          selectedTransactionIds: new Set<string>(),
          history: {
            past: [
              ...state.history.past.slice(-9),
              { type: "BULK_DELETE", transactions: transactionsToDelete },
            ],
            future: [],
          },
        }));
      },

      bulkUpdateCategory: (ids, categoryId) => {
        const state = get();
        
        // Validate category exists
        const categoryExists = state.categories.some((c) => c.id === categoryId);
        if (!categoryExists) {
          throw new Error(`Category with ID "${categoryId}" does not exist`);
        }
        
        // Filter to only valid transaction IDs (silently ignore invalid ones)
        const validIds = ids.filter((id) => state.transactions.some((t) => t.id === id));
        const transactionsToUpdate = state.transactions.filter((t) => validIds.includes(t.id));
        
        if (transactionsToUpdate.length === 0) return;
        
        // Create update records with old and new transaction states
        const updates = transactionsToUpdate.map((t) => ({
          id: t.id,
          oldTransaction: t,
          newTransaction: { ...t, categoryId },
        }));
        
        set((state) => ({
          transactions: state.transactions.map((t) =>
            validIds.includes(t.id) ? { ...t, categoryId } : t
          ),
          selectedTransactionIds: new Set<string>(),
          history: {
            past: [
              ...state.history.past.slice(-9),
              { type: "BULK_UPDATE", updates },
            ],
            future: [],
          },
        }));
      },

      bulkExport: (ids, format) => {
        const state = get();
        
        // Filter to only valid transaction IDs (silently ignore invalid ones)
        const validIds = ids.filter((id) => state.transactions.some((t) => t.id === id));
        const transactionsToExport = state.transactions.filter((t) => validIds.includes(t.id));
        
        try {
          if (format === 'json') {
            // Generate JSON export with structure: { transactions, exportDate, exportCount }
            const exportData = {
              transactions: transactionsToExport,
              exportDate: new Date().toISOString(),
              exportCount: transactionsToExport.length,
            };
            return JSON.stringify(exportData, null, 2);
          } else {
            // Generate CSV export with headers: Date, Description, Amount, Currency, Category, Type
            const headers = 'Date,Description,Amount,Currency,Category,Type';
            const rows = transactionsToExport.map((t) => {
              const category = state.categories.find((c) => c.id === t.categoryId);
              const categoryName = category ? category.name : 'Unknown';
              
              // Escape CSV fields that contain commas or quotes
              const escapeCSV = (field: string) => {
                if (field.includes(',') || field.includes('"') || field.includes('\n')) {
                  return `"${field.replace(/"/g, '""')}"`;
                }
                return field;
              };
              
              return [
                t.date,
                escapeCSV(t.description),
                t.amount.toString(),
                t.currency,
                escapeCSV(categoryName),
                t.type,
              ].join(',');
            });
            
            return [headers, ...rows].join('\n');
          }
        } catch (error) {
          throw new Error(`Failed to generate ${format.toUpperCase()} export: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
