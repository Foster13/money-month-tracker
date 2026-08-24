"use client";

import { useTransactionStore } from "@/stores/transactionStore";
import { ExchangeRateDisplay } from "@/components/misc/ExchangeRateDisplay";
import { PageHeader } from "@/components/layout/PageHeader";

export default function RatesPage() {
  const exchangeRates = useTransactionStore((state) => state.exchangeRates);
  const lastRateUpdate = useTransactionStore((state) => state.lastRateUpdate);
  const updateExchangeRates = useTransactionStore((state) => state.updateExchangeRates);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden">
      <PageHeader title="Exchange Rates" description="Monitor real-time currency rates" />
      <ExchangeRateDisplay
        exchangeRates={exchangeRates}
        lastUpdate={lastRateUpdate}
        onUpdate={updateExchangeRates}
      />
    </div>
  );
}
