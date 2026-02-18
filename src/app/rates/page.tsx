// File: src/app/rates/page.tsx
import { Dashboard } from "@/components/Dashboard";

export const metadata = {
  title: "Exchange Rates - Personal Finance Manager",
  description: "View current exchange rates for multiple currencies",
};

export default function RatesPage() {
  return <Dashboard defaultTab="rates" />;
}
