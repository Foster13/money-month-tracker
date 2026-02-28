// File: src/lib/date.ts
import { startOfMonth, endOfMonth, parseISO, format } from 'date-fns';
import { Transaction } from '@/types';

/**
 * Get transactions for current month
 */
export function getCurrentMonthTransactions(transactions: Transaction[]): Transaction[] {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  return transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });
}

/**
 * Get transactions for a specific month
 */
export function getMonthTransactions(
  transactions: Transaction[],
  year: number,
  month: number
): Transaction[] {
  const monthStart = startOfMonth(new Date(year, month, 1));
  const monthEnd = endOfMonth(new Date(year, month, 1));

  return transactions.filter((transaction) => {
    const transactionDate = parseISO(transaction.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });
}

/**
 * Format date for display
 */
export function formatDisplayDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
}

/**
 * Format date for input
 */
export function formatInputDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return format(dateObj, 'yyyy-MM-dd');
}

/**
 * Get month name
 */
export function getMonthName(month: number): string {
  const date = new Date(2000, month, 1);
  return format(date, 'MMMM');
}

/**
 * Get last N months
 */
export function getLastNMonths(n: number): Array<{ year: number; month: number; label: string }> {
  const months: Array<{ year: number; month: number; label: string }> = [];
  const now = new Date();

  for (let i = n - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      year: date.getFullYear(),
      month: date.getMonth(),
      label: format(date, 'MMM yyyy'),
    });
  }

  return months;
}
