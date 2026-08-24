"use client";

import { useTransactionStore } from "@/stores/transactionStore";
import { BudgetSection } from "@/components/sections/BudgetSection";
import { PageHeader } from "@/components/layout/PageHeader";

export default function BudgetPage() {
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useTransactionStore((state) => state.categories);
  const exchangeRates = useTransactionStore((state) => state.exchangeRates);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden">
      <PageHeader title="Budget" description="Manage your monthly limits and goals" />
      <BudgetSection
        transactions={transactions}
        categories={categories}
        exchangeRates={exchangeRates}
      />
    </div>
  );
}
