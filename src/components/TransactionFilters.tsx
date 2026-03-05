// File: src/components/TransactionFilters.tsx
"use client";

import { useState } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Search, X, Filter, Calendar, DollarSign, Tag } from "lucide-react";
import { IconRenderer } from "@/components/icons/IconRenderer";

export interface FilterOptions {
  searchQuery: string;
  type: "all" | "income" | "expense";
  categoryIds: string[];
  dateFrom: string;
  dateTo: string;
  amountMin: string;
  amountMax: string;
}

interface TransactionFiltersProps {
  categories: Category[];
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  onReset: () => void;
}

export function TransactionFilters({
  categories,
  filters,
  onFiltersChange,
  onReset,
}: TransactionFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSearchChange = (value: string) => {
    onFiltersChange({ ...filters, searchQuery: value });
  };

  const handleTypeChange = (value: string) => {
    onFiltersChange({ ...filters, type: value as FilterOptions["type"] });
  };

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categoryIds.includes(categoryId)
      ? filters.categoryIds.filter((id) => id !== categoryId)
      : [...filters.categoryIds, categoryId];
    onFiltersChange({ ...filters, categoryIds: newCategories });
  };

  const handleDateFromChange = (value: string) => {
    onFiltersChange({ ...filters, dateFrom: value });
  };

  const handleDateToChange = (value: string) => {
    onFiltersChange({ ...filters, dateTo: value });
  };

  const handleAmountMinChange = (value: string) => {
    onFiltersChange({ ...filters, amountMin: value });
  };

  const handleAmountMaxChange = (value: string) => {
    onFiltersChange({ ...filters, amountMax: value });
  };

  const hasActiveFilters =
    filters.searchQuery ||
    filters.type !== "all" ||
    filters.categoryIds.length > 0 ||
    filters.dateFrom ||
    filters.dateTo ||
    filters.amountMin ||
    filters.amountMax;

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <Card className="glass-subtle">
      <CardContent className="px-4 sm:px-6 py-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Label htmlFor="transaction-search" className="sr-only">
            Search transactions
          </Label>
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
            aria-hidden={true}
          />
          <Input
            id="transaction-search"
            type="text"
            placeholder="Search by description, amount, or category..."
            value={filters.searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10 min-h-[44px]"
            aria-label="Search transactions by description, amount, or category"
          />
          {filters.searchQuery && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 rounded-md"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" aria-hidden={true} />
            </button>
          )}
        </div>

        {/* Quick Filters Row */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex flex-wrap gap-2 items-center w-full sm:w-auto">
            <Label htmlFor="filter-type" className="text-sm font-medium whitespace-nowrap">
              Type:
            </Label>
            <Select value={filters.type} onValueChange={handleTypeChange}>
              <SelectTrigger id="filter-type" className="w-full sm:w-[140px] min-h-[44px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income Only</SelectItem>
                <SelectItem value="expense">Expense Only</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex-1 sm:flex-none min-h-[44px]"
              aria-label={showAdvanced ? "Hide advanced filters" : "Show advanced filters"}
            >
              <Filter className="w-4 h-4 mr-2" aria-hidden={true} />
              {showAdvanced ? "Hide" : "Show"} Filters
              {hasActiveFilters && !showAdvanced && (
                <span className="ml-2 px-2 py-0.5 bg-pink-500 text-white text-xs rounded-full">
                  {[
                    filters.type !== "all",
                    filters.categoryIds.length > 0,
                    filters.dateFrom || filters.dateTo,
                    filters.amountMin || filters.amountMax,
                  ].filter(Boolean).length}
                </span>
              )}
            </Button>
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onReset}
                className="min-h-[44px]"
                aria-label="Clear all filters"
              >
                <X className="w-4 h-4 mr-2" aria-hidden={true} />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="space-y-4 pt-4 border-t animate-fade-in">
            {/* Date Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" aria-hidden={true} />
                Date Range
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="date-from" className="text-xs text-muted-foreground">
                    From
                  </Label>
                  <Input
                    id="date-from"
                    type="date"
                    value={filters.dateFrom}
                    onChange={(e) => handleDateFromChange(e.target.value)}
                    className="min-h-[44px]"
                    aria-label="Filter from date"
                  />
                </div>
                <div>
                  <Label htmlFor="date-to" className="text-xs text-muted-foreground">
                    To
                  </Label>
                  <Input
                    id="date-to"
                    type="date"
                    value={filters.dateTo}
                    onChange={(e) => handleDateToChange(e.target.value)}
                    className="min-h-[44px]"
                    aria-label="Filter to date"
                  />
                </div>
              </div>
            </div>

            {/* Amount Range Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <DollarSign className="w-4 h-4" aria-hidden={true} />
                Amount Range (IDR)
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="amount-min" className="text-xs text-muted-foreground">
                    Minimum
                  </Label>
                  <Input
                    id="amount-min"
                    type="number"
                    placeholder="0"
                    value={filters.amountMin}
                    onChange={(e) => handleAmountMinChange(e.target.value)}
                    className="min-h-[44px]"
                    aria-label="Minimum amount filter"
                  />
                </div>
                <div>
                  <Label htmlFor="amount-max" className="text-xs text-muted-foreground">
                    Maximum
                  </Label>
                  <Input
                    id="amount-max"
                    type="number"
                    placeholder="No limit"
                    value={filters.amountMax}
                    onChange={(e) => handleAmountMaxChange(e.target.value)}
                    className="min-h-[44px]"
                    aria-label="Maximum amount filter"
                  />
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <Label className="text-sm font-medium flex items-center gap-2">
                <Tag className="w-4 h-4" aria-hidden={true} />
                Categories
                {filters.categoryIds.length > 0 && (
                  <span className="text-xs text-muted-foreground">
                    ({filters.categoryIds.length} selected)
                  </span>
                )}
              </Label>

              {/* Income Categories */}
              {incomeCategories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-income font-medium">Income</p>
                  <div className="flex flex-wrap gap-2">
                    {incomeCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 ${
                          filters.categoryIds.includes(category.id)
                            ? "bg-pink-500 text-white shadow-md scale-105"
                            : "bg-background border hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                        }`}
                        aria-label={`${
                          filters.categoryIds.includes(category.id) ? "Deselect" : "Select"
                        } ${category.name} category`}
                        aria-pressed={filters.categoryIds.includes(category.id)}
                      >
                        <IconRenderer
                          name={category.icon || "Circle"}
                          className="w-4 h-4"
                          aria-hidden={true}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                          aria-hidden={true}
                        />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Expense Categories */}
              {expenseCategories.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs text-expense font-medium">Expenses</p>
                  <div className="flex flex-wrap gap-2">
                    {expenseCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryToggle(category.id)}
                        className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm transition-all duration-200 min-h-[44px] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 ${
                          filters.categoryIds.includes(category.id)
                            ? "bg-pink-500 text-white shadow-md scale-105"
                            : "bg-background border hover:border-pink-300 hover:bg-pink-50 dark:hover:bg-pink-900/20"
                        }`}
                        aria-label={`${
                          filters.categoryIds.includes(category.id) ? "Deselect" : "Select"
                        } ${category.name} category`}
                        aria-pressed={filters.categoryIds.includes(category.id)}
                      >
                        <IconRenderer
                          name={category.icon || "Circle"}
                          className="w-4 h-4"
                          aria-hidden={true}
                        />
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                          aria-hidden={true}
                        />
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
