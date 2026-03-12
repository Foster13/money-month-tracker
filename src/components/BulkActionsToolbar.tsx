// File: src/components/BulkActionsToolbar.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Tag, Download, X } from "lucide-react";
import type { BulkActionsToolbarProps } from "@/types";

export function BulkActionsToolbar({
  selectedCount,
  onBulkDelete,
  onBulkCategoryChange,
  onBulkExport,
  onClearSelection,
}: BulkActionsToolbarProps) {
  // Only render when transactions are selected
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div
      className="sticky top-0 z-10 flex flex-col sm:flex-row items-center justify-between gap-2 p-3 mb-4 bg-muted border rounded-lg"
      role="toolbar"
      aria-label="Bulk actions toolbar"
    >
      {/* Selection counter with ARIA live region */}
      <div
        className="text-sm font-medium"
        aria-live="polite"
        aria-atomic="true"
      >
        {selectedCount} {selectedCount === 1 ? "transaction" : "transactions"} selected
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap justify-center">
        <Button
          variant="outline"
          size="sm"
          onClick={onBulkDelete}
          className="transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px]"
          aria-label={`Delete ${selectedCount} selected ${selectedCount === 1 ? "transaction" : "transactions"}`}
          title="Delete selected transactions"
        >
          <Trash2 className="h-4 w-4 mr-0 sm:mr-2" aria-hidden={true} />
          <span className="hidden sm:inline">Delete</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onBulkCategoryChange}
          className="transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px]"
          aria-label={`Change category for ${selectedCount} selected ${selectedCount === 1 ? "transaction" : "transactions"}`}
          title="Change category for selected transactions"
        >
          <Tag className="h-4 w-4 mr-0 sm:mr-2" aria-hidden={true} />
          <span className="hidden sm:inline">Category</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onBulkExport}
          className="transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px]"
          aria-label={`Export ${selectedCount} selected ${selectedCount === 1 ? "transaction" : "transactions"}`}
          title="Export selected transactions"
        >
          <Download className="h-4 w-4 mr-0 sm:mr-2" aria-hidden={true} />
          <span className="hidden sm:inline">Export</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px]"
          aria-label="Clear selection"
          title="Clear selection"
        >
          <X className="h-4 w-4 mr-0 sm:mr-2" aria-hidden={true} />
          <span className="hidden sm:inline">Clear</span>
        </Button>
      </div>
    </div>
  );
}
