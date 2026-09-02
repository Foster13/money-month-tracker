import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Transaction, Category, TransactionState, Currency } from "@/types";
import { exportTransactionsData, importTransactionsData } from "@/services/transactionService";
import { supabase } from "@/lib/supabase";

/**
 * Extended transaction state without the history/crypto bloat
 */
interface ExtendedTransactionState extends TransactionState {
  isInitialized: boolean;
}

const CATEGORY_ICON_MAP: Record<string, string> = {
  Salary: "Briefcase",
  Freelance: "Laptop",
  Investments: "TrendingUp",
  Awards: "Award",
  Gifts: "Gift",
  "Savings/Passive": "PiggyBank",
  "Other Income": "DollarSign",
  Housing: "Home",
  Transportation: "Car",
  Food: "UtensilsCrossed",
  Coffee: "Coffee",
  Utilities: "Zap",
  "Internet/Phone": "Wifi",
  Healthcare: "Heart",
  Entertainment: "Film",
  Gaming: "Gamepad2",
  Shopping: "ShoppingBag",
  Clothing: "Shirt",
  Travel: "Plane",
  Education: "GraduationCap",
  Books: "Book",
  Fitness: "Dumbbell",
  Subscriptions: "Package",
  Bills: "FileText",
  Debts: "CreditCard",
  Snacks: "Cookie",
  Maintenance: "Wrench",
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
  { name: "Awards", type: "income", color: "#f59e0b", icon: "Award" },
  { name: "Gifts", type: "income", color: "#ec4899", icon: "Gift" },
  { name: "Savings/Passive", type: "income", color: "#14b8a6", icon: "PiggyBank" },
  { name: "Other Income", type: "income", color: "#06b6d4", icon: "DollarSign" },
];

const DEFAULT_EXPENSE_CATEGORIES: Omit<Category, "id">[] = [
  { name: "Housing", type: "expense", color: "#ef4444", icon: "Home" },
  { name: "Transportation", type: "expense", color: "#f59e0b", icon: "Car" },
  { name: "Food", type: "expense", color: "#ec4899", icon: "UtensilsCrossed" },
  { name: "Coffee", type: "expense", color: "#78350f", icon: "Coffee" },
  { name: "Utilities", type: "expense", color: "#6366f1", icon: "Zap" },
  { name: "Internet/Phone", type: "expense", color: "#0ea5e9", icon: "Wifi" },
  { name: "Healthcare", type: "expense", color: "#14b8a6", icon: "Heart" },
  { name: "Entertainment", type: "expense", color: "#f97316", icon: "Film" },
  { name: "Gaming", type: "expense", color: "#8b5cf6", icon: "Gamepad2" },
  { name: "Shopping", type: "expense", color: "#a855f7", icon: "ShoppingBag" },
  { name: "Clothing", type: "expense", color: "#db2777", icon: "Shirt" },
  { name: "Travel", type: "expense", color: "#0284c7", icon: "Plane" },
  { name: "Education", type: "expense", color: "#4f46e5", icon: "GraduationCap" },
  { name: "Books", type: "expense", color: "#059669", icon: "Book" },
  { name: "Fitness", type: "expense", color: "#ea580c", icon: "Dumbbell" },
  { name: "Subscriptions", type: "expense", color: "#475569", icon: "Package" },
  { name: "Bills", type: "expense", color: "#dc2626", icon: "FileText" },
  { name: "Debts", type: "expense", color: "#991b1b", icon: "CreditCard" },
  { name: "Maintenance", type: "expense", color: "#57534e", icon: "Wrench" },
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

const generateId = (): string => crypto.randomUUID();

const initializeDefaultCategories = (): Category[] => {
  // ponytail: Use deterministic IDs for default categories so they survive cross-device without sync
  const slugify = (name: string) => name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  return [
    ...DEFAULT_INCOME_CATEGORIES.map((cat) => ({ ...cat, id: slugify(cat.name) })),
    ...DEFAULT_EXPENSE_CATEGORIES.map((cat) => ({ ...cat, id: slugify(cat.name) })),
  ];
};

// ponytail helper: get current user id safely
const getUserId = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user?.id;
};

