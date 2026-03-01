// File: src/components/BudgetSection.tsx
"use client";

import { useState } from "react";
import { Transaction, Category, Currency } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, parseISO, startOfMonth, endOfMonth } from "date-fns";
import { convertToIDR, formatCurrency } from "@/lib/currency";
import { Wallet, TrendingUp, TrendingDown, Target, Edit2, Check, X } from "lucide-react";
import { Icon } from "./icons/Icon";
import { IconRenderer } from "./icons/IconRenderer";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "@/components/ui/empty-state";

interface BudgetSectionProps {
  transactions: Transaction[];
  categories: Category[];
  exchangeRates: Record<Currency, number>;
}

export function BudgetSection({
  transactions,
  categories,
  exchangeRates,
}: BudgetSectionProps) {
  const [monthlyBudget, setMonthlyBudget] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("monthlyBudget");
      return saved ? parseFloat(saved) : 0;
    }
    return 0;
  });
  const [isEditing, setIsEditing] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget.toString());
  const { toast } = useToast();

  // Get current month transactions
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });

  // Calculate totals
  const totalIncome = currentMonthTransactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const totalExpenses = currentMonthTransactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const balance = totalIncome - totalExpenses;
  const budgetRemaining = monthlyBudget - totalExpenses;
  const budgetPercentage = monthlyBudget > 0 ? (totalExpenses / monthlyBudget) * 100 : 0;

  // Get latest 5 transactions (sorted by date, then by creation time)
  const latestTransactions = [...currentMonthTransactions]
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (dateB !== dateA) {
        return dateB - dateA; // Newer dates first
      }
      
      // If dates are the same, sort by ID (which contains timestamp)
      const timestampA = parseInt(a.id.split('-')[0]) || 0;
      const timestampB = parseInt(b.id.split('-')[0]) || 0;
      
      return timestampB - timestampA; // Most recently created first
    })
    .slice(0, 5);

  // Get top 3 categories by transaction count
  const categoryStats = currentMonthTransactions.reduce((acc, t) => {
    const categoryId = t.categoryId;
    if (!acc[categoryId]) {
      acc[categoryId] = { count: 0, total: 0 };
    }
    acc[categoryId].count++;
    acc[categoryId].total += convertToIDR(t.amount, t.currency, exchangeRates);
    return acc;
  }, {} as Record<string, { count: number; total: number }>);

  const topCategories = Object.entries(categoryStats)
    .map(([categoryId, stats]) => ({
      categoryId,
      ...stats,
      category: categories.find((c) => c.id === categoryId),
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const handleSaveBudget = () => {
    const budget = parseFloat(tempBudget);
    if (isNaN(budget) || budget < 0) {
      toast({
        title: "Invalid Budget",
        description: "Please enter a valid positive number",
        variant: "destructive",
      });
      return;
    }
    setMonthlyBudget(budget);
    localStorage.setItem("monthlyBudget", budget.toString());
    setIsEditing(false);
    toast({
      title: "Budget Updated",
      description: `Monthly budget set to Rp ${budget.toLocaleString("id-ID")}`,
    });
  };

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#64748b";
  };

  const getCategoryIcon = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.icon || "Circle";
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden">
      {/* Budget Overview - Responsive spacing and layout */}
      <Card className="glass-card overflow-hidden border-budget mb-6">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-3 rounded-full bg-budget backdrop-blur-sm flex-shrink-0">
              <Target className="h-5 w-5 sm:h-6 sm:w-6 text-budget" aria-hidden={true} />
            </div>
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl lg:text-2xl text-budget truncate flex items-center gap-2">
                <Icon name="budget" size="lg" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden={true} />
                Monthly Budget
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {format(now, "MMMM yyyy")}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 space-y-4 sm:space-y-5">
          {/* Budget Setting - Responsive with proper touch targets */}
          <div className="space-y-2">
            <Label htmlFor="monthly-budget" className="text-sm">Set Monthly Budget</Label>
            {isEditing ? (
              <div className="flex gap-2">
                <Input
                  id="monthly-budget"
                  type="number"
                  value={tempBudget}
                  onChange={(e) => setTempBudget(e.target.value)}
                  placeholder="Enter budget amount"
                  className="flex-1 text-sm min-h-[44px]"
                  aria-label="Monthly budget amount"
                />
                <Button size="icon" onClick={handleSaveBudget} className="bg-budget hover:opacity-90 flex-shrink-0 min-h-[44px] min-w-[44px]" aria-label="Save budget">
                  <Check className="h-4 w-4" aria-hidden={true} />
                </Button>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setTempBudget(monthlyBudget.toString());
                  }}
                  className="flex-shrink-0 min-h-[44px] min-w-[44px]"
                  aria-label="Cancel editing budget"
                >
                  <X className="h-4 w-4" aria-hidden={true} />
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 sm:p-4 bg-budget rounded-lg gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-budget break-words">
                    Rp {monthlyBudget.toLocaleString("id-ID")}
                  </p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Monthly Budget</p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(true);
                    setTempBudget(monthlyBudget.toString());
                  }}
                  className="flex-shrink-0 min-h-[44px] min-w-[44px]"
                  aria-label="Edit budget"
                >
                  <Edit2 className="h-4 w-4" aria-hidden={true} />
                </Button>
              </div>
            )}
          </div>

          {/* Budget Progress - Responsive spacing */}
          {monthlyBudget > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Budget Used</span>
                <span className="font-medium">
                  {budgetPercentage.toFixed(1)}%
                </span>
              </div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    budgetPercentage > 100
                      ? "bg-rose-500"
                      : budgetPercentage > 80
                      ? "bg-orange-500"
                      : "bg-budget"
                  }`}
                  style={{ width: `${Math.min(budgetPercentage, 100)}%` }}
                />
              </div>
              <div className="flex justify-between items-center gap-2">
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Spent</p>
                  <p className="font-semibold text-sm sm:text-base text-expense break-words">
                    Rp {totalExpenses.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="text-right min-w-0 flex-1">
                  <p className="text-xs sm:text-sm text-muted-foreground">Remaining</p>
                  <p className={`font-semibold text-sm sm:text-base break-words ${budgetRemaining >= 0 ? "text-budget" : "text-expense"}`}>
                    Rp {Math.abs(budgetRemaining).toLocaleString("id-ID")}
                    {budgetRemaining < 0 && " over"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <EmptyState
              icon={<Target className="w-8 h-8 text-budget" aria-hidden={true} />}
              title="No budget set"
              description="Set a monthly budget above to track your spending and stay on target with your financial goals."
              className="py-6"
            />
          )}

          {/* Quick Stats - Responsive grid */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 pt-4 border-t">
            <div className="text-center">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-income mx-auto mb-1" aria-hidden={true} />
              <p className="text-xs sm:text-sm text-muted-foreground">Income</p>
              <p className="font-semibold text-sm sm:text-base text-income break-words">
                Rp {(totalIncome / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="text-center">
              <TrendingDown className="h-5 w-5 sm:h-6 sm:w-6 text-rose-500 mx-auto mb-1" aria-hidden={true} />
              <p className="text-xs sm:text-sm text-muted-foreground">Expenses</p>
              <p className="font-semibold text-sm sm:text-base text-expense break-words">
                Rp {(totalExpenses / 1000).toFixed(0)}k
              </p>
            </div>
            <div className="text-center">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-budget mx-auto mb-1" aria-hidden={true} />
              <p className="text-xs sm:text-sm text-muted-foreground">Balance</p>
              <p className={`font-semibold text-sm sm:text-base break-words ${balance >= 0 ? "text-budget" : "text-expense"}`}>
                Rp {(balance / 1000).toFixed(0)}k
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top 3 Categories & Latest Transactions - Responsive 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Top 3 Categories */}
        <Card className="glass-subtle">
          <CardHeader className="px-4 sm:px-6 py-4">
            <CardTitle className="text-base sm:text-lg font-semibold">🏆 Top 3 Categories</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 space-y-3">
            {topCategories.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">
                No transactions yet this month
              </p>
            ) : (
              topCategories.map((item, index) => (
                <div
                  key={item.categoryId}
                  className="flex items-center justify-between p-3 sm:p-4 bg-background/50 rounded-lg hover-lift transition-all gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-budget font-bold text-budget text-sm flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: item.category?.color || "#64748b" }}
                      />
                      <span className="font-medium text-sm sm:text-base truncate">{item.category?.name || "Unknown"}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-xs sm:text-sm">{item.count} txn</p>
                    <p className="text-xs text-muted-foreground whitespace-nowrap">
                      Rp {(item.total / 1000).toFixed(0)}k
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Latest Transactions */}
        <Card className="glass-subtle">
          <CardHeader className="px-4 sm:px-6 py-4">
            <CardTitle className="text-base sm:text-lg font-semibold">📋 Latest Transactions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 sm:px-6 pb-6 space-y-3">
            {latestTransactions.length === 0 ? (
              <p className="text-sm text-center py-4 text-muted-foreground">
                No transactions yet this month
              </p>
            ) : (
              latestTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 sm:p-4 bg-background/50 rounded-lg hover-lift transition-all gap-2"
                >
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <IconRenderer 
                      name={getCategoryIcon(transaction.categoryId)}
                      className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                      style={{ color: getCategoryColor(transaction.categoryId) }}
                      aria-hidden={true}
                    />
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm sm:text-base truncate">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {getCategoryName(transaction.categoryId)} • {format(parseISO(transaction.date), "MMM dd")}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`font-semibold text-xs sm:text-sm flex-shrink-0 ${
                      transaction.type === "income" ? "text-income" : "text-expense"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}
                    {formatCurrency(transaction.amount, transaction.currency, false)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
