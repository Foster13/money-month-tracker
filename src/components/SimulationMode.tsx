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
      <Card>
        <CardHeader>
          <CardTitle>Simulation Mode</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Use simulation mode to project future finances without affecting your actual data.
            Your current transactions will be loaded as a starting point.
          </p>
          <Button onClick={startSimulation}>
            <PlayCircle className="mr-2 h-4 w-4" />
            Start Simulation
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="border-blue-500 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-600">
              Simulation Mode Active
            </CardTitle>
            <Button variant="outline" onClick={resetSimulation}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Simulation
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Changes made here will not affect your main data. This is for projection purposes only.
          </p>
        </CardContent>
      </Card>

      <Summary transactions={simTransactions} exchangeRates={exchangeRates} />

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses (Simulation)</CardTitle>
        </CardHeader>
        <CardContent>
          <FinanceChart transactions={simTransactions} exchangeRates={exchangeRates} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {editingTransaction ? "Edit Transaction" : "Add Projected Transaction"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionForm
            categories={simCategories}
            onSubmit={handleSubmit}
            editingTransaction={editingTransaction}
            onCancel={() => setEditingTransaction(null)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Simulated Transactions</CardTitle>
        </CardHeader>
        <CardContent>
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
