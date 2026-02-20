// File: src/app/budget/page.tsx
import { Dashboard } from "@/components/Dashboard";

export const metadata = {
  title: "Budget - Personal Finance Manager",
  description: "Manage your monthly budget and track spending",
};

export default function BudgetPage() {
  return <Dashboard defaultTab="budget" />;
}