// ponytail helper: sync preferences
const syncPreferencesToSupabase = async (state: any) => {
  const userId = await getUserId();
  if (!userId) return;
  const { error } = await supabase.from("user_preferences").upsert(
    {
      user_id: userId,
      settings: {
        categories: state.categories,
        exchangeRates: state.exchangeRates,
        lastRateUpdate: state.lastRateUpdate,
        paydayDate: state.paydayDate,
        lastPaydayChange: state.lastPaydayChange,
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) console.error("Supabase Upsert Preferences Error:", error);
};

export const useTransactionStore = create<ExtendedTransactionState>()((set, get) => ({
  isInitialized: false,
  transactions: [],
  categories: initializeDefaultCategories(),
  exchangeRates: DEFAULT_EXCHANGE_RATES,
  lastRateUpdate: null,
  paydayDate: null,
  lastPaydayChange: null,
  selectedTransactionIds: new Set<string>(),

  setPaydayDate: (date: number) => {
    set({ paydayDate: date, lastPaydayChange: new Date().toISOString() });
    syncPreferencesToSupabase(get());
  },

  // ponytail: Fetch from Supabase
  fetchData: async () => {
    const userId = await getUserId();
    if (!userId) return;

    // Fetch transactions
    const { data: txData, error: txError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId);
    if (txError)
      alert(
        "Gagal mengambil data dari database! Error: " +
          txError.message +
          "\n\nIni biasanya karena kamu belum jalankan SQL RLS di Supabase Dashboard."
      );

    // Fetch preferences safely (in case of duplicate rows due to previous missing UNIQUE constraint)
    const { data: prefDataArray, error: prefError } = await supabase
      .from("user_preferences")
      .select("settings")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })
      .limit(1);

    if (prefError) console.error("Supabase Fetch Preferences Error:", prefError);

    const prefData = prefDataArray && prefDataArray.length > 0 ? prefDataArray[0] : null;

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
            createdAt: t.created_at, // ponytail: tracking input time
          }))
        : [], // Don't fall back to RAM if fetch fails or is empty
      categories: prefData?.settings?.categories
        ? migrateCategories(prefData.settings.categories)
        : state.categories,
      exchangeRates: prefData?.settings?.exchangeRates || state.exchangeRates,
      lastRateUpdate: prefData?.settings?.lastRateUpdate || state.lastRateUpdate,
      paydayDate: prefData?.settings?.paydayDate ?? null,
      lastPaydayChange: prefData?.settings?.lastPaydayChange ?? null,
      isInitialized: true,
    }));

    // ponytail: [] is truthy in JS! If prefData is missing (PGRST116), we must create it.
    if (!prefData) {
      syncPreferencesToSupabase(get());
    }
  },

  addTransaction: async (transaction) => {
    const isDuplicate = get().transactions.some(
      (t) =>
        t.amount === transaction.amount &&
        t.description === transaction.description &&
        t.date === transaction.date &&
        t.type === transaction.type
    );
    if (isDuplicate) return; // ponytail: silent reject duplicate input

    const userId = await getUserId();
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(), // DB uses UUID
      currency: transaction.currency || "IDR",
      createdAt: new Date().toISOString(), // ponytail: input time
    };

    // Optimistic UI
    set((state) => ({ transactions: [...state.transactions, newTransaction] }));

    // Push to DB
    if (userId) {
      try {
        // Ponytail: Strict serverless-style validation before pushing to DB
        const { transactionSchema } = await import("@/lib/schemas");
        const validTx = transactionSchema.parse(newTransaction);

        const { error } = await supabase.from("transactions").insert({
          id: newTransaction.id,
          user_id: userId,
          type: validTx.type,
          amount: validTx.amount,
          category: validTx.categoryId, // save UI categoryId to DB category column
          description: validTx.description,
          date: validTx.date,
          currency: validTx.currency,
        });

        if (error) {
          console.error("Supabase Insert Error:", error);
          const { supabaseUrl } = await import("@/lib/supabase");
          alert("Gagal menyimpan ke database: " + error.message + "\nURL Target: " + supabaseUrl);
          // Revert optimistic UI
          set((state) => ({
            transactions: state.transactions.filter((t) => t.id !== newTransaction.id),
          }));
        }
      } catch (err: any) {
        console.error("Transaction processing error:", err);
        alert("Terjadi kesalahan saat memproses data: " + (err.message || String(err)));
        // Revert optimistic UI
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== newTransaction.id),
        }));
      }
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
