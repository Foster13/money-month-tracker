// File: src/lib/calculations.ts
import { Transaction, Currency } from "@/types";
import { convertToIDR } from "./currency";
import { set, getDaysInMonth, isBefore, subMonths, addMonths } from "date-fns";

/**
 * Calculates the custom Money Month boundaries based on the user's payday.
 */
export function getMoneyMonthBounds(now: Date, paydayDate: number): { start: Date; end: Date } {
  const currentMonthDays = getDaysInMonth(now);
  const clampedPayday = Math.min(paydayDate, currentMonthDays);

  let start = set(now, { date: clampedPayday, hours: 0, minutes: 0, seconds: 0, milliseconds: 0 });

  // If today is before payday, the current money month started last month.
  if (isBefore(now, start)) {
    const prevMonth = subMonths(now, 1);
    const prevMonthDays = getDaysInMonth(prevMonth);
    start = set(prevMonth, {
      date: Math.min(paydayDate, prevMonthDays),
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    });
  }

  // The end is the day before the NEXT payday
  const nextMonth = addMonths(start, 1);
  const nextMonthDays = getDaysInMonth(nextMonth);
  const nextPayday = set(nextMonth, {
    date: Math.min(paydayDate, nextMonthDays),
    hours: 0,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const end = new Date(nextPayday.getTime() - 1); // 23:59:59.999 of the day before

  return { start, end };
}

/**
 * Calculate total income
 */
export function calculateTotalIncome(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>
): number {
  return transactions
    .filter((t) => t.type === "income")
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
    .filter((t) => t.type === "expense")
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
  type?: "income" | "expense"
): Record<string, number> {
  const filtered = type ? transactions.filter((t) => t.type === type) : transactions;

  return filtered.reduce(
    (acc, transaction) => {
      const amount = convertToIDR(transaction.amount, transaction.currency, exchangeRates);
      acc[transaction.categoryId] = (acc[transaction.categoryId] || 0) + amount;
      return acc;
    },
    {} as Record<string, number>
  );
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
 * Calculate historical data for the last 6 months
 */
export function calculateLastSixMonthsData(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>,
  paydayDate: number = 1
): Record<string, { income: number; expenses: number; monthName: string }> {
  const monthlyData: Record<string, { income: number; expenses: number; monthName: string }> = {};

  const startDate = new Date(2026, 1, 1); // Feb 2026
  const now = new Date();
  const baseDate = startDate > now ? startDate : now;

  for (let i = 5; i >= 0; i--) {
    const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
    if (date >= startDate) {
      // Use the new bounds logic instead of calendar month
      const { start, end } = getMoneyMonthBounds(date, paydayDate);

      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      const monthName = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      // Calculate totals for this custom month
      const income = transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return t.type === "income" && tDate >= start && tDate <= end;
        })
        .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

      const expenses = transactions
        .filter((t) => {
          const tDate = new Date(t.date);
          return t.type === "expense" && tDate >= start && tDate <= end;
        })
        .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

      monthlyData[key] = { income, expenses, monthName };
    }
  }

  return monthlyData;
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
export function calculateBudgetUsage(
  spent: number,
  budget: number
): {
  percentage: number;
  remaining: number;
  isOverBudget: boolean;
} {
  const percentage = calculatePercentage(spent, budget);
  const remaining = budget - spent;
  const isOverBudget = spent > budget;

  return { percentage, remaining, isOverBudget };
}

/**
 * Get the top expense category for roasting widget
 */
export function getTopExpenseCategory(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>
): { categoryId: string; amount: number } | null {
  const totals = calculateCategoryTotals(transactions, exchangeRates, "expense");
  const entries = Object.entries(totals);
  if (entries.length === 0) return null;

  const top = entries.reduce((max, current) => (current[1] > max[1] ? current : max));
  return { categoryId: top[0], amount: top[1] };
}
