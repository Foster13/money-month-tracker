"use client";

import { useMemo, useState } from "react";
import { Transaction, Category, Currency } from "@/types";
import { getMoneyMonthBounds } from "@/lib/calculations";
import { convertToIDR, formatCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

interface MonthlyRecapSectionProps {
  transactions: Transaction[];
  categories: Category[];
  exchangeRates: Record<Currency, number>;
  paydayDate: number;
}

interface MonthlyStats {
  monthName: string;
  startDate: Date;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  avgExpensePerDay: number;
  highestExpense: number;
  lowestExpense: number;
  highestExpenseDate: string | null;
  lowestExpenseDate: string | null;
  mostExpensiveCategoryId: string | null;
  mostFrugalCategoryId: string | null;
  mostFrequentCategoryId: string | null;
  savingsRate: number;
}

export function MonthlyRecapSection({
  transactions,
  categories,
  exchangeRates,
  paydayDate,
}: MonthlyRecapSectionProps) {
  const getCategoryName = (id: string) => categories.find((c) => c.id === id)?.name || "Unknown";

  const recaps = useMemo(() => {
    if (!transactions.length) return [];

    // 1. Group transactions by their Money Month Start Date
    const grouped = new Map<string, Transaction[]>();

    transactions.forEach((t) => {
      const d = new Date(t.date);
      const { start } = getMoneyMonthBounds(d, paydayDate);
      const key = start.toISOString();
      if (!grouped.has(key)) grouped.set(key, []);
      grouped.get(key)!.push(t);
    });

    // 2. Calculate stats for each group
    const statsList: MonthlyStats[] = [];

    grouped.forEach((txs, key) => {
      const startDate = new Date(key);
      const { end: endDate } = getMoneyMonthBounds(startDate, paydayDate);

      // Create a nice month name, e.g. "Aug 25 - Sep 24, 2026"
      const monthName = `${format(startDate, "MMM d")} - ${format(endDate, "MMM d, yyyy")}`;

      let totalIncome = 0;
      let totalExpense = 0;
      let highestExpense = 0;
      let lowestExpense = Infinity;

      const categoryTotals = new Map<string, number>();
      const categoryCounts = new Map<string, number>();
      const dailyExpenses = new Map<string, number>();

      txs.forEach((t) => {
        const amount = convertToIDR(t.amount, t.currency, exchangeRates);
        if (t.type === "income") {
          totalIncome += amount;
        } else {
          totalExpense += amount;

          // Track min/max single transaction
          if (amount > highestExpense) highestExpense = amount;
          if (amount < lowestExpense) lowestExpense = amount;

          // Category tracking
          categoryTotals.set(t.categoryId, (categoryTotals.get(t.categoryId) || 0) + amount);
          categoryCounts.set(t.categoryId, (categoryCounts.get(t.categoryId) || 0) + 1);

          // Daily tracking
          const dateStr = t.date.split("T")[0]; // YYYY-MM-DD
          dailyExpenses.set(dateStr, (dailyExpenses.get(dateStr) || 0) + amount);
        }
      });

      if (lowestExpense === Infinity) lowestExpense = 0;

      const balance = totalIncome - totalExpense;
      const savingsRate = totalIncome > 0 ? (balance / totalIncome) * 100 : 0;

      // Days in this money month (could be 28, 30, 31)
      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const daysInMonth = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      const avgExpensePerDay = totalExpense / daysInMonth;

      // Find extreme categories
      let mostExpensiveCategoryId = null;
      let mostFrugalCategoryId = null;
      let mostFrequentCategoryId = null;
      let maxCatAmount = -1;
      let minCatAmount = Infinity;
      let maxCatCount = -1;

      categoryTotals.forEach((amount, id) => {
        if (amount > maxCatAmount) {
          maxCatAmount = amount;
          mostExpensiveCategoryId = id;
        }
        if (amount < minCatAmount) {
          minCatAmount = amount;
          mostFrugalCategoryId = id;
        }
      });

      categoryCounts.forEach((count, id) => {
        if (count > maxCatCount) {
          maxCatCount = count;
          mostFrequentCategoryId = id;
        }
      });

      // Find extreme days
      let highestExpenseDate = null;
      let lowestExpenseDate = null;
      let maxDayAmount = -1;
      let minDayAmount = Infinity;

      dailyExpenses.forEach((amount, dateStr) => {
        if (amount > maxDayAmount) {
          maxDayAmount = amount;
          highestExpenseDate = dateStr;
        }
        if (amount < minDayAmount) {
          minDayAmount = amount;
          lowestExpenseDate = dateStr;
        }
      });

      statsList.push({
        monthName,
        startDate,
        totalIncome,
        totalExpense,
        balance,
        avgExpensePerDay,
        highestExpense,
        lowestExpense,
        highestExpenseDate,
        lowestExpenseDate,
        mostExpensiveCategoryId,
        mostFrugalCategoryId,
        mostFrequentCategoryId,
        savingsRate,
      });
    });

    // Sort descending by startDate
    return statsList.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }, [transactions, paydayDate, exchangeRates]);

  const formatIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  if (!recaps.length) return null;

  return (
    <Card className="mt-8 border-primary/20 shadow-sm bg-card/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">Monthly Recaps & Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* ponytail: Native HTML5 details/summary. YAGNI complex third-party accordion bloat */}
          {recaps.map((recap) => (
            <details
              key={recap.startDate.toISOString()}
              className="group border border-border rounded-lg bg-background"
            >
              <summary className="font-semibold text-lg hover:text-primary cursor-pointer p-4 select-none list-none flex justify-between items-center transition-colors">
                {recap.monthName}
                <span className="transform transition-transform duration-200 group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <div className="p-4 pt-0 border-t border-border/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                  {/* Financials */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary border-b pb-1">Overview</h4>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Income</span>
                      <span className="font-medium text-income">
                        {formatIDR(recap.totalIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Expense</span>
                      <span className="font-medium text-expense">
                        {formatIDR(recap.totalExpense)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Balance</span>
                      <span
                        className={`font-medium ${recap.balance >= 0 ? "text-budget" : "text-expense"}`}
                      >
                        {formatIDR(recap.balance)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Savings Rate</span>
                      <span className="font-medium">{recap.savingsRate.toFixed(1)}%</span>
                    </div>
                  </div>

                  {/* Highlights */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary border-b pb-1">Highlights</h4>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Highest Tx</span>
                      <span className="font-medium text-expense">
                        {formatIDR(recap.highestExpense)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lowest Tx</span>
                      <span className="font-medium text-expense">
                        {formatIDR(recap.lowestExpense)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Avg/Day</span>
                      <span className="font-medium text-expense">
                        {formatIDR(recap.avgExpensePerDay)}
                      </span>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-primary border-b pb-1">Insights</h4>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Most Expensive Category</span>
                      <span className="text-sm font-medium">
                        {recap.mostExpensiveCategoryId
                          ? getCategoryName(recap.mostExpensiveCategoryId)
                          : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Most Frugal Category</span>
                      <span className="text-sm font-medium">
                        {recap.mostFrugalCategoryId
                          ? getCategoryName(recap.mostFrugalCategoryId)
                          : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Most Frequent (Habit)</span>
                      <span className="text-sm font-medium">
                        {recap.mostFrequentCategoryId
                          ? getCategoryName(recap.mostFrequentCategoryId)
                          : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Highest Spend Day</span>
                      <span className="text-sm font-medium">
                        {recap.highestExpenseDate
                          ? format(new Date(recap.highestExpenseDate), "dd MMM yyyy")
                          : "-"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground">Lowest Spend Day</span>
                      <span className="text-sm font-medium">
                        {recap.lowestExpenseDate
                          ? format(new Date(recap.lowestExpenseDate), "dd MMM yyyy")
                          : "-"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </details>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
