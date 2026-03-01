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
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FinanceChartProps {
  transactions: Transaction[];
  exchangeRates: Record<Currency, number>;
}

export function FinanceChart({ transactions, exchangeRates }: FinanceChartProps) {
  // State to track theme colors and text color
  const [chartColors, setChartColors] = useState({
    income: 'hsl(160 84% 39%)',    // emerald-600 (light mode default)
    expense: 'hsl(0 72% 51%)',     // red-600 (light mode default)
    text: 'hsl(0 0% 20%)',         // Dark text for light mode
  });

  // State to track window width for responsive font sizes
  const [isMobile, setIsMobile] = useState(false);

  // Update colors when theme changes
  useEffect(() => {
    const updateColors = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setChartColors({
        income: isDark ? 'hsl(160 84% 60%)' : 'hsl(160 84% 39%)',   // emerald-400 : emerald-600
        expense: isDark ? 'hsl(0 72% 65%)' : 'hsl(0 72% 51%)',      // red-400 : red-600
        text: isDark ? 'hsl(0 0% 80%)' : 'hsl(0 0% 20%)',          // Light text for dark mode, dark text for light mode
      });
    };

    // Initial color setup
    updateColors();

    // Watch for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          updateColors();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  // Track window width for responsive font sizes
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    // Initial check
    checkMobile();

    // Listen for resize
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
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

  // Responsive font sizes based on screen width
  const tickFontSize = isMobile ? 11 : 14;
  const labelFontSize = isMobile ? 12 : 14;

  return (
    <Card className="animate-fade-in w-full">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-heading">Financial Overview</CardTitle>
      </CardHeader>
      <CardContent className="px-2 sm:px-4 md:px-6">
        <ResponsiveContainer width="100%" height={isMobile ? 280 : 350}>
          <BarChart 
            data={chartData}
            margin={{ 
              top: 5, 
              right: isMobile ? 5 : 20, 
              left: isMobile ? 0 : 10, 
              bottom: 5 
            }}
          >
            <CartesianGrid strokeDasharray="3 3" className="opacity-50" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: tickFontSize, fill: chartColors.text }}
              angle={-45}
              textAnchor="end"
              height={80}
              label={{ 
                value: "Month", 
                position: "insideBottom",
                offset: -5,
                style: { fontSize: labelFontSize, fill: chartColors.text, fontWeight: 600 }
              }}
            />
            <YAxis 
              label={{ 
                value: isMobile ? "IDR (k)" : "Amount (IDR thousands)", 
                angle: -90, 
                position: "insideLeft",
                style: { fontSize: labelFontSize, fill: chartColors.text, fontWeight: 600 }
              }}
              tick={{ fontSize: tickFontSize, fill: chartColors.text }}
              width={isMobile ? 45 : 80}
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
            <Legend 
              wrapperStyle={{ 
                fontSize: '12px',
                paddingTop: '16px'
              }}
              verticalAlign="bottom"
              height={36}
            />
            <Bar dataKey="income" fill={chartColors.income} name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" fill={chartColors.expense} name="Expenses" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
