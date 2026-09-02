// File: src/components/dashboard/Summary.tsx
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction, Currency } from "@/types";
import { convertToIDR } from "@/lib/currency";
import { TrendingUp, TrendingDown, Wallet, FileDown, Activity, MessageCircle } from "lucide-react";
import { Icon } from "@/components/icons/Icon";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { linkWhatsAppNumber } from "@/app/actions/user";

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

  const now = new Date();
  const startOfTodayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfTodayDate = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const expenseToday = transactions
    .filter((t) => {
      const d = new Date(t.date);
      return t.type === "expense" && d >= startOfTodayDate && d <= endOfTodayDate;
    })
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  // ponytail: hardcoded limit instead of DB schema bloat. Minimum that works.
  const DAILY_LIMIT = 100000;
  const isOverLimit = expenseToday > DAILY_LIMIT;

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

  const [phoneNumber, setPhoneNumber] = useState("");

  const savePhoneNumber = async () => {
    if (!phoneNumber) {
      toast({ title: "Info", description: "Nomor WA masih kosong!" });
      return;
    }

    let formattedPhone = phoneNumber.replace(/\D/g, "");
    if (formattedPhone.startsWith("0")) {
      formattedPhone = "62" + formattedPhone.slice(1);
    }
    formattedPhone = "+" + formattedPhone;

    const {
      data: { session },
      error: authError,
    } = await supabase.auth.getSession();
    const user = session?.user;

    if (authError || !user) {
      toast({
        title: "Error",
        description: "Gagal dapat sesi user. Coba refresh atau relogin.",
        variant: "destructive",
      });
      return;
    }

    const result = await linkWhatsAppNumber(user.id, formattedPhone);

    if (result.success) {
      setPhoneNumber(formattedPhone);
      toast({ title: "Success", description: "Nomor WA berhasil di-link!" });
    } else {
      console.error("Supabase error:", result.error);
      toast({ title: "Error", description: `Gagal: ${result.error}`, variant: "destructive" });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {isOverLimit && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-lg flex items-center justify-between text-sm sm:text-base font-medium">
          <span>
            ⚠️ Alert: You have exceeded your daily expense limit of {formatIDR(DAILY_LIMIT)}!
          </span>
        </div>
      )}

      {/* Export Button & WA Link */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-card p-3 rounded-lg shadow-sm">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            placeholder="+62812..."
            className="text-xs sm:text-sm p-2 border rounded-md flex-1 sm:w-32"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
          <Button size="sm" variant="outline" onClick={savePhoneNumber}>
            Link WA
          </Button>
        </div>
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={() => {
              const text = `Ringkasan Keuangan:\nIncome: ${formatIDR(totalIncome)}\nExpense: ${formatIDR(totalExpenses)}\nBalance: ${formatIDR(balance)}\nExpense Today: ${formatIDR(expenseToday)}`;
              window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
            }}
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow text-xs sm:text-sm flex-1 sm:flex-none"
            aria-label="Share to WhatsApp"
          >
            <MessageCircle className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden={true} />
            <span className="hidden sm:inline">Share to WA</span>
            <span className="sm:hidden">Share</span>
          </Button>
          <Button
            onClick={exportToPDF}
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm hover:shadow text-xs sm:text-sm flex-1 sm:flex-none"
            aria-label="Export financial summary to PDF"
          >
            <FileDown className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" aria-hidden={true} />
            <span className="hidden sm:inline">Export PDF</span>
            <span className="sm:hidden">PDF</span>
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-card to-card/50 border-income h-full shadow-sm group hover:border-income/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5">
              Total Income
            </CardTitle>
            <div className="p-1.5 sm:p-2 rounded-xl bg-income/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-income/20">
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

        <Card className="bg-gradient-to-br from-card to-card/50 border-expense h-full shadow-sm group hover:border-expense/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5">
              Total Expenses
            </CardTitle>
            <div className="p-1.5 sm:p-2 rounded-xl bg-expense/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-expense/20">
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

        <Card className="bg-gradient-to-br from-card to-card/50 border-budget h-full shadow-sm group hover:border-budget/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5">
              Balance
            </CardTitle>
            <div className="p-1.5 sm:p-2 rounded-xl bg-budget/10 transition-transform duration-300 group-hover:scale-110 group-hover:bg-budget/20">
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

        <Card
          className={`bg-gradient-to-br from-card to-card/50 border h-full shadow-sm group ${isOverLimit ? "border-red-500 hover:border-red-500/50" : "border-blue-500 hover:border-blue-500/50"}`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
            <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1 sm:gap-1.5">
              Expense Today
            </CardTitle>
            <div
              className={`p-1.5 sm:p-2 rounded-xl transition-transform duration-300 group-hover:scale-110 ${isOverLimit ? "bg-red-500/10" : "bg-blue-500/10"}`}
            >
              <TrendingDown
                className={`h-4 w-4 ${isOverLimit ? "text-red-500" : "text-blue-500"}`}
                aria-hidden={true}
              />
            </div>
          </CardHeader>
          <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
            <div
              className={`text-xl sm:text-2xl md:text-3xl font-bold break-words ${isOverLimit ? "text-red-500" : "text-blue-500"}`}
            >
              {formatIDR(expenseToday)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Resets at midnight</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
