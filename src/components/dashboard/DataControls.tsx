// File: src/components/DataControls.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTransactionStore } from "@/stores/transactionStore";
import { parseWhatsAppMessage } from "@/lib/whatsapp-parser";
import * as xlsx from "xlsx";
import { supabase } from "@/lib/supabase";

interface DataControlsProps {
  onExport: () => string;
  onImport: (data: string) => void;
}

export function DataControls({ onExport, onImport }: DataControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const categories = useTransactionStore((state) => state.categories);
  const addTransaction = useTransactionStore((state) => state.addTransaction);

  const handleExport = () => {
    try {
      const jsonData = onExport();
      const blob = new Blob([jsonData], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `finance-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast({
        title: "Success",
        description: "Data exported successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to export data",
        variant: "destructive",
      });
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileName = file.name.toLowerCase();

      // JSON (Full Backup Restore)
      if (fileName.endsWith(".json")) {
        const content = await file.text();
        onImport(content);
      }
      // TXT (WhatsApp bulk parser)
      else if (fileName.endsWith(".txt")) {
        const text = await file.text();
        const {
          data: { user },
        } = await supabase.auth.getUser();
        const userId = user?.id || "";
        const fallbackCat =
          categories.find((c) => c.type === "expense")?.id || categories[0]?.id || "";

        const txs = parseWhatsAppMessage(text, categories, fallbackCat, userId);
        for (const t of txs) {
          // Map DB structure back to UI structure expected by addTransaction
          await addTransaction({
            amount: t.amount,
            categoryId: t.category,
            currency: t.currency as any,
            date: t.date,
            description: t.description,
            type: t.type as "income" | "expense",
          });
        }
      }
      // Excel & CSV (Standard tabular data)
      else if (fileName.endsWith(".xlsx") || fileName.endsWith(".csv")) {
        const buffer = await file.arrayBuffer();
        const workbook = xlsx.read(buffer);
        const sheetName = workbook.SheetNames[0];
        const rows = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]) as any[];

        for (const r of rows) {
          const type = r.Type?.toLowerCase() === "income" ? "income" : "expense";
          const amount = parseFloat(r.Amount) || parseFloat(r.Nominal) || parseFloat(r.Harga) || 0;
          if (amount === 0) continue;

          const cat = categories.find(
            (c) => c.name.toLowerCase() === (r.Category || r.Kategori || "").toLowerCase()
          );
          const fallbackCat =
            categories.find((c) => c.type === type)?.id || categories[0]?.id || "";

          await addTransaction({
            type,
            amount,
            currency: (r.Currency || "IDR") as any,
            description: r.Description || r.Deskripsi || "",
            date: r.Date || r.Tanggal || new Date().toISOString().split("T")[0],
            categoryId: cat ? cat.id : fallbackCat,
          });
        }
      } else {
        throw new Error("Format tidak didukung.");
      }

      toast({
        title: "Success",
        description: "Data imported successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to import data. Please check the file format.",
        variant: "destructive",
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant="outline"
        onClick={handleExport}
        className="transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm flex-1 sm:flex-initial"
        aria-label="Export financial data to JSON file"
      >
        <Download className="mr-0 sm:mr-2 h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Export Data</span>
        <span className="sm:hidden">Export</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm flex-1 sm:flex-initial"
        aria-label="Import financial data from file"
      >
        <Upload className="mr-0 sm:mr-2 h-4 w-4" aria-hidden="true" />
        <span className="hidden sm:inline">Import Data</span>
        <span className="sm:hidden">Import</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.txt,.csv,.xlsx"
        onChange={handleImport}
        className="hidden"
        aria-label="File input for importing data"
      />
    </div>
  );
}
