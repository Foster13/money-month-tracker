// File: src/components/IncomeSection.tsx
"use client";

import { useState } from "react";
import { Transaction, Category, Currency } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { formatCurrency, convertToIDR } from "@/lib/currency";
import { TrendingUp, ArrowUpDown, Calendar, Tag, DollarSign } from "lucide-react";

interface IncomeSectionProps {
  transactions: Transaction[];
  categories: Category[];
  exchangeRates: Record<Currency, number>;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

type SortOption = "date-desc" | "date-asc" | "amount-desc" | "amount-asc" | "category" | "alphabetical";

export function IncomeSection({
  transactions,
  categories,
  exchangeRates,
  onEdit,
  onDelete,
}: IncomeSectionProps) {
  const [sortBy, setSortBy] = useState<SortOption>("date-desc");

  // Filter only income
  const income = transactions.filter((t) => t.type === "income");

  // Sort income
  const sortedIncome = [...income].sort((a, b) => {
    switch (sortBy) {
      case "date-desc":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      case "date-asc":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "amount-desc":
        return convertToIDR(b.amount, b.currency, exchangeRates) - convertToIDR(a.amount, a.currency, exchangeRates);
      case "amount-asc":
        return convertToIDR(a.amount, a.currency, exchangeRates) - convertToIDR(b.amount, b.currency, exchangeRates);
      case "category":
        const catA = categories.find((c) => c.id === a.categoryId)?.name || "";
        const catB = categories.find((c) => c.id === b.categoryId)?.name || "";
        return catA.localeCompare(catB);
      case "alphabetical":
        return a.description.localeCompare(b.description);
      default:
        return 0;
    }
  });

  const getCategoryName = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.color || "#64748b";
  };

  const totalIncome = income.reduce(
    (sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates),
    0
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Stats */}
      <Card className="glass-card overflow-hidden border-pink-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-pink-100 backdrop-blur-sm">
                <TrendingUp className="h-6 w-6 text-pink-500" />
              </div>
              <div>
                <CardTitle className="text-2xl text-pink-700">💰 Income</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {income.length} transactions
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Income</p>
              <p className="text-2xl font-bold text-pink-600">
                Rp {totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sort Controls */}
      <Card className="glass-subtle">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="date-asc">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value="amount-desc">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Highest Amount
                  </div>
                </SelectItem>
                <SelectItem value="amount-asc">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Lowest Amount
                  </div>
                </SelectItem>
                <SelectItem value="category">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    By Category
                  </div>
                </SelectItem>
                <SelectItem value="alphabetical">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" />
                    Alphabetical
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Income List */}
      <div className="space-y-3">
        {sortedIncome.length === 0 ? (
          <Card className="glass-subtle">
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No income yet</p>
            </CardContent>
          </Card>
        ) : (
          sortedIncome.map((transaction, index) => (
            <Card
              key={transaction.id}
              className="glass-subtle hover-lift transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: getCategoryColor(transaction.categoryId) }}
                      />
                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: getCategoryColor(transaction.categoryId) }}
                      >
                        {getCategoryName(transaction.categoryId)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1 truncate">
                      {transaction.description}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {format(parseISO(transaction.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-lg font-bold text-pink-600">
                      {formatCurrency(transaction.amount, transaction.currency, false)}
                    </p>
                    {transaction.currency !== "IDR" && (
                      <p className="text-xs text-muted-foreground">
                        ≈ Rp {convertToIDR(transaction.amount, transaction.currency, exchangeRates).toLocaleString("id-ID")}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
