// File: src/components/FinanceChart.tsx
"use client";

import { Transaction, Currency } from "@/types";
import { convertToIDR } from "@/lib/currency";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from "date-fns";

interface FinanceChartProps {
  transactions: Transaction[];
  exchangeRates: Record<Currency, number>;
}

export function FinanceChart({ transactions, exchangeRates }: FinanceChartProps) {
  // Get last 6 months including current month
  const endDate = new Date();
  const startDate = subMonths(endDate, 5);
  
  const months = eachMonthOfInterval({ start: startDate, end: endDate });

  const chartData = months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = parseISO(t.date);
      return transactionDate >= monthStart && transactionDate <= monthEnd;
    });

    const income = monthTransactions
      .filter((t) => t.type === "income")
      .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

    const expenses = monthTransactions
      .filter((t) => t.type === "expense")
      .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

    return {
      month: format(month, "MMM yyyy"),
      income: parseFloat((income / 1000).toFixed(2)), // Convert to thousands
      expenses: parseFloat((expenses / 1000).toFixed(2)), // Convert to thousands
    };
  });

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis label={{ value: "Amount (IDR thousands)", angle: -90, position: "insideLeft" }} />
        <Tooltip
          formatter={(value: number) => `Rp ${(value * 1000).toLocaleString("id-ID")}`}
        />
        <Legend />
        <Bar dataKey="income" fill="#10b981" name="Income" />
        <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
      </BarChart>
    </ResponsiveContainer>
  );
}
