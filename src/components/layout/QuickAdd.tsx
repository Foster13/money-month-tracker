"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTransactionStore } from "@/stores/transactionStore";

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { categories, addTransaction } = useTransactionStore();
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !category || !description) return;

    setIsLoading(true);
    await addTransaction({
      type: "expense",
      amount: parseFloat(amount),
      categoryId: category,
      currency: "IDR", // Simplification
      date: new Date().toISOString(),
      description: description || "Quick add",
    });

    setIsLoading(false);
    setOpen(false);
    setAmount("");
    setDescription("");
    setCategory("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl md:hidden z-50"
          size="icon"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Quick Add Expense</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-4">
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder="Amount (e.g. 50000)"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/\D/g, ""))}
            autoFocus
            required
          />
          <Input
            type="text"
            placeholder="Description (e.g. Makan Siang)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {expenseCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
