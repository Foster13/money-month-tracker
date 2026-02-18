// File: src/app/expenses/page.tsx
import { Dashboard } from "@/components/Dashboard";

export const metadata = {
  title: "Expenses - Personal Finance Manager",
  description: "View and manage your expense transactions",
};

export default function ExpensesPage() {
  return <Dashboard defaultTab="expenses" />;
}
