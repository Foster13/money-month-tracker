import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Transaction, Category, TransactionState, Currency } from "@/types";
import { exportTransactionsData, importTransactionsData } from "@/services/transactionService";
import { supabase } from "@/lib/supabase";

/**
 * Extended transaction state without the history/crypto bloat
 */
interface ExtendedTransactionState extends TransactionState {}

const CATEGORY_ICON_MAP: Record<string, string> = {
  Salary: "Briefcase",
  Freelance: "Laptop",
  Investments: "TrendingUp",
  "Other Income": "DollarSign",
  Housing: "Home",
  Transportation: "Car",
  Food: "UtensilsCrossed",
  Utilities: "Zap",
  Healthcare: "Heart",
  Entertainment: "Film",
  Shopping: "ShoppingBag",
  Bills: "FileText",
  Debts: "CreditCard",
  Snacks: "Cookie",
  "Other Expenses": "MoreHorizontal",
  Debt: "CreditCard",
};

const migrateCategories = (categories: Category[]): Category[] => {
  return categories.map((category) => {
    if (category.icon) return category;
    return { ...category, icon: CATEGORY_ICON_MAP[category.name] || "Circle" };
  });
};

const DEFAULT_INCOME_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Salary", type: "income", color: "#10b981", icon: "Briefcase" },
  { name: "Freelance", type: "income", color: "#3b82f6", icon: "Laptop" },
  { name: "Investments", type: "income", color: "#8b5cf6", icon: "TrendingUp" },
  { name: "Other Income", type: "income", color: "#06b6d4", icon: "DollarSign" },
];

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

const generateId = (): string => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const initializeDefaultCategories = (): Category[] => {
  return [
    ...DEFAULT_INCOME_CATEGORIES.map((cat) => ({ ...cat, id: generateId() })),
    ...DEFAULT_EXPENSE_CATEGORIES.map((cat) => ({ ...cat, id: generateId() })),
  ];
};

// ponytail helper: get current user id safely
const getUserId = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id;
};

// ponytail helper: sync preferences
const syncPreferencesToSupabase = async (state: any) => {
  const userId = await getUserId();
  if (!userId) return;
  await supabase.from("user_preferences").upsert({
    user_id: userId,
    settings: {
      categories: state.categories,
      exchangeRates: state.exchangeRates,
      lastRateUpdate: state.lastRateUpdate,
    },
    updated_at: new Date().toISOString(),
  });
};

