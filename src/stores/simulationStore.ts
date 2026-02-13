// File: src/stores/simulationStore.ts
import { create } from "zustand";
import { Transaction, Category, SimulationState, Currency } from "@/types";

/**
 * Generate a unique ID for simulation transactions
 */
const generateId = (): string => {
  return `sim-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Simulation store - non-persistent, for financial projections
 * This store does NOT sync with localStorage
 */
export const useSimulationStore = create<SimulationState>((set, get) => ({
  transactions: [],
  categories: [],

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

  clearSimulation: () => {
    set({
      transactions: [],
      categories: [],
    });
  },

  loadFromMain: (transactions, categories) => {
    // Create copies with new IDs to avoid conflicts
    const copiedTransactions = transactions.map((t) => ({
      ...t,
      id: generateId(),
    }));
    set({
      transactions: copiedTransactions,
      categories: [...categories],
    });
  },
}));
