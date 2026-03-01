// File: src/components/IncomeSection.tsx
"use client";

import { useState } from "react";
import { Transaction, Category, Currency } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, parseISO } from "date-fns";
import { formatCurrency, convertToIDR } from "@/lib/currency";
import { TrendingUp, ArrowUpDown, Calendar, Tag, DollarSign } from "lucide-react";
import { Icon } from "./icons/Icon";
import { IconRenderer } from "./icons/IconRenderer";

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

  const getCategoryIcon = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId)?.icon || "Circle";
  };

  const totalIncome = income.reduce(
    (sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates),
    0
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden">
      {/* Header with Stats - Responsive spacing and layout */}
      <Card className="glass-card overflow-hidden border-income mb-6">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 sm:p-3 rounded-full bg-income backdrop-blur-sm flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-income" aria-hidden={true} />
              </div>
              <div className="min-w-0">
                <CardTitle className="text-lg sm:text-xl lg:text-2xl text-income truncate flex items-center gap-2">
                  <Icon name="income" size="lg" className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden={true} />
                  Income
                </CardTitle>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  {income.length} transactions
                </p>
              </div>
            </div>
            <div className="text-left sm:text-right">
              <p className="text-xs sm:text-sm text-muted-foreground">Total Income</p>
              <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-income break-words">
                Rp {totalIncome.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Sort Controls - Responsive with proper touch targets */}
      <Card className="glass-subtle mb-6">
        <CardContent className="px-4 sm:px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center justify-between">
            <div className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4 text-muted-foreground flex-shrink-0" aria-hidden={true} />
              <span className="text-sm font-medium">Sort by:</span>
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
              <SelectTrigger className="w-full sm:w-[200px] min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden={true} />
                    Newest First
                  </div>
                </SelectItem>
                <SelectItem value="date-asc">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" aria-hidden={true} />
                    Oldest First
                  </div>
                </SelectItem>
                <SelectItem value="amount-desc">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" aria-hidden={true} />
                    Highest Amount
                  </div>
                </SelectItem>
                <SelectItem value="amount-asc">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" aria-hidden={true} />
                    Lowest Amount
                  </div>
                </SelectItem>
                <SelectItem value="category">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4" aria-hidden={true} />
                    By Category
                  </div>
                </SelectItem>
                <SelectItem value="alphabetical">
                  <div className="flex items-center gap-2">
                    <ArrowUpDown className="h-4 w-4" aria-hidden={true} />
                    Alphabetical
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Income List - Responsive grid: 1 col mobile, 2 cols tablet+ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {sortedIncome.length === 0 ? (
          <Card className="glass-subtle md:col-span-2">
            <CardContent className="py-12 text-center">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base text-muted-foreground">No income yet</p>
            </CardContent>
          </Card>
        ) : (
          sortedIncome.map((transaction, index) => (
            <Card
              key={transaction.id}
              className="glass-subtle hover-lift transition-all duration-200 animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <IconRenderer 
                        name={getCategoryIcon(transaction.categoryId)}
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: getCategoryColor(transaction.categoryId) }}
                        aria-hidden={true}
                      />
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
                    <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 truncate">
                      {transaction.description}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {format(parseISO(transaction.date), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-base sm:text-lg font-bold text-income">
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
