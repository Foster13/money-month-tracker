// File: src/components/Dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  const [showChart, setShowChart] = useState(true); // Toggle between chart and column view
  const [activeTab, setActiveTab] = useState("dashboard");
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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-6 sm:space-y-8 animate-fade-in">
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

      <Tabs defaultValue="dashboard" value={activeTab} onValueChange={setActiveTab} className="space-y-6 sm:space-y-8">
        <TabsList className="relative w-full grid grid-cols-3 sm:grid-cols-6 gap-0.5 sm:gap-1 p-1.5 sm:p-2 bg-muted/50 backdrop-blur-sm rounded-lg">
          <TabsTrigger 
            value="dashboard" 
            className="relative text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 data-[state=active]:text-pink-600 transition-colors duration-200"
          >
            <span className="hidden sm:inline">🏠 Home</span>
            <span className="sm:hidden">🏠</span>
          </TabsTrigger>
          <TabsTrigger 
            value="income" 
            className="relative text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 data-[state=active]:text-pink-600 transition-colors duration-200"
          >
            <span className="hidden sm:inline">💰 Income</span>
            <span className="sm:hidden">💰</span>
          </TabsTrigger>
          <TabsTrigger 
            value="expenses" 
            className="relative text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 data-[state=active]:text-pink-600 transition-colors duration-200"
          >
            <span className="hidden sm:inline">💸 Expenses</span>
            <span className="sm:hidden">💸</span>
          </TabsTrigger>
          <TabsTrigger 
            value="budget" 
            className="relative text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 data-[state=active]:text-pink-600 transition-colors duration-200"
          >
            <span className="hidden sm:inline">💝 Budget</span>
            <span className="sm:hidden">💝</span>
          </TabsTrigger>
          <TabsTrigger 
            value="rates" 
            className="relative text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 data-[state=active]:text-pink-600 transition-colors duration-200"
          >
            <span className="hidden sm:inline">💱 Rates</span>
            <span className="sm:hidden">💱</span>
          </TabsTrigger>
          <TabsTrigger 
            value="simulation" 
            className="relative text-[10px] sm:text-xs md:text-sm px-1 sm:px-3 data-[state=active]:text-pink-600 transition-colors duration-200"
          >
            <span className="hidden sm:inline">🎯 Sim</span>
            <span className="sm:hidden">🎯</span>
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="dashboard" className="space-y-5 sm:space-y-6 mt-6 sm:mt-8">
                <Card className="glass-card overflow-hidden">
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

              <Summary transactions={currentMonthTransactions} exchangeRates={exchangeRates} />

          <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-lg sm:text-xl">Income vs Expenses (Last 6 Months)</CardTitle>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowChart(true)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 ${
                    showChart
                      ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Chart
                </button>
                <button
                  onClick={() => setShowChart(false)}
                  className={`px-3 py-1.5 text-xs sm:text-sm rounded-md transition-all duration-200 ${
                    !showChart
                      ? "bg-gradient-to-r from-pink-400 to-rose-400 text-white shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  Table
                </button>
              </div>
            </CardHeader>
            <CardContent className="px-2 sm:px-6">
              {showChart ? (
                <FinanceChart transactions={transactions} exchangeRates={exchangeRates} />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-pink-200">
                        <th className="text-left py-3 px-2 sm:px-4 font-semibold text-pink-700">Month</th>
                        <th className="text-right py-3 px-2 sm:px-4 font-semibold text-pink-600">Income</th>
                        <th className="text-right py-3 px-2 sm:px-4 font-semibold text-rose-600">Expenses</th>
                        <th className="text-right py-3 px-2 sm:px-4 font-semibold text-purple-600">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(() => {
                        const monthlyData: Record<string, { income: number; expenses: number }> = {};
                        // Start from February 2026 and show last 6 months
                        const startDate = new Date(2026, 1, 1); // February 2026 (month is 0-indexed)
                        const now = new Date();
                        
                        // Use the later date between February 2026 and current date
                        const baseDate = startDate > now ? startDate : now;
                        
                        // Initialize last 6 months from base date
                        for (let i = 5; i >= 0; i--) {
                          const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
                          // Only include months from February 2026 onwards
                          if (date >= startDate) {
                            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                            monthlyData[key] = { income: 0, expenses: 0 };
                          }
                        }
                        
                        // Aggregate transactions (only from February 2026 onwards)
                        transactions.forEach((t) => {
                          const date = parseISO(t.date);
                          // Only include transactions from February 2026 onwards
                          if (date >= startDate) {
                            const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                            if (monthlyData[key]) {
                              const amount = t.currency === "IDR" 
                                ? t.amount 
                                : t.amount * (exchangeRates[t.currency] || 1);
                              if (t.type === "income") {
                                monthlyData[key].income += amount;
                              } else {
                                monthlyData[key].expenses += amount;
                              }
                            }
                          }
                        });
                        
                        return Object.entries(monthlyData).map(([key, data], index) => {
                          const [year, month] = key.split('-');
                          const date = new Date(parseInt(year), parseInt(month) - 1);
                          const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                          const balance = data.income - data.expenses;
                          
                          return (
                            <tr 
                              key={key} 
                              className="border-b border-pink-100 hover:bg-pink-50/50 transition-colors"
                              style={{ animationDelay: `${index * 0.05}s` }}
                            >
                              <td className="py-3 px-2 sm:px-4 font-medium">{monthName}</td>
                              <td className="py-3 px-2 sm:px-4 text-right font-semibold text-pink-600">
                                Rp {data.income.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                              <td className="py-3 px-2 sm:px-4 text-right font-semibold text-rose-600">
                                Rp {data.expenses.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                              <td className={`py-3 px-2 sm:px-4 text-right font-bold ${balance >= 0 ? 'text-purple-600' : 'text-rose-600'}`}>
                                Rp {balance.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>
              )}
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
            </motion.div>
          )}

          {activeTab === "income" && (
            <motion.div
              key="income"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="income" className="mt-6 sm:mt-8">
                <IncomeSection
                  transactions={transactions}
                  categories={categories}
                  exchangeRates={exchangeRates}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "expenses" && (
            <motion.div
              key="expenses"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="expenses" className="mt-6 sm:mt-8">
                <ExpensesSection
                  transactions={transactions}
                  categories={categories}
                  exchangeRates={exchangeRates}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "budget" && (
            <motion.div
              key="budget"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="budget" className="mt-6 sm:mt-8">
                <BudgetSection
                  transactions={transactions}
                  categories={categories}
                  exchangeRates={exchangeRates}
                />
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "rates" && (
            <motion.div
              key="rates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="rates" className="space-y-4 sm:space-y-6 mt-6 sm:mt-8">
                <ExchangeRateDisplay
                  exchangeRates={exchangeRates}
                  lastUpdate={lastRateUpdate}
                  onUpdate={updateExchangeRates}
                />
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "simulation" && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="simulation" className="mt-6 sm:mt-8">
                <SimulationMode />
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
