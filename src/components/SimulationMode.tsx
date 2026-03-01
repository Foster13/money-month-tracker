// File: src/components/SimulationMode.tsx
"use client";

import { useState } from "react";
import { useSimulationStore } from "@/stores/simulationStore";
import { useTransactionStore } from "@/stores/transactionStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TransactionForm } from "./TransactionForm";
import { TransactionList } from "./TransactionList";
import { Summary } from "./Summary";
import { FinanceChart } from "./FinanceChart";
import { PlayCircle, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

export function SimulationMode() {
  const [isActive, setIsActive] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const { toast } = useToast();

  const mainTransactions = useTransactionStore((state) => state.transactions);
  const mainCategories = useTransactionStore((state) => state.categories);
  const exchangeRates = useTransactionStore((state) => state.exchangeRates);

  const simTransactions = useSimulationStore((state) => state.transactions);
  const simCategories = useSimulationStore((state) => state.categories);
  const addSimTransaction = useSimulationStore((state) => state.addTransaction);
  const updateSimTransaction = useSimulationStore((state) => state.updateTransaction);
  const deleteSimTransaction = useSimulationStore((state) => state.deleteTransaction);
  const clearSimulation = useSimulationStore((state) => state.clearSimulation);
  const loadFromMain = useSimulationStore((state) => state.loadFromMain);

  const startSimulation = () => {
    loadFromMain(mainTransactions, mainCategories);
    setIsActive(true);
    toast({
      title: "Simulation Started",
      description: "You can now add projected transactions without affecting your main data",
    });
  };

  const resetSimulation = () => {
    clearSimulation();
    setIsActive(false);
    setEditingTransaction(null);
    toast({
      title: "Simulation Reset",
      description: "All simulation data has been cleared",
    });
  };

  const handleSubmit = (data: any) => {
    if (editingTransaction) {
      updateSimTransaction(editingTransaction.id, data);
      setEditingTransaction(null);
      toast({
        title: "Success",
        description: "Transaction updated in simulation",
      });
    } else {
      addSimTransaction(data);
      toast({
        title: "Success",
        description: "Transaction added to simulation",
      });
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDelete = (id: string) => {
    deleteSimTransaction(id);
    toast({
      title: "Success",
      description: "Transaction deleted from simulation",
    });
  };

  if (!isActive) {
    return (
      <Card className="glass-card animate-scale-in overflow-hidden">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-semibold">Simulation Mode</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6 space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            Use simulation mode to project future finances without affecting your actual data.
            Your current transactions will be loaded as a starting point.
          </p>
          <Button 
            onClick={startSimulation} 
            className="transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px] w-full sm:w-auto"
            aria-label="Start financial simulation mode"
          >
            <PlayCircle className="mr-2 h-4 w-4" aria-hidden="true" />
            Start Simulation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden space-y-6">
      {/* Simulation Active Banner - Responsive */}
      <Card className="glass-card border-blue-500 border-2 animate-slide-down overflow-hidden">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <CardTitle className="text-lg sm:text-xl lg:text-2xl text-blue-600 animate-pulse-soft">
              Simulation Mode Active
            </CardTitle>
            <Button 
              variant="outline" 
              onClick={resetSimulation} 
              className="glass-subtle transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px] w-full sm:w-auto"
              aria-label="Reset simulation and return to main data"
            >
              <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
              Reset Simulation
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <p className="text-sm sm:text-base text-muted-foreground">
            Changes made here will not affect your main data. This is for projection purposes only.
          </p>
        </CardContent>
      </Card>

      {/* Summary - Responsive */}
      <div className="animate-slide-up">
        <Summary transactions={simTransactions} exchangeRates={exchangeRates} />
      </div>

      {/* Chart - Responsive */}
      <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-lg sm:text-xl font-semibold">Income vs Expenses (Simulation)</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <div className="w-full min-h-[300px] sm:min-h-[350px] lg:min-h-[400px]">
            <FinanceChart transactions={simTransactions} exchangeRates={exchangeRates} />
          </div>
        </CardContent>
      </Card>

      {/* Transaction Form - Responsive */}
      <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-lg sm:text-xl font-semibold">
            {editingTransaction ? "Edit Transaction" : "Add Projected Transaction"}
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <TransactionForm
            categories={simCategories}
            onSubmit={handleSubmit}
            editingTransaction={editingTransaction}
            onCancel={() => setEditingTransaction(null)}
          />
        </CardContent>
      </Card>

      {/* Transaction List - Responsive */}
      <Card className="glass-card animate-scale-in overflow-hidden" style={{ animationDelay: '0.3s' }}>
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-5">
          <CardTitle className="text-lg sm:text-xl font-semibold">Simulated Transactions</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <TransactionList
            transactions={simTransactions}
            categories={simCategories}
            exchangeRates={exchangeRates}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
