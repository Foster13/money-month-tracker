// File: src/lib/currency.ts
import { Currency } from "@/types";

/**
 * Currency information
 */
export const CURRENCIES: Record<Currency, { name: string; symbol: string }> = {
  IDR: { name: "Indonesian Rupiah", symbol: "Rp" },
  USD: { name: "US Dollar", symbol: "$" },
  SGD: { name: "Singapore Dollar", symbol: "S$" },
  GBP: { name: "British Pound", symbol: "£" },
  EUR: { name: "Euro", symbol: "€" },
  JPY: { name: "Japanese Yen", symbol: "¥" },
  AUD: { name: "Australian Dollar", symbol: "A$" },
  CNY: { name: "Chinese Yuan", symbol: "¥" },
};

/**
 * Fetch real-time exchange rates from API
 * Using exchangerate-api.com free tier
 */
export async function fetchExchangeRates(): Promise<Record<Currency, number>> {
  try {
    // Using open.er-api.com (free, high precision) with USD as base
    const response = await fetch("https://open.er-api.com/v6/latest/USD");

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();
    const rates = data.rates;

    // Convert rates to IDR base
    // Since API returns rates from USD, 1 USD = rates.IDR
    // To get the value of 1 EUR in IDR: (1 / rates.EUR) * rates.IDR
    const idrBase = rates.IDR || 15500;

    return {
      IDR: 1,
      USD: idrBase,
      SGD: rates.SGD ? idrBase / rates.SGD : 11500,
      GBP: rates.GBP ? idrBase / rates.GBP : 19500,
      EUR: rates.EUR ? idrBase / rates.EUR : 16500,
      JPY: rates.JPY ? idrBase / rates.JPY : 105,
      AUD: rates.AUD ? idrBase / rates.AUD : 10500,
      CNY: rates.CNY ? idrBase / rates.CNY : 2200,
    };
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    // Return fallback rates if API fails
    return {
      IDR: 1,
      USD: 15000,
      SGD: 11000,
      GBP: 19000,
      EUR: 16000,
      JPY: 100,
      AUD: 10000,
      CNY: 2100,
    };
  }
}

/**
 * Convert amount from one currency to IDR
 */
export function convertToIDR(
  amount: number,
  currency: Currency,
  rates: Record<Currency, number>
): number {
  if (currency === "IDR") return amount;
  return amount * rates[currency];
}

/**
 * Format currency amount with symbol
 */
export function formatCurrency(
  amount: number,
  currency: Currency,
  showIDRConversion: boolean = false,
  rates?: Record<Currency, number>
): string {
  const currencyInfo = CURRENCIES[currency];
  const formatted = `${currencyInfo.symbol}${amount.toLocaleString("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

  if (showIDRConversion && currency !== "IDR" && rates) {
    const idrAmount = convertToIDR(amount, currency, rates);
    return `${formatted} (Rp ${idrAmount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })})`;
  }

  return formatted;
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES[currency].symbol;
}

/**
 * Get currency name
 */
export function getCurrencyName(currency: Currency): string {
  return CURRENCIES[currency].name;
}
