// File: src/components/ExchangeRateDisplay.tsx
"use client";

import { useState } from "react";
import { Currency } from "@/types";
import { CURRENCIES, fetchExchangeRates } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

interface ExchangeRateDisplayProps {
  exchangeRates: Record<Currency, number>;
  lastUpdate: string | null;
  onUpdate: (rates: Record<Currency, number>) => void;
}

export function ExchangeRateDisplay({
  exchangeRates,
  lastUpdate,
  onUpdate,
}: ExchangeRateDisplayProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleUpdateRates = async () => {
    setIsUpdating(true);
    try {
      const newRates = await fetchExchangeRates();
      onUpdate(newRates);
      toast({
        title: "Exchange Rates Updated",
        description: "Real-time exchange rates have been fetched successfully",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Could not fetch exchange rates. Using cached rates.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="glass-card animate-fade-in overflow-hidden">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl">Exchange Rates (to IDR)</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleUpdateRates}
            disabled={isUpdating}
            className="transition-all duration-200 w-full sm:w-auto"
          >
            <RefreshCw className={`h-4 w-4 mr-2 transition-transform duration-500 ${isUpdating ? "animate-spin" : ""}`} />
            {isUpdating ? "Updating..." : "Update Rates"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {Object.entries(exchangeRates)
            .filter(([currency]) => currency !== "IDR")
            .map(([currency, rate], index) => {
              const currencyInfo = CURRENCIES[currency as Currency];
              return (
                <div
                  key={currency}
                  className="glass-subtle flex flex-col p-3 rounded-lg hover-lift transition-all duration-300 animate-scale-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="text-xs sm:text-sm font-medium text-muted-foreground">
                    {currencyInfo.symbol} {currency}
                  </div>
                  <div className="text-base sm:text-lg font-bold transition-all duration-300 break-words">
                    Rp {rate.toLocaleString("id-ID", {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    per 1 {currency}
                  </div>
                </div>
              );
            })}
        </div>
        {lastUpdate && (
          <div className="mt-4 text-xs text-muted-foreground text-center animate-fade-in">
            Last updated: {format(new Date(lastUpdate), "PPpp")}
          </div>
        )}
        {!lastUpdate && (
          <div className="mt-4 text-xs text-muted-foreground text-center animate-fade-in">
            Click &quot;Update Rates&quot; to fetch real-time exchange rates
          </div>
        )}
      </CardContent>
    </Card>
  );
}
