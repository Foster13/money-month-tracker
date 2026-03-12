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
  icon?: string; // Lucide icon name
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
  selectedTransactionIds: Set<string>;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addCategory: (category: Omit<Category, "id">) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  updateExchangeRates: (rates: Record<Currency, number>) => void;
  exportData: () => string;
  importData: (jsonData: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  clearHistory: () => void;
  selectTransaction: (id: string) => void;
  deselectTransaction: (id: string) => void;
  toggleTransaction: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
  bulkDelete: (ids: string[]) => void;
  bulkUpdateCategory: (ids: string[], categoryId: string) => void;
  bulkExport: (ids: string[], format: 'json' | 'csv') => string;
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

/**
 * Props for the bulk delete confirmation dialog
 */
export interface BulkDeleteDialogProps {
  open: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Props for the bulk category change dialog
 */
export interface BulkCategoryDialogProps {
  open: boolean;
  count: number;
  categories: Category[];
  onConfirm: (categoryId: string) => void;
  onCancel: () => void;
}

/**
 * Props for the bulk export dialog
 */
export interface BulkExportDialogProps {
  open: boolean;
  count: number;
  onConfirm: (format: 'json' | 'csv') => void;
  onCancel: () => void;
}

/**
 * Props for the bulk actions toolbar component
 */
export interface BulkActionsToolbarProps {
  selectedCount: number;
  onBulkDelete: () => void;
  onBulkCategoryChange: () => void;
  onBulkExport: () => void;
  onClearSelection: () => void;
}
