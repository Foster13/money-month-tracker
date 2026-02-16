// File: src/components/TransactionForm.tsx
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { transactionSchema, TransactionFormData } from "@/lib/schemas";
import { Category, Transaction, Currency } from "@/types";
import { CURRENCIES } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface TransactionFormProps {
  categories: Category[];
  onSubmit: (data: TransactionFormData) => void;
  editingTransaction?: Transaction | null;
  onCancel?: () => void;
}

export function TransactionForm({
  categories,
  onSubmit,
  editingTransaction,
  onCancel,
}: TransactionFormProps) {
  const [displayValue, setDisplayValue] = useState<string>('');
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const form = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      amount: 0,
      currency: "IDR",
      categoryId: "",
      date: format(new Date(), "yyyy-MM-dd"),
      description: "",
      type: "expense",
    },
  });

  // Update form when editingTransaction changes
  useEffect(() => {
    if (editingTransaction) {
      form.reset({
        amount: editingTransaction.amount,
        currency: editingTransaction.currency || "IDR",
        categoryId: editingTransaction.categoryId,
        date: editingTransaction.date,
        description: editingTransaction.description,
        type: editingTransaction.type,
      });
      setDisplayValue(editingTransaction.amount.toString());
    } else {
      form.reset({
        amount: 0,
        currency: "IDR",
        categoryId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        description: "",
        type: "expense",
      });
      setDisplayValue('');
    }
  }, [editingTransaction, form]);

  const selectedType = form.watch("type");
  const selectedCurrency = form.watch("currency");
  const amount = form.watch("amount");
  const filteredCategories = categories.filter((c) => c.type === selectedType);
  
  // Get currency symbol for the selected currency
  const currencySymbol = CURRENCIES[selectedCurrency as Currency]?.symbol || "Rp";

  // Currency formatting helper - only used when not focused
  const formatCurrencyDisplay = (value: number, currency: string): string => {
    if (!value && value !== 0) return '';
    
    switch (currency) {
      case 'IDR':
        // Indonesian Rupiah: period for thousands, no decimals
        return Math.round(value).toLocaleString('id-ID');
      
      case 'EUR':
        // Euro: period for thousands, comma for decimals
        const eurParts = value.toFixed(2).split('.');
        const eurInteger = eurParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        return `${eurInteger},${eurParts[1]}`;
      
      case 'JPY':
        // Japanese Yen: comma for thousands, no decimals
        return Math.round(value).toLocaleString('en-US');
      
      case 'USD':
      case 'SGD':
      case 'AUD':
      case 'GBP':
      case 'CNY':
      default:
        // US/UK/Asian format: comma for thousands, period for decimals
        return value.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
    }
  };

  // Parse input to number
  const parseInputToNumber = (input: string, currency: string): number => {
    if (!input || input === '') return 0;
    
    let rawValue = input;
    
    if (currency === 'IDR') {
      // Remove periods (thousand separator), keep only digits
      rawValue = rawValue.replace(/\./g, '').replace(/[^\d]/g, '');
    } else if (currency === 'EUR') {
      // Remove periods (thousand separator), replace comma with dot for decimal
      rawValue = rawValue.replace(/\./g, '').replace(',', '.');
      rawValue = rawValue.replace(/[^\d.]/g, '');
    } else {
      // Remove commas (thousand separator), keep period for decimal
      rawValue = rawValue.replace(/,/g, '').replace(/[^\d.]/g, '');
    }
    
    // Ensure only one decimal point
    const parts = rawValue.split('.');
    if (parts.length > 2) {
      rawValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    return parseFloat(rawValue) || 0;
  };

  // Update display value when amount or currency changes (but not when focused)
  useEffect(() => {
    if (!isFocused && amount !== undefined) {
      if (amount === 0) {
        setDisplayValue('');
      } else {
        setDisplayValue(formatCurrencyDisplay(amount, selectedCurrency));
      }
    }
  }, [amount, selectedCurrency, isFocused]);

  const handleSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    if (!editingTransaction) {
      form.reset({
        amount: 0,
        currency: "IDR",
        categoryId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        description: "",
        type: "expense",
      });
      setDisplayValue('');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 animate-fade-in">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Income</SelectItem>
                  <SelectItem value="expense">Expense</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium z-10">
                      {currencySymbol}
                    </span>
                    <Input
                      type="text"
                      placeholder="0"
                      className="pl-12"
                      value={displayValue}
                      onFocus={(e) => {
                        setIsFocused(true);
                        // Convert formatted value back to raw input
                        if (field.value && field.value !== 0) {
                          const rawValue = field.value.toString();
                          // For EUR, show with comma as decimal separator
                          if (selectedCurrency === 'EUR') {
                            setDisplayValue(rawValue.replace('.', ','));
                          } else if (selectedCurrency === 'IDR') {
                            // For IDR, show with period separators while editing
                            setDisplayValue(Math.round(field.value).toLocaleString('id-ID'));
                          } else {
                            setDisplayValue(rawValue);
                          }
                        } else {
                          setDisplayValue('');
                        }
                        // Select all text on focus for easy replacement
                        e.target.select();
                      }}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        
                        // Validate input based on currency
                        let isValid = false;
                        let processedValue = inputValue;
                        
                        if (selectedCurrency === 'IDR') {
                          // Allow digits and periods for IDR
                          isValid = /^[\d.]*$/.test(inputValue);
                          if (isValid) {
                            // Remove all periods to get raw number
                            const rawNumber = inputValue.replace(/\./g, '');
                            // Format with periods as thousand separators
                            if (rawNumber) {
                              processedValue = parseInt(rawNumber).toLocaleString('id-ID');
                            } else {
                              processedValue = '';
                            }
                          }
                        } else if (selectedCurrency === 'JPY') {
                          // Only digits allowed (no decimals)
                          isValid = /^[\d]*$/.test(inputValue);
                          processedValue = inputValue;
                        } else if (selectedCurrency === 'EUR') {
                          // Digits, periods (thousands), and comma (decimal)
                          isValid = /^[\d.,]*$/.test(inputValue);
                          processedValue = inputValue;
                        } else {
                          // Digits, commas (thousands), and period (decimal)
                          isValid = /^[\d,.]*$/.test(inputValue);
                          processedValue = inputValue;
                        }
                        
                        if (isValid || inputValue === '') {
                          setDisplayValue(processedValue);
                          const numValue = parseInputToNumber(inputValue, selectedCurrency);
                          field.onChange(numValue);
                        }
                      }}
                      onBlur={() => {
                        setIsFocused(false);
                        // Format the value when losing focus
                        if (field.value && field.value !== 0) {
                          setDisplayValue(formatCurrencyDisplay(field.value, selectedCurrency));
                        } else {
                          setDisplayValue('');
                        }
                        field.onBlur();
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(CURRENCIES).map(([code, info]) => (
                      <SelectItem key={code} value={code}>
                        {info.symbol} {code} - {info.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {filteredCategories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Enter description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col sm:flex-row gap-2 animate-slide-up">
          <Button type="submit" className="flex-1 transition-all duration-200 hover:scale-105 active:scale-95">
            {editingTransaction ? "Update" : "Add"} Transaction
          </Button>
          {editingTransaction && onCancel && (
            <Button type="button" variant="outline" onClick={onCancel} className="transition-all duration-200 hover:scale-105 active:scale-95 sm:flex-initial">
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
