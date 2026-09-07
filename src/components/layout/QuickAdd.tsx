"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { IconRenderer } from "@/components/icons/IconRenderer";
import { useTransactionStore } from "@/stores/transactionStore";
import {
  CURRENCIES,
  formatCurrencyInput,
  parseCurrencyAmount,
  formatCurrency,
} from "@/lib/currency";
import { Currency } from "@/types";
import { useToast } from "@/hooks/use-toast";

export function QuickAdd() {
  const [open, setOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("IDR");
  const [displayAmount, setDisplayAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const { categories, addTransaction } = useTransactionStore();

  const expenseCategories = (categories || []).filter(
    (c) => c && c.type && c.type.toLowerCase() === "expense"
  );

  const selectedCategory = expenseCategories.find((c) => c.id === category);
  const currencySymbol = CURRENCIES[currency]?.symbol || "Rp";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseCurrencyAmount(displayAmount, currency);

    if (numericAmount <= 0) {
      toast({
        title: "Nominal tidak valid",
        description: "Harap masukkan nominal lebih dari 0.",
        variant: "destructive",
      });
      return;
    }

    if (!category || !description.trim()) {
      toast({
        title: "Data belum lengkap",
        description: "Harap isi deskripsi dan pilih kategori pengeluaran.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addTransaction({
        type: "expense",
        amount: numericAmount,
        categoryId: category,
        currency,
        date: new Date().toISOString(),
        description: description.trim() || "Quick add",
      });

      toast({
        title: "Pengeluaran Ditambahkan",
        description: `${formatCurrency(numericAmount, currency)} - ${description.trim()}`,
      });

      setOpen(false);
      setDisplayAmount("");
      setDescription("");
      setCategory("");
    } catch (err: any) {
      console.error("QuickAdd error:", err);
      toast({
        title: "Gagal Menyimpan",
        description: err.message || "Terjadi kesalahan saat menyimpan transaksi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={150}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <Button
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-xl lg:hidden z-50 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring transition-all hover:scale-105 active:scale-95 flex items-center justify-center cursor-pointer"
                size="icon"
                aria-label="Quick Add Expense"
              >
                <Plus className="h-6 w-6" />
              </Button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" className="font-medium text-xs shadow-lg">
            Quick Add
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Quick Add Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 py-2">
          {/* Amount and Currency Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">
              Nominal & Mata Uang
            </label>
            <div className="flex gap-2">
              <Select
                value={currency}
                onValueChange={(val: Currency) => {
                  setCurrency(val);
                  if (displayAmount) {
                    const num = parseCurrencyAmount(displayAmount, currency);
                    if (num > 0) {
                      setDisplayAmount(
                        val === "IDR" || val === "JPY"
                          ? formatCurrencyInput(Math.round(num).toString(), val)
                          : formatCurrencyInput(num.toFixed(2), val)
                      );
                    }
                  }
                }}
              >
                <SelectTrigger className="w-[110px] flex-shrink-0 font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CURRENCIES).map(([code, info]) => (
                    <SelectItem key={code} value={code}>
                      <span className="font-semibold">{info.symbol}</span>{" "}
                      <span className="text-muted-foreground">{code}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground pointer-events-none select-none">
                  {currencySymbol}
                </span>
                <Input
                  type="text"
                  inputMode={currency === "IDR" || currency === "JPY" ? "numeric" : "decimal"}
                  placeholder={
                    currency === "IDR" ? "50.000" : currency === "EUR" ? "12,50" : "15.00"
                  }
                  value={displayAmount}
                  onChange={(e) => {
                    const formatted = formatCurrencyInput(e.target.value, currency);
                    setDisplayAmount(formatted);
                  }}
                  className="pl-10 font-medium"
                  autoFocus
                  required
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Deskripsi</label>
            <Input
              type="text"
              placeholder="Contoh: Makan Siang / Bensin"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Category Section with Lucide Icon & Color Dot */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground">Kategori</label>
            <Select value={category} onValueChange={setCategory} required>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori">
                  {selectedCategory ? (
                    <div className="flex items-center gap-2">
                      <IconRenderer
                        name={selectedCategory.icon || "Circle"}
                        className="w-4 h-4 flex-shrink-0"
                        style={{ color: selectedCategory.color }}
                        aria-hidden={true}
                      />
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ backgroundColor: selectedCategory.color }}
                      />
                      <span className="truncate">{selectedCategory.name}</span>
                    </div>
                  ) : (
                    "Pilih Kategori"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {expenseCategories.length > 0 ? (
                  expenseCategories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      <div className="flex items-center gap-2">
                        <IconRenderer
                          name={c.icon || "Circle"}
                          className="w-4 h-4 flex-shrink-0"
                          style={{ color: c.color }}
                          aria-hidden={true}
                        />
                        <span
                          className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: c.color }}
                        />
                        <span>{c.name}</span>
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="empty-expense" disabled>
                    <span className="text-muted-foreground italic">
                      Tidak ada kategori pengeluaran
                    </span>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              "Simpan Pengeluaran"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
