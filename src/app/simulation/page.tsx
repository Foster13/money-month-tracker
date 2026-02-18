// File: src/app/simulation/page.tsx
import { Dashboard } from "@/components/Dashboard";

export const metadata = {
  title: "Simulation Mode - Personal Finance Manager",
  description: "Test scenarios without affecting your actual data",
};

export default function SimulationPage() {
  return <Dashboard defaultTab="simulation" />;
}
