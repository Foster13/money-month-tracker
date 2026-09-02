"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { AnimatedThemeToggle } from "@/components/layout/AnimatedThemeToggle";
import { CategoryManager } from "@/components/categories/CategoryManager";
import { DataControls } from "@/components/dashboard/DataControls";
import { useTransactionStore } from "@/stores/transactionStore";
import { InstallPrompt } from "@/components/layout/InstallPrompt";

interface PageHeaderProps {
  title?: string;
  description?: string;
}

export function PageHeader({
  title = "Personal Finance",
  description = "Track your income and expenses",
}: PageHeaderProps) {
  const categories = useTransactionStore((state) => state.categories);
  const addCategory = useTransactionStore((state) => state.addCategory);
  const deleteCategory = useTransactionStore((state) => state.deleteCategory);
  const exportData = useTransactionStore((state) => state.exportData);
  const importData = useTransactionStore((state) => state.importData);

  const handleImport = (jsonData: string) => {
    try {
      importData(jsonData);
    } catch (error) {
      throw error;
    }
  };

  return (
    <header className="flex flex-col space-y-4 sm:space-y-3 animate-slide-down pt-2 md:pt-4 mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 sm:gap-3">
        <div className="flex-1 min-w-0 w-full sm:w-auto">
          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <SidebarTrigger className="-ml-1 md:hidden" />
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground flex items-center gap-2">
              {title}
            </h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="w-full sm:w-auto flex justify-end gap-2 items-center">
          <InstallPrompt />
          <AnimatedThemeToggle />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-2">
        <CategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onDeleteCategory={deleteCategory}
        />
        <DataControls onExport={exportData} onImport={handleImport} />
      </div>
    </header>
  );
}
