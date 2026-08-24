import { Transaction, Category, Currency } from "@/types";
import { importDataSchema } from "@/lib/schemas";

export interface ExportDataPayload {
  transactions: Transaction[];
  categories: Category[];
  exchangeRates: Record<Currency, number>;
  lastRateUpdate: string | null;
  exportDate: string;
}

/**
 * Service to handle data export.
 * Generates a JSON string of all user data.
 */
export function exportTransactionsData(
  transactions: Transaction[],
  categories: Category[],
  exchangeRates: Record<Currency, number>,
  lastRateUpdate: string | null
): string {
  const payload: ExportDataPayload = {
    transactions,
    categories,
    exchangeRates,
    lastRateUpdate,
    exportDate: new Date().toISOString(),
  };

  return JSON.stringify(payload, null, 2);
}

/**
 * Service to handle data import.
 * Parses JSON, validates it via Zod, and returns parsed data or throws an error.
 */
export function importTransactionsData(jsonData: string) {
  try {
    const rawData = JSON.parse(jsonData);

    // Validate structural integrity using Zod
    const result = importDataSchema.safeParse(rawData);

    if (result.success) {
      return result.data;
    } else {
      console.error("Validation failed:", result.error.format());
      throw new Error("Format data tidak valid: " + result.error.errors[0]?.message);
    }
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Gagal mengimpor data. Periksa kembali format file Anda."
    );
  }
}
