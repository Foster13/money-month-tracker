"use client";

import { useState } from "react";
import { useTransactionStore } from "@/stores/transactionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { TransactionList } from "@/components/transactions/TransactionList";
import { Summary } from "@/components/dashboard/Summary";
import { FinanceChart } from "@/components/dashboard/FinanceChart";
import { Icon } from "@/components/icons/Icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PageHeader } from "@/components/layout/PageHeader";
import { useToast } from "@/hooks/use-toast";
import { calculateLastSixMonthsData } from "@/lib/calculations";
import { startOfMonth, endOfMonth, parseISO, subMonths } from "date-fns";
import { Transaction } from "@/types";

export default function DashboardPage() {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showChart, setShowChart] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  const { toast } = useToast();

  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useTransactionStore((state) => state.categories);
  const exchangeRates = useTransactionStore((state) => state.exchangeRates);
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const updateTransaction = useTransactionStore((state) => state.updateTransaction);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const currentMonthTransactions = transactions.filter((t) => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= monthStart && transactionDate <= monthEnd;
  });

  const lastMonthStart = startOfMonth(subMonths(now, 1));
  const lastMonthEnd = endOfMonth(subMonths(now, 1));

  const lastMonthTransactions = transactions.filter((t) => {
    const transactionDate = parseISO(t.date);
    return transactionDate >= lastMonthStart && transactionDate <= lastMonthEnd;
  });

  const handleSubmit = (data: any) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
      toast({ title: "Success", description: "Transaction updated successfully" });
    } else {
      addTransaction(data);
      toast({ title: "Success", description: "Transaction added successfully" });
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
      toast({ title: "Success", description: "Transaction deleted successfully" });
      setTransactionToDelete(null);
    }
    setDeleteConfirmOpen(false);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden">
      <PageHeader />

      <div className="flex flex-col space-y-6 lg:space-y-8">
        <section aria-labelledby="summary-heading">
          <h2 id="summary-heading" className="sr-only">
            Financial Summary
          </h2>
          <div className="w-full">
            <Summary
              transactions={currentMonthTransactions}
              exchangeRates={exchangeRates}
              lastMonthTransactions={lastMonthTransactions}
            />
          </div>
        </section>

        <section
          aria-labelledby="transaction-form-heading"
          className="animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <Card className="glass-card overflow-hidden">
            <CardHeader className="px-4 sm:px-6 py-4 flex flex-row items-center justify-between">
              <CardTitle id="transaction-form-heading" className="text-lg sm:text-xl font-semibold">
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-6">
              <TransactionForm
                categories={categories}
                onSubmit={(data) => {
                  handleSubmit(data);
                }}
                editingTransaction={editingTransaction}
                onCancel={() => {
                  setEditingTransaction(null);
                }}
              />
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="transactions-heading">
          <Card
            className="glass-card animate-scale-in overflow-hidden"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="px-4 sm:px-6 py-4">
              <CardTitle id="transactions-heading" className="text-lg sm:text-xl font-semibold">
                Recent Transactions
              </CardTitle>
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

        <section aria-labelledby="chart-heading">
          <Card
            className="glass-card animate-scale-in overflow-hidden"
            style={{ animationDelay: "0.1s" }}
          >
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 px-4 sm:px-6 py-4 sm:py-5">
              <CardTitle
                id="chart-heading"
                className="text-base sm:text-lg lg:text-xl font-semibold"
              >
                Income vs Expenses (Last 6 Months)
              </CardTitle>
              <div className="flex gap-2 sm:gap-3">
                <Button
                  variant={showChart ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowChart(true)}
                  className={`min-h-[44px] min-w-[80px] px-4 text-sm ${showChart ? "bg-primary text-primary-foreground shadow-sm" : ""}`}
                >
                  Chart
                </Button>
                <Button
                  variant={!showChart ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowChart(false)}
                  className={`min-h-[44px] min-w-[80px] px-4 text-sm ${!showChart ? "bg-primary text-primary-foreground shadow-sm" : ""}`}
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
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-2 sm:px-4 font-medium text-muted-foreground whitespace-nowrap">
                            Month
                          </th>
                          <th className="text-right py-3 px-2 sm:px-4 font-semibold text-income whitespace-nowrap">
                            Income
                          </th>
                          <th className="text-right py-3 px-2 sm:px-4 font-semibold text-expense whitespace-nowrap">
                            Expenses
                          </th>
                          <th className="text-right py-3 px-2 sm:px-4 font-semibold text-budget whitespace-nowrap">
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {(() => {
                          const monthlyData = calculateLastSixMonthsData(
                            transactions,
                            exchangeRates
                          );
                          return Object.entries(monthlyData).map(([key, data], index) => {
                            const balance = data.income - data.expenses;
                            return (
                              <tr
                                key={key}
                                className="border-b border-border hover:bg-muted/30 transition-colors"
                                style={{ animationDelay: `${index * 0.05}s` }}
                              >
                                <td className="py-3 px-2 sm:px-4 font-medium text-foreground">
                                  {data.monthName}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-right font-semibold text-income whitespace-nowrap">
                                  Rp{" "}
                                  {data.income.toLocaleString("id-ID", {
                                    maximumFractionDigits: 0,
                                  })}
                                </td>
                                <td className="py-3 px-2 sm:px-4 text-right font-semibold text-expense whitespace-nowrap">
                                  Rp{" "}
                                  {data.expenses.toLocaleString("id-ID", {
                                    maximumFractionDigits: 0,
                                  })}
                                </td>
                                <td
                                  className={`py-3 px-2 sm:px-4 text-right font-bold whitespace-nowrap ${balance >= 0 ? "text-budget" : "text-expense"}`}
                                >
                                  Rp {balance.toLocaleString("id-ID", { maximumFractionDigits: 0 })}
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
      </div>

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
