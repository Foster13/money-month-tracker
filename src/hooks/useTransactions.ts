// File: src/hooks/useTransactions.ts
import { useTransactionStore } from '@/stores/transactionStore';
import { Transaction } from '@/types';
import { useToast } from './use-toast';

export function useTransactions() {
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

  const handleAddTransaction = (data: Omit<Transaction, 'id'>) => {
    addTransaction(data);
    toast({
      title: 'Success',
      description: 'Transaction added successfully',
    });
  };

  const handleUpdateTransaction = (id: string, data: Partial<Transaction>) => {
    updateTransaction(id, data);
    toast({
      title: 'Success',
      description: 'Transaction updated successfully',
    });
  };

  const handleDeleteTransaction = (id: string) => {
    if (confirm('Are you sure you want to delete this transaction?')) {
      deleteTransaction(id);
      toast({
        title: 'Success',
        description: 'Transaction deleted successfully',
      });
    }
  };

  const handleImportData = (jsonData: string) => {
    try {
      importData(jsonData);
      toast({
        title: 'Success',
        description: 'Data imported successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import data',
        variant: 'destructive',
      });
      throw error;
    }
  };

  return {
    // State
    transactions,
    categories,
    exchangeRates,
    lastRateUpdate,
    
    // Actions
    addTransaction: handleAddTransaction,
    updateTransaction: handleUpdateTransaction,
    deleteTransaction: handleDeleteTransaction,
    addCategory,
    deleteCategory,
    updateExchangeRates,
    exportData,
    importData: handleImportData,
  };
}
