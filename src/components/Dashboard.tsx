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
import { ExpensesSection } from "./ExpensesSection";
import { IncomeSection } from "./IncomeSection";
import { BudgetSection } from "./BudgetSection";
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-5 sm:space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:gap-4 animate-slide-down">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 bg-clip-text text-transparent">
              💖 Personal Finance
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              ✨ Track your income and expenses
            </p>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex flex-wrap gap-2">
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
          <DataControls onExport={exportData} onImport={handleImport} />
        </div>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-5 sm:space-y-6 mt-6 sm:mt-8">
        <TabsList className="transition-all duration-200 w-full grid grid-cols-3 sm:grid-cols-6 gap-0.5 sm:gap-1 p-1">
          <TabsTrigger value="dashboard" className="transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-1 sm:px-3">
            <span className="hidden sm:inline">🏠 Home</span>
            <span className="sm:hidden">🏠</span>
          </TabsTrigger>
          <TabsTrigger value="income" className="transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-1 sm:px-3">
            <span className="hidden sm:inline">💰 Income</span>
            <span className="sm:hidden">💰</span>
          </TabsTrigger>
          <TabsTrigger value="expenses" className="transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-1 sm:px-3">
            <span className="hidden sm:inline">💸 Expenses</span>
            <span className="sm:hidden">💸</span>
          </TabsTrigger>
          <TabsTrigger value="budget" className="transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-1 sm:px-3">
            <span className="hidden sm:inline">💝 Budget</span>
            <span className="sm:hidden">💝</span>
          </TabsTrigger>
          <TabsTrigger value="rates" className="transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-1 sm:px-3">
            <span className="hidden sm:inline">💱 Rates</span>
            <span className="sm:hidden">💱</span>
          </TabsTrigger>
          <TabsTrigger value="simulation" className="transition-all duration-200 text-[10px] sm:text-xs md:text-sm px-1 sm:px-3">
            <span className="hidden sm:inline">🎯 Sim</span>
            <span className="sm:hidden">🎯</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-4 sm:space-y-6 animate-slide-up">
          <Summary transactions={currentMonthTransactions} exchangeRates={exchangeRates} />

          <Card className="glass-card animate-scale-in overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">Income vs Expenses (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              <FinanceChart transactions={transactions} exchangeRates={exchangeRates} />
            </CardContent>
          </Card>

          <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl">
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
              <CardTitle className="text-lg sm:text-xl">Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
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

        <TabsContent value="income" className="animate-slide-up">
          <IncomeSection
            transactions={transactions}
            categories={categories}
            exchangeRates={exchangeRates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="expenses" className="animate-slide-up">
          <ExpensesSection
            transactions={transactions}
            categories={categories}
            exchangeRates={exchangeRates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </TabsContent>

        <TabsContent value="budget" className="animate-slide-up">
          <BudgetSection
            transactions={transactions}
            categories={categories}
            exchangeRates={exchangeRates}
          />
        </TabsContent>

        <TabsContent value="rates" className="space-y-4 sm:space-y-6 animate-slide-up">
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