export const useTransactionStore = create<ExtendedTransactionState>()((set, get) => ({
  transactions: [],
  categories: initializeDefaultCategories(),
  exchangeRates: DEFAULT_EXCHANGE_RATES,
  lastRateUpdate: null,
  selectedTransactionIds: new Set<string>(),

  // ponytail: Fetch from Supabase
  fetchData: async () => {
    const userId = await getUserId();
    if (!userId) return;

    // Fetch transactions
    const { data: txData } = await supabase.from("transactions").select("*").eq("user_id", userId);
    // Fetch preferences
    const { data: prefData } = await supabase
      .from("user_preferences")
      .select("settings")
      .eq("user_id", userId)
      .single();

    if (txData || prefData) {
      set((state) => ({
        transactions: txData
          ? txData.map((t: any) => ({
              id: t.id,
              amount: t.amount,
              currency: t.currency,
              categoryId: t.category, // Map DB category to UI categoryId
              date: t.date,
              description: t.description || "",
              type: t.type,
            }))
          : state.transactions,
        categories: prefData?.settings?.categories
          ? migrateCategories(prefData.settings.categories)
          : state.categories,
        exchangeRates: prefData?.settings?.exchangeRates || state.exchangeRates,
        lastRateUpdate: prefData?.settings?.lastRateUpdate || state.lastRateUpdate,
      }));
    } else {
      // First time user, sync defaults
      syncPreferencesToSupabase(get());
    }
  },

  addTransaction: async (transaction) => {
    const userId = await getUserId();
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(), // DB uses UUID
      currency: transaction.currency || "IDR",
    };

    // Optimistic UI
    set((state) => ({ transactions: [...state.transactions, newTransaction] }));

    // Push to DB
    if (userId) {
      await supabase.from("transactions").insert({
        id: newTransaction.id,
        user_id: userId,
        type: newTransaction.type,
        amount: newTransaction.amount,
        category: newTransaction.categoryId, // save UI categoryId to DB category column
        description: newTransaction.description,
        date: newTransaction.date,
        currency: newTransaction.currency,
      });
    }
  },

  updateTransaction: async (id, updates) => {
    // Optimistic UI
    set((state) => ({
      transactions: state.transactions.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }));

    const userId = await getUserId();
    if (userId) {
      const t = get().transactions.find((t) => t.id === id);
      if (t) {
        await supabase
          .from("transactions")
          .update({
            type: t.type,
            amount: t.amount,
            category: t.categoryId,
            description: t.description,
            date: t.date,
            currency: t.currency,
          })
          .eq("id", id)
          .eq("user_id", userId);
      }
    }
  },

  deleteTransaction: async (id) => {
    // Optimistic UI
    set((state) => {
      const newSelection = new Set(state.selectedTransactionIds);
      newSelection.delete(id);
      return {
        transactions: state.transactions.filter((t) => t.id !== id),
        selectedTransactionIds: newSelection,
      };
    });

    const userId = await getUserId();
    if (userId) {
      await supabase.from("transactions").delete().eq("id", id).eq("user_id", userId);
    }
  },

  addCategory: (category) => {
    const newCategory: Category = { ...category, id: generateId() };
    set((state) => {
      const newState = { categories: [...state.categories, newCategory] };
      syncPreferencesToSupabase({ ...state, ...newState });
      return newState;
    });
  },

  updateCategory: (id, updates) => {
    set((state) => {
      const newState = {
        categories: state.categories.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      };
      syncPreferencesToSupabase({ ...state, ...newState });
      return newState;
    });
  },

  deleteCategory: (id) => {
    set((state) => {
      const newState = {
        categories: state.categories.filter((c) => c.id !== id),
        transactions: state.transactions.filter((t) => t.categoryId !== id),
      };
      syncPreferencesToSupabase({ ...state, ...newState });
      return newState;
    });
  },

  updateExchangeRates: (rates) => {
    set((state) => {
      const newState = { exchangeRates: rates, lastRateUpdate: new Date().toISOString() };
      syncPreferencesToSupabase({ ...state, ...newState });
      return newState;
    });
  },

  exportData: () => {
    const state = get();
    return exportTransactionsData(
      state.transactions,
      state.categories,
      state.exchangeRates,
      state.lastRateUpdate
    );
  },

  importData: (jsonData) => {
    const data = importTransactionsData(jsonData);
    set((state) => {
      const newState = {
        transactions: data.transactions,
        categories: migrateCategories(data.categories),
        exchangeRates: (data.exchangeRates as Record<Currency, number>) || DEFAULT_EXCHANGE_RATES,
        lastRateUpdate: data.lastRateUpdate || null,
      };
      syncPreferencesToSupabase(newState);
      return newState;
    });
  },

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
      if (newSelection.has(id)) newSelection.delete(id);
      else newSelection.add(id);
      return { selectedTransactionIds: newSelection };
    });
  },

  selectAll: (ids) => {
    set({ selectedTransactionIds: new Set(ids) });
  },

  clearSelection: () => {
    set({ selectedTransactionIds: new Set<string>() });
  },

  bulkDelete: async (ids) => {
    const state = get();
    const validIds = ids.filter((id) => state.transactions.some((t) => t.id === id));
    if (validIds.length === 0) return;

    set((state) => ({
      transactions: state.transactions.filter((t) => !validIds.includes(t.id)),
      selectedTransactionIds: new Set<string>(),
    }));

    const userId = await getUserId();
    if (userId) {
      await supabase.from("transactions").delete().in("id", validIds).eq("user_id", userId);
    }
  },

  bulkUpdateCategory: async (ids, categoryId) => {
    const state = get();
    const categoryExists = state.categories.some((c) => c.id === categoryId);
    if (!categoryExists) throw new Error(`Category with ID "${categoryId}" does not exist`);

    const validIds = ids.filter((id) => state.transactions.some((t) => t.id === id));
    if (validIds.length === 0) return;

    set((state) => ({
      transactions: state.transactions.map((t) =>
        validIds.includes(t.id) ? { ...t, categoryId } : t
      ),
      selectedTransactionIds: new Set<string>(),
    }));

    const userId = await getUserId();
    if (userId) {
      await supabase
        .from("transactions")
        .update({ category: categoryId })
        .in("id", validIds)
        .eq("user_id", userId);
    }
  },

  bulkExport: (ids, format) => {
    const state = get();
    const validIds = ids.filter((id) => state.transactions.some((t) => t.id === id));
    const transactionsToExport = state.transactions.filter((t) => validIds.includes(t.id));

    if (format === "json") {
      return JSON.stringify(
        {
          transactions: transactionsToExport,
          exportDate: new Date().toISOString(),
          exportCount: transactionsToExport.length,
        },
        null,
        2
      );
    } else {
      const headers = "Date,Description,Amount,Currency,Category,Type";
      const rows = transactionsToExport.map((t) => {
        const category = state.categories.find((c) => c.id === t.categoryId);
        const categoryName = category ? category.name : "Unknown";
        const escapeCSV = (field: string) => {
          if (field.includes(",") || field.includes('"') || field.includes("\n")) {
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
        ].join(",");
      });
      return [headers, ...rows].join("\n");
    }
  },

  canUndo: () => false,
  canRedo: () => false,
  undo: () => {},
  redo: () => {},
  clearHistory: () => {},
}));
