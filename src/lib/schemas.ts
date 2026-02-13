// File: src/lib/schemas.ts
import { z } from "zod";

/**
 * Zod schema for transaction form validation
 */
export const transactionSchema = z.object({
  amount: z
    .number({
      required_error: "Amount is required",
      invalid_type_error: "Amount must be a number",
    })
    .positive("Amount must be positive"),
  currency: z.enum(["IDR", "USD", "SGD", "GBP", "EUR", "JPY", "AUD", "CNY"]),
  categoryId: z.string().min(1, "Category is required"),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  type: z.enum(["income", "expense"]),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;

/**
 * Zod schema for category form validation
 */
export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  type: z.enum(["income", "expense"]),
  color: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
