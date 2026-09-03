"use client";

import { useEffect } from "react";
import { useTransactionStore } from "@/stores/transactionStore";
import { fetchExchangeRates } from "@/lib/currency";
import { useHydration } from "@/hooks/useHydration";

export function StoreInitializer({ children }: { children: React.ReactNode }) {
  const isHydrated = useHydration();
  const isInitialized = useTransactionStore((state) => state.isInitialized);
  const lastRateUpdate = useTransactionStore((state) => state.lastRateUpdate);
  const updateExchangeRates = useTransactionStore((state) => state.updateExchangeRates);

  // Fetch exchange rates only AFTER store is initialized from DB and not updated recently
  useEffect(() => {
    if (!isInitialized) return;

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
  }, [isInitialized, lastRateUpdate, updateExchangeRates]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground animate-pulse">Loading data...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
