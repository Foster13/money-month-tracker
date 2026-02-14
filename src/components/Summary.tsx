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
    <div className="grid gap-4 md:grid-cols-3">
      <Card className="glass-card animate-fade-in overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          <div className="p-2 rounded-full bg-green-500/10 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 text-green-600 animate-bounce-subtle" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600 transition-all duration-300">
            {formatIDR(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All amounts converted to IDR
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          <div className="p-2 rounded-full bg-red-500/10 backdrop-blur-sm">
            <TrendingDown className="h-4 w-4 text-red-600 animate-bounce-subtle" style={{ animationDelay: '0.1s' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 transition-all duration-300">
            {formatIDR(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All amounts converted to IDR
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
          <div className="p-2 rounded-full bg-blue-500/10 backdrop-blur-sm">
            <Wallet className="h-4 w-4 text-blue-600 animate-bounce-subtle" style={{ animationDelay: '0.2s' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold transition-all duration-300 ${
              balance >= 0 ? "text-blue-600" : "text-red-600"
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
