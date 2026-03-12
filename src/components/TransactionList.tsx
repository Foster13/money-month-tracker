// File: src/components/TransactionList.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { Transaction, Category, Currency } from "@/types";
import { format, parseISO } from "date-fns";
import { formatCurrency, convertToIDR } from "@/lib/currency";
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
import { TransactionFilters, FilterOptions } from "./TransactionFilters";
import { useTransactionStore } from "@/stores/transactionStore";
import { Checkbox } from "@/components/ui/checkbox";
import { BulkActionsToolbar } from "@/components/BulkActionsToolbar";
import { BulkDeleteDialog } from "@/components/BulkDeleteDialog";
import { BulkCategoryDialog } from "@/components/BulkCategoryDialog";
import { BulkExportDialog } from "@/components/BulkExportDialog";
import { useToast } from "@/hooks/use-toast";

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
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    type: "all",
    categoryIds: [],
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
  });

  // Get selection state and methods from store
  const selectedTransactionIds = useTransactionStore((state) => state.selectedTransactionIds);
  const toggleTransaction = useTransactionStore((state) => state.toggleTransaction);
  const selectAll = useTransactionStore((state) => state.selectAll);
  const clearSelection = useTransactionStore((state) => state.clearSelection);
  const bulkDelete = useTransactionStore((state) => state.bulkDelete);
  const bulkUpdateCategory = useTransactionStore((state) => state.bulkUpdateCategory);
  const bulkExport = useTransactionStore((state) => state.bulkExport);

  // Dialog state management
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const { toast } = useToast();

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      type: "all",
      categoryIds: [],
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
    });
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  // Helper functions with useCallback for better performance
  const getCategoryName = useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      return category?.name || "Unknown";
    },
    [categories]
  );

  const getCategoryColor = useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      return category?.color || "#64748b";
    },
    [categories]
  );

  const getCategoryIcon = useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      return category?.icon || "Circle";
    },
    [categories]
  );

  // Filter and sort transactions
  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    // Apply search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((t) => {
        const description = t.description.toLowerCase();
        const amount = t.amount.toString();
        const categoryName = getCategoryName(t.categoryId).toLowerCase();
        return (
          description.includes(query) ||
          amount.includes(query) ||
          categoryName.includes(query)
        );
      });
    }

    // Apply type filter
    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    // Apply category filter
    if (filters.categoryIds.length > 0) {
      filtered = filtered.filter((t) =>
        filters.categoryIds.includes(t.categoryId)
      );
    }

    // Apply date range filter
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((t) => parseISO(t.date) >= fromDate);
    }
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999); // Include the entire day
      filtered = filtered.filter((t) => parseISO(t.date) <= toDate);
    }

    // Apply amount range filter
    if (filters.amountMin) {
      const minAmount = parseFloat(filters.amountMin);
      filtered = filtered.filter((t) => {
        const amountInIDR = convertToIDR(t.amount, t.currency, exchangeRates);
        return amountInIDR >= minAmount;
      });
    }
    if (filters.amountMax) {
      const maxAmount = parseFloat(filters.amountMax);
      filtered = filtered.filter((t) => {
        const amountInIDR = convertToIDR(t.amount, t.currency, exchangeRates);
        return amountInIDR <= maxAmount;
      });
    }

    // Sort by date (newest first), then by creation time (ID) for same dates
    return filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();

      if (dateB !== dateA) {
        return dateB - dateA;
      }

      const timestampA = parseInt(a.id.split("-")[0]) || 0;
      const timestampB = parseInt(b.id.split("-")[0]) || 0;

      return timestampB - timestampA;
    });
  }, [transactions, filters, exchangeRates, getCategoryName]);

  const totalPages = Math.ceil(filteredAndSortedTransactions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTransactions = filteredAndSortedTransactions.slice(startIndex, endIndex);

  // Calculate "Select All" checkbox state
  // Use ALL filtered transactions, not just current page
  const filteredTransactionIds = filteredAndSortedTransactions.map((t) => t.id);
  const selectedFilteredCount = filteredTransactionIds.filter((id) => 
    selectedTransactionIds.has(id)
  ).length;
  
  const isAllSelected = filteredTransactionIds.length > 0 && 
    selectedFilteredCount === filteredTransactionIds.length;
  const isIndeterminate = selectedFilteredCount > 0 && 
    selectedFilteredCount < filteredTransactionIds.length;

  // Handle "Select All" checkbox
  const handleSelectAll = () => {
    if (isAllSelected) {
      clearSelection();
    } else {
      // Select all filtered transactions, not just current page
      selectAll(filteredTransactionIds);
    }
  };

  // Bulk operation handlers
  const handleBulkDelete = () => {
    setDeleteDialogOpen(true);
  };

  const handleBulkDeleteConfirm = () => {
    const selectedIds = Array.from(selectedTransactionIds);
    bulkDelete(selectedIds);
    setDeleteDialogOpen(false);
    
    toast({
      title: "Transactions deleted",
      description: `Successfully deleted ${selectedIds.length} ${selectedIds.length === 1 ? 'transaction' : 'transactions'}.`,
    });
  };

  const handleBulkCategoryChange = () => {
    setCategoryDialogOpen(true);
  };

  const handleBulkCategoryConfirm = (categoryId: string) => {
    const selectedIds = Array.from(selectedTransactionIds);
    
    try {
      bulkUpdateCategory(selectedIds, categoryId);
      setCategoryDialogOpen(false);
      
      const categoryName = categories.find((c) => c.id === categoryId)?.name || "Unknown";
      toast({
        title: "Category updated",
        description: `Successfully updated ${selectedIds.length} ${selectedIds.length === 1 ? 'transaction' : 'transactions'} to ${categoryName}.`,
      });
    } catch (error) {
      setCategoryDialogOpen(false);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update category",
        variant: "destructive",
      });
    }
  };

  const handleBulkExport = () => {
    setExportDialogOpen(true);
  };

  const handleBulkExportConfirm = (format: 'json' | 'csv') => {
    const selectedIds = Array.from(selectedTransactionIds);
    
    try {
      const exportData = bulkExport(selectedIds, format);
      
      // Trigger browser download
      const blob = new Blob([exportData], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `transactions-export-${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportDialogOpen(false);
      
      toast({
        title: "Export successful",
        description: `Successfully exported ${selectedIds.length} ${selectedIds.length === 1 ? 'transaction' : 'transactions'} as ${format.toUpperCase()}.`,
      });
    } catch (error) {
      setExportDialogOpen(false);
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to generate export file",
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <LoadingSpinner size="lg" variant="primary" />
        <p className="text-body text-muted-foreground mt-4">Loading transactions...</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon={<Receipt className="w-8 h-8 text-pink-500" aria-hidden={true} />}
        title="No transactions yet"
        description="Add your first transaction using the form above to start tracking your finances."
      />
    );
  }

  const hasNoResults = filteredAndSortedTransactions.length === 0;

  return (
    <div className="stack-spacing">
      {/* Filters */}
      <TransactionFilters
        categories={categories}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onReset={handleResetFilters}
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        selectedCount={selectedFilteredCount}
        onBulkDelete={handleBulkDelete}
        onBulkCategoryChange={handleBulkCategoryChange}
        onBulkExport={handleBulkExport}
        onClearSelection={clearSelection}
      />

      {/* Bulk Delete Dialog */}
      <BulkDeleteDialog
        open={deleteDialogOpen}
        count={selectedFilteredCount}
        onConfirm={handleBulkDeleteConfirm}
        onCancel={() => setDeleteDialogOpen(false)}
      />

      {/* Bulk Category Dialog */}
      <BulkCategoryDialog
        open={categoryDialogOpen}
        count={selectedFilteredCount}
        categories={categories}
        onConfirm={handleBulkCategoryConfirm}
        onCancel={() => setCategoryDialogOpen(false)}
      />

      {/* Bulk Export Dialog */}
      <BulkExportDialog
        open={exportDialogOpen}
        count={selectedFilteredCount}
        onConfirm={handleBulkExportConfirm}
        onCancel={() => setExportDialogOpen(false)}
      />

      {/* No Results State */}
      {hasNoResults ? (
        <EmptyState
          icon={<Receipt className="w-8 h-8 text-pink-500" aria-hidden={true} />}
          title="No transactions found"
          description="Try adjusting your filters or search query to find what you're looking for."
          action={
            <Button onClick={handleResetFilters} variant="outline">
              Clear Filters
            </Button>
          }
        />
      ) : (
        <>
          {/* Desktop Table View */}
      <div className="hidden md:block rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-muted/50 transition-colors">
              <TableHead className="w-12">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all transactions"
                />
              </TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Description</TableHead>
              <TableHead className="whitespace-nowrap">Category</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="text-right whitespace-nowrap">Amount</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTransactions.map((transaction, index) => {
              const isSelected = selectedTransactionIds.has(transaction.id);
              return (
                <TableRow 
                  key={transaction.id}
                  className={`hover:bg-muted/50 transition-all duration-200 animate-fade-in ${
                    isSelected ? "bg-muted/70" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TableCell>
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleTransaction(transaction.id)}
                      aria-label={`Select ${transaction.description} transaction`}
                    />
                  </TableCell>
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
            );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden stack-spacing-sm">
        {currentTransactions.map((transaction, index) => {
          const isSelected = selectedTransactionIds.has(transaction.id);
          return (
            <div
              key={transaction.id}
              className={`border rounded-lg p-4 stack-spacing-sm hover:bg-muted/50 transition-all duration-200 animate-fade-in ${
                isSelected ? "bg-muted/70" : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={() => toggleTransaction(transaction.id)}
                  aria-label={`Select ${transaction.description} transaction`}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0 stack-spacing-sm">
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
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 animate-fade-in">
          <div className="text-caption text-muted-foreground text-center sm:text-left">
            Showing {startIndex + 1} to {Math.min(endIndex, filteredAndSortedTransactions.length)}{" "}
            of {filteredAndSortedTransactions.length} transactions
            {filteredAndSortedTransactions.length !== transactions.length && (
              <span className="text-pink-500">
                {" "}(filtered from {transactions.length})
              </span>
            )}
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
        </>
      )}
    </div>
  );
}
