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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface BulkExportDialogProps {
  open: boolean;
  count: number;
  onConfirm: (format: 'json' | 'csv') => void;
  onCancel: () => void;
}

export function BulkExportDialog({
  open,
  count,
  onConfirm,
  onCancel,
}: BulkExportDialogProps) {
  const [selectedFormat, setSelectedFormat] = useState<'json' | 'csv'>('json');

  const handleConfirm = () => {
    onConfirm(selectedFormat);
    setSelectedFormat('json');
  };

  const handleCancel = () => {
    setSelectedFormat('json');
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
        aria-labelledby="bulk-export-title"
        aria-describedby="bulk-export-description"
      >
        <DialogHeader>
          <DialogTitle id="bulk-export-title">Export Transactions</DialogTitle>
          <DialogDescription id="bulk-export-description">
            Select a format to export {count} {count === 1 ? 'transaction' : 'transactions'}.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup value={selectedFormat} onValueChange={(value: string) => setSelectedFormat(value as 'json' | 'csv')}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="format-json" />
              <Label htmlFor="format-json" className="cursor-pointer">JSON</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="csv" id="format-csv" />
              <Label htmlFor="format-csv" className="cursor-pointer">CSV</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
