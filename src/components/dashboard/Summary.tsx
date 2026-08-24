// File: src/components/dashboard/Summary.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction, Currency } from "@/types";
import { convertToIDR } from "@/lib/currency";
import { TrendingUp, TrendingDown, Wallet, FileDown, Activity } from "lucide-react";
import { Icon } from "@/components/icons/Icon";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SummaryProps {
  transactions: Transaction[];
  exchangeRates: Record<Currency, number>;
  lastMonthTransactions?: Transaction[];
}

export function Summary({ transactions, exchangeRates, lastMonthTransactions }: SummaryProps) {
  const { toast } = useToast();

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const balance = totalIncome - totalExpenses;

  // Calculate last month if provided
  const lastMonthTotalIncome = lastMonthTransactions
    ? lastMonthTransactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0)
    : undefined;

  const lastMonthTotalExpenses = lastMonthTransactions
    ? lastMonthTransactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0)
    : undefined;

  const lastMonthBalance = lastMonthTransactions
    ? (lastMonthTotalIncome || 0) - (lastMonthTotalExpenses || 0)
    : undefined;

  const formatIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const exportToPDF = async () => {
    window.print();
    toast({
      title: "Success",
      description: "Print dialog opened",
    });
  };

  const renderComparison = (
    current: number,
    previous: number | undefined,
    invertColors = false
  ) => {
    if (previous === undefined)
      return <p className="text-xs text-muted-foreground mt-1">All amounts converted to IDR</p>;

    if (previous === 0) {
      if (current === 0)
        return <p className="text-xs text-muted-foreground mt-1">No change from last month</p>;
      return <p className="text-xs text-muted-foreground mt-1">No data last month</p>;
    }

    const percent = ((current - previous) / previous) * 100;
    const isPositive = percent > 0;
    const isNeutral = percent === 0;

    let colorClass = "text-muted-foreground";
    if (!isNeutral) {
      if (invertColors) {
        colorClass = isPositive ? "text-red-500 font-medium" : "text-green-500 font-medium";
      } else {
        colorClass = isPositive ? "text-green-500 font-medium" : "text-red-500 font-medium";
      }
    }

    return (
      <p className={`text-xs mt-1 ${colorClass}`}>
        {isPositive ? "+" : ""}
        {percent.toFixed(1)}% from last month
      </p>
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={exportToPDF}
          size="sm"
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow text-xs sm:text-sm"
          aria-label="Export financial summary to PDF"
        >
          <FileDown className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden={true} />
          Export PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <Card className="bg-card border-income h-full shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5">
              Total Income
            </CardTitle>
            <div className="p-1.5 sm:p-2 rounded-md bg-income/10">
              <TrendingUp className="h-4 w-4 text-income" aria-hidden={true} />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-income break-words">
              {formatIDR(totalIncome)}
            </div>
            {renderComparison(totalIncome, lastMonthTotalIncome, false)}
          </CardContent>
        </Card>

        <Card className="bg-card border-expense h-full shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5">
              Total Expenses
            </CardTitle>
            <div className="p-1.5 sm:p-2 rounded-md bg-expense/10">
              <TrendingDown className="h-4 w-4 text-expense" aria-hidden={true} />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-expense break-words">
              {formatIDR(totalExpenses)}
            </div>
            {renderComparison(totalExpenses, lastMonthTotalExpenses, true)}
          </CardContent>
        </Card>

        <Card className="bg-card border-budget h-full shadow-sm sm:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5">
              Balance
            </CardTitle>
            <div className="p-1.5 sm:p-2 rounded-md bg-budget/10">
              <Activity className="h-4 w-4 text-budget" aria-hidden={true} />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div
              className={`text-xl sm:text-2xl md:text-3xl font-bold break-words ${balance >= 0 ? "text-budget" : "text-expense"}`}
            >
              {formatIDR(balance)}
            </div>
            {renderComparison(balance, lastMonthBalance, false)}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
