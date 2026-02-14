// File: src/components/Dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useTransactionStore } from "@/stores/transactionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { Summary } from "./Summary";
import { CategoryManager } from "./CategoryManager";
import { DataControls } from "./DataControls";
import { FinanceChart } from "./FinanceChart";
import { SimulationMode } from "./SimulationMode";
import { ExchangeRateDisplay } from "./ExchangeRateDisplay";
import { ThemeToggle } from "./theme-toggle";
import { Transaction } from "@/types";
import { fetchExchangeRates } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";
import { startOfMonth, endOfMonth, parseISO } from "date-fns";

export function Dashboard() {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useTransactionStore((state) => state.categories);
  const exchangeRates = useTransactionStore((state) => state.exchangeRates);
  const lastRateUpdate = useTransactionStore((state) => state.lastRateUpdate);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);
  const addCategory = useTransactionStore((state) => state.addCategory);
  const deleteCategory = useTransactionStore((state) => state.deleteCategory);
  const updateExchangeRates = useTransactionStore((state) => state.updateExchangeRates);
  const exportData = useTransactionStore((state) => state.exportData);
  const importData = useTransactionStore((state) => state.importData);

  // Fetch exchange rates on mount if not updated recently
  useEffect(() => {
    const fetchRates = async () => {
      if (!lastRateUpdate) {
        try {
          const rates = await fetchExchangeRates();
          updateExchangeRates(rates);
        } catch (error) {
          console.error("Failed to fetch initial exchange rates:", error);
        }
      }
    };
    fetchRates();
  }, [lastRateUpdate, updateExchangeRates]);

  // Filter transactions for current month
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });

  const handleSubmit = (data: any) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
      toast({
        title: "Success",
        description: "Transaction updated successfully",
      });
    } else {
      addTransaction(data);
      toast({
        title: "Success",
        description: "Transaction added successfully",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      deleteTransaction(id);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
    }
  };

  const handleImport = (jsonData: string) => {
    try {
      importData(jsonData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-down">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Personal Finance Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your income and expenses in multiple currencies
          </p>
        </div>
        <div className="flex gap-2">
          <ThemeToggle />
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
          <DataControls onExport={exportData} onImport={handleImport} />
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="transition-all duration-200">
          <TabsTrigger value="dashboard" className="transition-all duration-200">Dashboard</TabsTrigger>
          <TabsTrigger value="rates" className="transition-all duration-200">Exchange Rates</TabsTrigger>
          <TabsTrigger value="simulation" className="transition-all duration-200">Simulation</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 animate-slide-up">
          <Summary transactions={currentMonthTransactions} exchangeRates={exchangeRates} />

          <Card className="glass-card animate-scale-in overflow-hidden">
            <CardHeader>
              <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent>
              <FinanceChart transactions={transactions} exchangeRates={exchangeRates} />
            </CardContent>
          </Card>

          <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle>
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionForm
                categories={categories}
                onSubmit={handleSubmit}
                editingTransaction={editingTransaction}
                onCancel={() => setEditingTransaction(null)}
              />
            </CardContent>
          </Card>

          <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <TransactionList
                transactions={transactions}
                categories={categories}
                exchangeRates={exchangeRates}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rates" className="space-y-6 animate-slide-up">
          <ExchangeRateDisplay
            exchangeRates={exchangeRates}
            lastUpdate={lastRateUpdate}
            onUpdate={updateExchangeRates}
          />
        </TabsContent>

        <TabsContent value="simulation" className="animate-slide-up">
          <SimulationMode />
        </TabsContent>
      </Tabs>
    </div>
  );
}
