// File: src/components/Dashboard.tsx
"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import { useTransactionStore } from "@/stores/transactionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FloatingNavbar } from "./FloatingNavbar";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { Summary } from "./Summary";
import { Icon } from "./icons/Icon";
import { ConfirmDialog } from "./ui/confirm-dialog";
import { UndoRedoControls } from "./UndoRedoControls";
import { Transaction } from "@/types";
import { fetchExchangeRates } from "@/lib/currency";
import { useToast } from "@/hooks/use-toast";

// Lazy load komponen yang tidak langsung terlihat
const CategoryManager = dynamic(() => import("./CategoryManager").then(mod => ({ default: mod.CategoryManager })), {
  loading: () => <div className="animate-pulse h-32 bg-muted rounded-lg" />,
});

const DataControls = dynamic(() => import("./DataControls").then(mod => ({ default: mod.DataControls })), {
  loading: () => <div className="animate-pulse h-20 bg-muted rounded-lg" />,
});

const FinanceChart = dynamic(() => import("./FinanceChart").then(mod => ({ default: mod.FinanceChart })), {
  loading: () => <div className="animate-pulse h-64 bg-muted rounded-lg" />,
});

const SimulationMode = dynamic(() => import("./SimulationMode").then(mod => ({ default: mod.SimulationMode })), {
  loading: () => <div className="animate-pulse h-40 bg-muted rounded-lg" />,
});

const ExchangeRateDisplay = dynamic(() => import("./ExchangeRateDisplay").then(mod => ({ default: mod.ExchangeRateDisplay })), {
  loading: () => <div className="animate-pulse h-24 bg-muted rounded-lg" />,
});

const ExpensesSection = dynamic(() => import("./ExpensesSection").then(mod => ({ default: mod.ExpensesSection })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />,
});

const IncomeSection = dynamic(() => import("./IncomeSection").then(mod => ({ default: mod.IncomeSection })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />,
});

const BudgetSection = dynamic(() => import("./BudgetSection").then(mod => ({ default: mod.BudgetSection })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />,
});

const NotesSection = dynamic(() => import("./NotesSection").then(mod => ({ default: mod.NotesSection })), {
  loading: () => <div className="animate-pulse h-96 bg-muted rounded-lg" />,
});

const AnimatedThemeToggle = dynamic(() => import("./AnimatedThemeToggle").then(mod => ({ default: mod.AnimatedThemeToggle })), {
  ssr: false,
  loading: () => <div className="w-10 h-10 bg-muted rounded-full animate-pulse" />,
});
import { startOfMonth, endOfMonth, parseISO } from "date-fns";

interface DashboardProps {
  defaultTab?: string;
}

