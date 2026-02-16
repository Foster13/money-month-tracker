// File: src/components/TransactionForm.tsx
"use client";

import { useEffect } from "react";
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
    } else {
      form.reset({
        amount: 0,
        currency: "IDR",
        categoryId: "",
        date: format(new Date(), "yyyy-MM-dd"),
        description: "",
        type: "expense",
      });
    }
  }, [editingTransaction, form]);

  const selectedType = form.watch("type");
  const filteredCategories = categories.filter((c) => c.type === selectedType);

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
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
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
