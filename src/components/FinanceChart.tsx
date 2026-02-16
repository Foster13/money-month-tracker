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
  // Start from February 2026 and show last 6 months
  const feb2026 = new Date(2026, 1, 1); // February 2026 (month is 0-indexed)
  const now = new Date();
  
  // Use the later date between February 2026 and current date
  const baseDate = feb2026 > now ? feb2026 : now;
  
  // Get last 6 months from base date
  const endDate = baseDate;
  const startDate = subMonths(endDate, 5);
  
  // Only include months from February 2026 onwards
  const effectiveStartDate = startDate < feb2026 ? feb2026 : startDate;
  
  const months = eachMonthOfInterval({ start: effectiveStartDate, end: endDate });

  const chartData = months.map((month) => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthTransactions = transactions.filter((t) => {
      const transactionDate = parseISO(t.date);
      // Only include transactions from February 2026 onwards
      return transactionDate >= feb2026 && transactionDate >= monthStart && transactionDate <= monthEnd;
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
    <div className="animate-fade-in w-full">
      <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ 
              value: "Amount (IDR thousands)", 
              angle: -90, 
              position: "insideLeft",
              style: { fontSize: 12 }
            }}
            tick={{ fontSize: 12 }}
          />
          <Tooltip
            formatter={(value: number) => `Rp ${(value * 1000).toLocaleString("id-ID")}`}
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              transition: 'all 0.2s ease',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px' }} />
          <Bar dataKey="income" fill="#10b981" name="Income" radius={[4, 4, 0, 0]} />
          <Bar dataKey="expenses" fill="#ef4444" name="Expenses" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
