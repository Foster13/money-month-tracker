// File: src/components/Summary.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction, Currency } from "@/types";
import { convertToIDR } from "@/lib/currency";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";

interface SummaryProps {
  transactions: Transaction[];
  exchangeRates: Record<Currency, number>;
}

export function Summary({ transactions, exchangeRates }: SummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const balance = totalIncome - totalExpenses;

  const formatIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="glass-card animate-fade-in overflow-hidden border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-pink-700">💰 Total Income</CardTitle>
          <div className="p-2 rounded-full bg-pink-100 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 animate-bounce-subtle" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-pink-600 transition-all duration-300 break-words">
            {formatIDR(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All amounts converted to IDR
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in overflow-hidden border-rose-200" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-rose-700">💸 Total Expenses</CardTitle>
          <div className="p-2 rounded-full bg-rose-100 backdrop-blur-sm">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 animate-bounce-subtle" style={{ animationDelay: '0.1s' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 transition-all duration-300 break-words">
            {formatIDR(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All amounts converted to IDR
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in overflow-hidden border-purple-200 sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-purple-700">💝 Balance</CardTitle>
          <div className="p-2 rounded-full bg-purple-100 backdrop-blur-sm">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 animate-bounce-subtle" style={{ animationDelay: '0.2s' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-xl sm:text-2xl font-bold transition-all duration-300 break-words ${
              balance >= 0 ? "text-purple-600" : "text-rose-600"
            }`}
          >
            {formatIDR(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Net balance in IDR
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
