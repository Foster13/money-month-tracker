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
import { Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";

interface TransactionListProps {
  transactions: Transaction[];
  categories: Category[];
  exchangeRates: Record<Currency, number>;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 10;

export function TransactionList({
  transactions,
  categories,
  exchangeRates,
  onEdit,
  onDelete,
}: TransactionListProps) {
  const [currentPage, setCurrentPage] = useState(1);

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

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No transactions yet. Add your first transaction above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 transition-colors">
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
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
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell
                  className={`text-right font-medium transition-all duration-200 ${
                    transaction.type === "income"
                      ? "text-green-600"
                      : "text-red-600"
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
                      className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between animate-fade-in">
          <div className="text-sm text-muted-foreground">
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
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="transition-all duration-200"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
