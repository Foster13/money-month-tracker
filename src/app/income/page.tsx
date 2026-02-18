// File: src/app/income/page.tsx
import { Dashboard } from "@/components/Dashboard";

export const metadata = {
  title: "Income - Personal Finance Manager",
  description: "View and manage your income transactions",
};

export default function IncomePage() {
  return <Dashboard defaultTab="income" />;
}
