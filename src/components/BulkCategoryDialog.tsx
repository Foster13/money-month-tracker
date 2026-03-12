"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { Category } from "@/types";

interface BulkCategoryDialogProps {
  open: boolean;
  count: number;
  categories: Category[];
  onConfirm: (categoryId: string) => void;
  onCancel: () => void;
}

export function BulkCategoryDialog({
  open,
  count,
  categories,
  onConfirm,
  onCancel,
}: BulkCategoryDialogProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");

  const handleConfirm = () => {
    if (selectedCategoryId) {
      onConfirm(selectedCategoryId);
      setSelectedCategoryId("");
    }
  };

  const handleCancel = () => {
    setSelectedCategoryId("");
    onCancel();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      handleCancel();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-category-title"
        aria-describedby="bulk-category-description"
      >
        <DialogHeader>
          <DialogTitle id="bulk-category-title">Change Category</DialogTitle>
          <DialogDescription id="bulk-category-description">
            Select a new category for {count} {count === 1 ? 'transaction' : 'transactions'}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
            <SelectTrigger aria-label="Select category">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={!selectedCategoryId}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
