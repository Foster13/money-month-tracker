// File: src/components/TransactionList.tsx
"use client";

import { useState } from "react";
import { Transaction, Category, Currency } from "@/types";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Trash2, ChevronLeft, ChevronRight, Receipt } from "lucide-react";
import { IconRenderer } from "@/components/icons/IconRenderer";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/ui/empty-state";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  exchangeRates: Record<Currency, number>;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

const ITEMS_PER_PAGE = 10;

export function TransactionList({
  transactions,
  categories,
  exchangeRates,
  onEdit,
  onDelete,
  isLoading = false,
}: TransactionListProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="text-body text-muted-foreground mt-4">Loading transactions...</p>
      </div>
    );
  }

  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const totalPages = Math.ceil(sortedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#64748b";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || "Circle";
  };

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="w-8 h-8 text-pink-500" aria-hidden={true} />}
        title="No transactions yet"
        description="Add your first transaction using the form above to start tracking your finances."
      />
    );
  }

  return (
    <div className="stack-spacing">
      {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 transition-colors">
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Description</TableHead>
              <TableHead className="whitespace-nowrap">Category</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction, index) => (
              <TableRow 
                key={transaction.id}
                className="hover:bg-muted/50 transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <TableCell>
                  {format(parseISO(transaction.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center gap-2 transition-all duration-200"
                    style={{ color: getCategoryColor(transaction.categoryId) }}
                  >
                    <IconRenderer 
                      name={getCategoryIcon(transaction.categoryId)}
                      className="w-4 h-4 flex-shrink-0"
                      aria-hidden={true}
                    />
                    <span
                      className="w-3 h-3 rounded-full transition-transform duration-200 hover:scale-125"
                      style={{
                        backgroundColor: getCategoryColor(
                          transaction.categoryId
                        ),
                      }}
                    />
                    {getCategoryName(transaction.categoryId)}
                  </span>
                </TableCell>
                <TableCell>
                  <span
                    className={`capitalize px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      transaction.type === "income"
                        ? "bg-income text-income border border-income"
                        : "bg-expense text-expense border border-expense"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell
                  className={`text-right font-medium transition-all duration-200 ${
                    transaction.type === "income"
                      ? "text-income"
                      : "text-expense"
                  }`}
                >
                  <div className="flex flex-col items-end">
                    <span>
                      {transaction.type === "income" ? "+" : "-"}
                      {formatCurrency(
                        transaction.amount,
                        transaction.currency,
                        false
                      )}
                    </span>
                    {transaction.currency !== "IDR" && (
                      <span className="text-xs text-muted-foreground">
                        {formatCurrency(
                          transaction.amount,
                          transaction.currency,
                          true,
                          exchangeRates
                        ).split("(")[1]?.replace(")", "")}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(transaction)}
                      className="hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all duration-200"
                      aria-label={`Edit ${transaction.description} transaction`}
                    >
                      <Edit className="h-4 w-4" aria-hidden={true} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                      className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                      aria-label={`Delete ${transaction.description} transaction`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden={true} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden stack-spacing-sm">
        {currentTransactions.map((transaction, index) => (
          <div
            key={transaction.id}
            className="border rounded-lg p-4 stack-spacing-sm hover:bg-muted/50 transition-all duration-200 animate-fade-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{transaction.description}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {format(parseISO(transaction.date), "MMM dd, yyyy")}
                </div>
              </div>
              <span
                className={`capitalize px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  transaction.type === "income"
                    ? "bg-income text-income border border-income"
                    : "bg-expense text-expense border border-expense"
                }`}
              >
                {transaction.type}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <IconRenderer 
                name={getCategoryIcon(transaction.categoryId)}
                className="w-4 h-4 flex-shrink-0"
                style={{ color: getCategoryColor(transaction.categoryId) }}
                aria-hidden={true}
              />
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: getCategoryColor(transaction.categoryId),
                }}
              />
              <span
                className="text-sm truncate"
                style={{ color: getCategoryColor(transaction.categoryId) }}
              >
                {getCategoryName(transaction.categoryId)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2">
              <div
                className={`font-bold text-base ${
                  transaction.type === "income"
                    ? "text-income"
                    : "text-expense"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(
                  transaction.amount,
                  transaction.currency,
                  false
                )}
                {transaction.currency !== "IDR" && (
                  <div className="text-xs text-muted-foreground font-normal mt-1">
                    {formatCurrency(
                      transaction.amount,
                      transaction.currency,
                      true,
                      exchangeRates
                    ).split("(")[1]?.replace(")", "")}
                  </div>
                )}
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(transaction)}
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  aria-label={`Edit ${transaction.description} transaction`}
                >
                  <Edit className="h-4 w-4" aria-hidden={true} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(transaction.id)}
                  className="hover:bg-red-100 dark:hover:bg-red-900/30"
                  aria-label={`Delete ${transaction.description} transaction`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden={true} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="text-caption text-muted-foreground text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)}{" "}
            of {transactions.length} transactions
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="transition-all duration-200"
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden={true} />
              <span className="hidden sm:inline ml-1">Previous</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="transition-all duration-200"
              aria-label="Go to next page"
            >
              <span className="hidden sm:inline mr-1">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden={true} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
