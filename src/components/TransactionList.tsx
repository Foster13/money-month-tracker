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
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  {format(parseISO(transaction.date), "MMM dd, yyyy")}
                </TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <span
                    className="inline-flex items-center gap-2"
                    style={{ color: getCategoryColor(transaction.categoryId) }}
                  >
                    <span
                      className="w-3 h-3 rounded-full"
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
                    className={`capitalize ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </TableCell>
                <TableCell
                  className={`text-right font-medium ${
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
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(transaction.id)}
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
        <div className="flex items-center justify-between">
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
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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
