import { useState, useMemo, useCallback } from "react";
import { Transaction, Category, Currency } from "@/types";
import { convertToIDR } from "@/lib/currency";
import { parseISO } from "date-fns";
import { FilterOptions } from "@/components/transactions/TransactionFilters";

export function useTransactionFilters(
  transactions: Transaction[],
  categories: Category[],
  exchangeRates: Record<Currency, number>
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    type: "all",
    categoryIds: [],
    dateFrom: "",
    dateTo: "",
    amountMin: "",
    amountMax: "",
    sortBy: "date",
    sortDir: "desc",
  });

  const handleResetFilters = () => {
    setFilters({
      searchQuery: "",
      type: "all",
      categoryIds: [],
      dateFrom: "",
      dateTo: "",
      amountMin: "",
      amountMax: "",
      sortBy: "date",
      sortDir: "desc",
    });
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const getCategoryName = useCallback(
    (categoryId: string) => {
      const category = categories.find((c) => c.id === categoryId);
      return category?.name || "Unknown";
    },
    [categories]
  );

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((t) => {
        const description = t.description.toLowerCase();
        const amount = t.amount.toString();
        const categoryName = getCategoryName(t.categoryId).toLowerCase();
        return (
          description.includes(query) || amount.includes(query) || categoryName.includes(query)
        );
      });
    }

    if (filters.type !== "all") {
      filtered = filtered.filter((t) => t.type === filters.type);
    }

    if (filters.categoryIds.length > 0) {
      filtered = filtered.filter((t) => filters.categoryIds.includes(t.categoryId));
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter((t) => parseISO(t.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter((t) => parseISO(t.date) <= toDate);
    }

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

    return filtered.sort((a, b) => {
      let diff = 0;

      if (filters.sortBy === "createdAt") {
        // Sort purely by input time
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        diff = timeA - timeB;
      } else {
        // Sort by user selected date
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        diff = dateA - dateB;

        // Fallback to createdAt if date is identical
        if (diff === 0) {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          diff = timeA - timeB;
        }
      }

      // Apply sort direction
      return filters.sortDir === "desc" ? -diff : diff;
    });
  }, [transactions, filters, exchangeRates, getCategoryName]);

  return {
    currentPage,
    setCurrentPage,
    filters,
    handleResetFilters,
    handleFiltersChange,
    filteredAndSortedTransactions,
    getCategoryName,
  };
}
