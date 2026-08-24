"use client";

import { useState } from "react";
import { useTransactionStore } from "@/stores/transactionStore";
import { IncomeSection } from "@/components/sections/IncomeSection";
import { PageHeader } from "@/components/layout/PageHeader";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { TransactionForm } from "@/components/transactions/TransactionForm";
import { useToast } from "@/hooks/use-toast";
import { Transaction } from "@/types";

export default function IncomePage() {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const { toast } = useToast();

  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useTransactionStore((state) => state.categories);
  const exchangeRates = useTransactionStore((state) => state.exchangeRates);
  const deleteTransaction = useTransactionStore((state) => state.deleteTransaction);

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
      <PageHeader title="Income" description="Manage your incoming cash flow" />

      {(isFormOpen || editingTransaction) && (
        <div className="mb-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
            <div className="px-4 sm:px-6 py-4 flex flex-row items-center justify-between border-b border-border">
              <h3 className="text-lg sm:text-xl font-semibold">
                {editingTransaction ? "Edit Transaction" : "Add Transaction"}
              </h3>
            </div>
            <div className="px-4 sm:px-6 py-6">
              <TransactionForm
                categories={categories}
                onSubmit={(data) => {
                  if (editingTransaction) {
                    useTransactionStore.getState().updateTransaction(editingTransaction.id, data);
                    toast({ title: "Success", description: "Transaction updated successfully" });
                  } else {
                    useTransactionStore.getState().addTransaction(data);
                    toast({ title: "Success", description: "Transaction added successfully" });
                  }
                  setEditingTransaction(null);
                  setIsFormOpen(false);
                }}
                editingTransaction={editingTransaction}
                onCancel={() => {
                  setEditingTransaction(null);
                  setIsFormOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}

      <IncomeSection
        transactions={transactions}
        categories={categories}
        exchangeRates={exchangeRates}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={() => {
          setEditingTransaction(null);
          setIsFormOpen(true);
        }}
      />

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
