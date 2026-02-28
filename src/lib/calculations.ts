// File: src/lib/calculations.ts
import { Transaction, Currency } from '@/types';
import { convertToIDR } from './currency';

/**
 * Calculate total income
 */
export function calculateTotalIncome(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>
): number {
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);
}

/**
 * Calculate total expenses
 */
export function calculateTotalExpenses(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>
): number {
  return transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);
}

/**
 * Calculate balance
 */
export function calculateBalance(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>
): number {
  const income = calculateTotalIncome(transactions, exchangeRates);
  const expenses = calculateTotalExpenses(transactions, exchangeRates);
  return income - expenses;
}

/**
 * Calculate category totals
 */
export function calculateCategoryTotals(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>,
  type?: 'income' | 'expense'
): Record<string, number> {
  const filtered = type ? transactions.filter((t) => t.type === type) : transactions;

  return filtered.reduce((acc, transaction) => {
    const amount = convertToIDR(transaction.amount, transaction.currency, exchangeRates);
    acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);
}

/**
 * Calculate monthly data
 */
export interface MonthlyData {
  income: number;
  expenses: number;
  balance: number;
}

export function calculateMonthlyData(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>
): MonthlyData {
  const income = calculateTotalIncome(transactions, exchangeRates);
  const expenses = calculateTotalExpenses(transactions, exchangeRates);
  const balance = income - expenses;

  return { income, expenses, balance };
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Calculate budget usage
 */
export function calculateBudgetUsage(spent: number, budget: number): {
  percentage: number;
  remaining: number;
  isOverBudget: boolean;
} {
  const percentage = calculatePercentage(spent, budget);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  return { percentage, remaining, isOverBudget };
}
