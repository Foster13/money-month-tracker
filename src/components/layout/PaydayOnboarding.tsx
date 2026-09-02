"use client";

import { useState } from "react";
import { useTransactionStore } from "@/stores/transactionStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PaydayOnboarding() {
  const { paydayDate, setPaydayDate } = useTransactionStore();
  const [date, setDate] = useState<string>("");
  const [error, setError] = useState<string>("");

  // Only show if paydayDate is literally null (not fetched yet, or newly registered)
  const open = paydayDate === null;

  const handleSave = () => {
    const parsed = parseInt(date, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 31) {
      setError("Please enter a valid date between 1 and 31");
      return;
    }
    setPaydayDate(parsed);
  };

  if (!open) return null;

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle>Set Your Payday</DialogTitle>
          <DialogDescription>
            When do you usually get paid? We use this to calculate your &quot;Money Month&quot;
            boundaries instead of standard calendar months. (You can only change this once per month
            later)
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Payday Date (1-31)</label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={date}
              onChange={(e) => {
                setDate(e.target.value.replace(/\D/g, ""));
                setError("");
              }}
              placeholder="e.g. 25"
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <Button onClick={handleSave} className="w-full">
            Save and Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
