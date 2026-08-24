"use client";

import { SimulationMode } from "@/components/dashboard/SimulationMode";
import { PageHeader } from "@/components/layout/PageHeader";

export default function SimulationPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 animate-fade-in max-w-full overflow-x-hidden">
      <PageHeader title="Simulation" description="Forecast your financial future" />
      <SimulationMode />
    </div>
  );
}