export function Dashboard({ defaultTab = "dashboard" }: DashboardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  // Update active tab based on pathname
  useEffect(() => {
    const pathToTab: Record<string, string> = {
      "/": "dashboard",
      "/income": "income",
      "/expenses": "expenses",
      "/budget": "budget",
      "/rates": "rates",
      "/simulation": "simulation",
      "/notes": "notes",
    };
    const tab = pathToTab[pathname] || "dashboard";
    setActiveTab(tab);
  }, [pathname]);

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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id: string) => {
    setTransactionToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (transactionToDelete) {
      deleteTransaction(transactionToDelete);
      toast({
        title: "Success",
        description: "Transaction deleted successfully",
      });
      setTransactionToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  const handleImport = (jsonData: string) => {
    try {
      importData(jsonData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden">
      {/* Floating Navbar */}
      <FloatingNavbar
        navItems={[
          { name: "Home", icon: "home", value: "dashboard" },
          { name: "Income", icon: "income", value: "income" },
          { name: "Expenses", icon: "expenses", value: "expenses" },
          { name: "Budget", icon: "budget", value: "budget" },
          { name: "Rates", icon: "rates", value: "rates" },
          { name: "Sim", icon: "simulation", value: "simulation" },
          { name: "Notes", icon: "notes", value: "notes" },
        ]}
        activeTab={activeTab}
        onTabChange={(value) => {
          setActiveTab(value);
          const routes: Record<string, string> = {
            dashboard: "/",
            income: "/income",
            expenses: "/expenses",
            budget: "/budget",
            rates: "/rates",
            simulation: "/simulation",
            notes: "/notes",
          };
          router.push(routes[value] || "/");
        }}
      />

      {/* Header Section - Responsive spacing and layout */}
      <header className="flex flex-col space-y-4 sm:space-y-3 animate-slide-down pt-16 sm:pt-20 md:pt-16">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-3">
          <div className="flex-1 min-w-0 w-full sm:w-auto">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-pink-400 via-pink-500 to-rose-400 bg-clip-text text-transparent flex items-center gap-2">
              <Icon name="heart" size="lg" className="text-pink-500 w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" aria-hidden={true} />
              Personal Finance
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-1 flex items-center gap-1.5">
              <Icon name="sparkles" size="sm" className="text-pink-400 w-3.5 h-3.5 sm:w-4 sm:h-4" aria-hidden={true} />
              Track your income and expenses
            </p>
          </div>
          <div className="w-full sm:w-auto flex justify-end">
            <AnimatedThemeToggle />
          </div>
        </div>
        
        {/* Controls - Responsive layout with proper touch targets */}
        <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-2">
          <UndoRedoControls />
          <CategoryManager
            categories={categories}
            onAddCategory={addCategory}
            onDeleteCategory={deleteCategory}
          />
          <DataControls onExport={exportData} onImport={handleImport} />
        </div>
      </header>

      <Tabs defaultValue="dashboard" value={activeTab} className="mt-6 sm:mt-8">
        <AnimatePresence mode="wait">
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="dashboard" className="mt-0">
                {/* Responsive Layout:
                    - All screen sizes: Single column, vertical stacking
                    - Transaction form at top (primary action area)
                    - Summary statistics below form
                    - Charts/visualizations in middle
                    - Transaction list at bottom
                */}
                <div className="flex flex-col space-y-6 lg:space-y-8">
                  {/* Transaction Form - Primary action area at top */}
                  <section aria-labelledby="transaction-form-heading">
                    <Card className="glass-card overflow-hidden">
                      <CardHeader className="px-4 sm:px-6 py-4">
                        <CardTitle id="transaction-form-heading" className="text-lg sm:text-xl font-semibold">
                          {editingTransaction ? "Edit Transaction" : "Add Transaction"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 sm:px-6 pb-6">
                        <TransactionForm
                          categories={categories}
                          onSubmit={handleSubmit}
                          editingTransaction={editingTransaction}
                          onCancel={() => setEditingTransaction(null)}
                        />
                      </CardContent>
                    </Card>
                  </section>

                  {/* Summary Statistics - Responsive grid layout */}
                  <section aria-labelledby="summary-heading">
                    <h2 id="summary-heading" className="sr-only">Financial Summary</h2>
                    <div className="w-full">
                      <Summary transactions={currentMonthTransactions} exchangeRates={exchangeRates} />
                    </div>
                  </section>

                  {/* Data Visualization - Responsive chart/table with proper touch targets */}
                  <section aria-labelledby="chart-heading">
                    <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
                      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 px-4 sm:px-6 py-4 sm:py-5">
                        <CardTitle id="chart-heading" className="text-base sm:text-lg lg:text-xl font-semibold">
                          Income vs Expenses (Last 6 Months)
                        </CardTitle>
                      <div className="flex gap-2 sm:gap-3">
                        <Button
                          onClick={() => setShowChart(true)}
                          variant={showChart ? "default" : "outline"}
                          size="sm"
                          className={`min-h-[44px] min-w-[80px] px-4 text-sm ${showChart ? "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500" : ""}`}
                        >
                          Chart
                        </Button>
                        <Button
                          onClick={() => setShowChart(false)}
                          variant={!showChart ? "default" : "outline"}
                          size="sm"
                          className={`min-h-[44px] min-w-[80px] px-4 text-sm ${!showChart ? "bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500" : ""}`}
                        >
                          Table
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-6">
                      {showChart ? (
                        <div className="w-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
                          <FinanceChart transactions={transactions} exchangeRates={exchangeRates} />
                        </div>
                      ) : (
                        <div className="w-full overflow-x-auto -mx-4 sm:mx-0">
                          <div className="inline-block min-w-full align-middle px-4 sm:px-0">
                            <table className="w-full text-xs sm:text-sm">
                              <thead>
                                <tr className="border-b border-pink-200">
                                  <th className="text-left py-3 px-2 sm:px-4 font-semibold text-pink-700 whitespace-nowrap">Month</th>
                                  <th className="text-right py-3 px-2 sm:px-4 font-semibold text-income whitespace-nowrap">Income</th>
                                  <th className="text-right py-3 px-2 sm:px-4 font-semibold text-expense whitespace-nowrap">Expenses</th>
                                  <th className="text-right py-3 px-2 sm:px-4 font-semibold text-budget whitespace-nowrap">Balance</th>
                                </tr>
                              </thead>
                            <tbody>
                              {(() => {
                                const monthlyData: Record<string, { income: number; expenses: number }> = {};
                                const startDate = new Date(2026, 1, 1);
                                const now = new Date();
                                const baseDate = startDate > now ? startDate : now;
                                
                                for (let i = 5; i >= 0; i--) {
                                  const date = new Date(baseDate.getFullYear(), baseDate.getMonth() - i, 1);
                                  if (date >= startDate) {
                                    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                                    monthlyData[key] = { income: 0, expenses: 0 };
                                  }
                                }
                                
                                transactions.forEach((t) => {
                                  const date = parseISO(t.date);
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
                                      <td className="py-3 px-2 sm:px-4 font-medium whitespace-nowrap">{monthName}</td>
                                      <td className="py-3 px-2 sm:px-4 text-right font-semibold text-income whitespace-nowrap">
                                        Rp {data.income.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                      </td>
                                      <td className="py-3 px-2 sm:px-4 text-right font-semibold text-expense whitespace-nowrap">
                                        Rp {data.expenses.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                      </td>
                                      <td className={`py-3 px-2 sm:px-4 text-right font-bold whitespace-nowrap ${balance >= 0 ? 'text-budget' : 'text-expense'}`}>
                                        Rp {balance.toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                                      </td>
                                    </tr>
                                  );
                                });
                              })()}
                            </tbody>
                          </table>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                  </section>

                  {/* Recent Transactions - Responsive card with proper spacing */}
                  <section aria-labelledby="transactions-heading">
                    <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
                      <CardHeader className="px-4 sm:px-6 py-4">
                        <CardTitle id="transactions-heading" className="text-lg sm:text-xl font-semibold">Recent Transactions</CardTitle>
                      </CardHeader>
                    <CardContent className="px-4 sm:px-6 pb-6">
                      <TransactionList
                        transactions={transactions}
                        categories={categories}
                        exchangeRates={exchangeRates}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                      />
                    </CardContent>
                  </Card>
                  </section>
                </div>
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
              <TabsContent value="income" className="mt-0">
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
              <TabsContent value="expenses" className="mt-0">
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
              <TabsContent value="budget" className="mt-0">
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
              <TabsContent value="rates" className="mt-0">
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
              <TabsContent value="simulation" className="mt-0">
                <SimulationMode />
              </TabsContent>
            </motion.div>
          )}

          {activeTab === "notes" && (
            <motion.div
              key="notes"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <TabsContent value="notes" className="mt-0">
                <NotesSection />
              </TabsContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Tabs>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        description="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
}
