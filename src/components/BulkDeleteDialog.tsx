"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BulkDeleteDialogProps {
  open: boolean;
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BulkDeleteDialog({
  open,
  count,
  onConfirm,
  onCancel,
}: BulkDeleteDialogProps) {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onCancel()}>
      <DialogContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="bulk-delete-title"
        aria-describedby="bulk-delete-description"
      >
        <DialogHeader>
          <DialogTitle id="bulk-delete-title">Delete Transactions</DialogTitle>
          <DialogDescription id="bulk-delete-description">
            Are you sure you want to delete {count} {count === 1 ? 'transaction' : 'transactions'}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
