// File: src/components/Summary.tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Transaction, Currency } from "@/types";
import { convertToIDR } from "@/lib/currency";
import { TrendingUp, TrendingDown, Wallet, FileDown } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface SummaryProps {
  transactions: Transaction[];
  exchangeRates: Record<Currency, number>;
}

export function Summary({ transactions, exchangeRates }: SummaryProps) {
  const { toast } = useToast();
  
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);

  const balance = totalIncome - totalExpenses;

  const formatIDR = (amount: number) => {
    return `Rp ${amount.toLocaleString("id-ID", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const exportToPDF = async () => {
    try {
      // Dynamic import to reduce bundle size
      const jsPDF = (await import("jspdf")).default;
      const autoTable = (await import("jspdf-autotable")).default;

      const doc = new jsPDF();
      
      // Title
      doc.setFontSize(22);
      doc.setTextColor(236, 72, 153); // Pink color
      doc.text("Financial Summary Report", 14, 22);
      
      // Subtitle line
      doc.setLineWidth(0.5);
      doc.setDrawColor(236, 72, 153);
      doc.line(14, 26, 196, 26);
      
      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Report Generated: ${format(new Date(), "MMMM dd, yyyy 'at' HH:mm")}`, 14, 33);
      
      // Period info
      doc.text(`Period: Current Month`, 14, 39);
      
      // Summary Section
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text("Financial Overview", 14, 50);
      
      // Summary Table
      autoTable(doc, {
        startY: 55,
        head: [["Category", "Amount (IDR)"]],
        body: [
          ["Total Income", formatIDR(totalIncome)],
          ["Total Expenses", formatIDR(totalExpenses)],
          ["Net Balance", formatIDR(balance)],
        ],
        theme: "grid",
        headStyles: { 
          fillColor: [244, 114, 182], // Pink
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: "bold",
          halign: "center",
        },
        bodyStyles: { 
          fontSize: 11,
        },
        alternateRowStyles: {
          fillColor: [255, 245, 250], // Light pink
        },
        columnStyles: {
          0: { 
            cellWidth: 80,
            fontStyle: "bold",
          },
          1: { 
            cellWidth: 80, 
            halign: "right", 
            fontStyle: "bold",
            textColor: [0, 0, 0],
          },
        },
      });

      // Income Transactions
      const incomeTransactions = transactions.filter((t) => t.type === "income");
      if (incomeTransactions.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY || 95;
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Income Transactions", 14, finalY + 12);
        
        // Add count
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Total: ${incomeTransactions.length} transaction(s)`, 14, finalY + 18);
        
        autoTable(doc, {
          startY: finalY + 23,
          head: [["Date", "Description", "Amount (IDR)"]],
          body: incomeTransactions.map((t) => [
            format(new Date(t.date), "MMM dd, yyyy"),
            t.description,
            formatIDR(convertToIDR(t.amount, t.currency, exchangeRates)),
          ]),
          theme: "striped",
          headStyles: { 
            fillColor: [236, 72, 153], // Pink
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: "bold",
            halign: "center",
          },
          bodyStyles: { 
            fontSize: 10,
          },
          columnStyles: {
            0: { cellWidth: 35, halign: "center" },
            1: { cellWidth: 95 },
            2: { cellWidth: 50, halign: "right", fontStyle: "bold" },
          },
          alternateRowStyles: {
            fillColor: [255, 245, 250],
          },
        });
      }

      // Expense Transactions
      const expenseTransactions = transactions.filter((t) => t.type === "expense");
      if (expenseTransactions.length > 0) {
        const finalY = (doc as any).lastAutoTable.finalY || 140;
        
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("Expense Transactions", 14, finalY + 12);
        
        // Add count
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Total: ${expenseTransactions.length} transaction(s)`, 14, finalY + 18);
        
        autoTable(doc, {
          startY: finalY + 23,
          head: [["Date", "Description", "Amount (IDR)"]],
          body: expenseTransactions.map((t) => [
            format(new Date(t.date), "MMM dd, yyyy"),
            t.description,
            formatIDR(convertToIDR(t.amount, t.currency, exchangeRates)),
          ]),
          theme: "striped",
          headStyles: { 
            fillColor: [244, 63, 94], // Rose
            textColor: [255, 255, 255],
            fontSize: 11,
            fontStyle: "bold",
            halign: "center",
          },
          bodyStyles: { 
            fontSize: 10,
          },
          columnStyles: {
            0: { cellWidth: 35, halign: "center" },
            1: { cellWidth: 95 },
            2: { cellWidth: 50, halign: "right", fontStyle: "bold" },
          },
          alternateRowStyles: {
            fillColor: [255, 245, 250],
          },
        });
      }

      // Summary box at the end
      const finalY = (doc as any).lastAutoTable.finalY || 200;
      
      if (finalY < 250) { // If there's space on the same page
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("Summary", 14, finalY + 12);
        
        // Draw a box
        doc.setDrawColor(236, 72, 153);
        doc.setLineWidth(0.5);
        doc.rect(14, finalY + 15, 182, 25);
        
        // Summary text inside box
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(`Total Income: ${formatIDR(totalIncome)}`, 18, finalY + 22);
        doc.text(`Total Expenses: ${formatIDR(totalExpenses)}`, 18, finalY + 29);
        
        doc.setFontSize(11);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "bold");
        const balanceText = balance >= 0 ? "Net Balance (Surplus)" : "Net Balance (Deficit)";
        doc.text(`${balanceText}: ${formatIDR(balance)}`, 18, finalY + 36);
      }

      // Footer with page numbers and disclaimer
      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        
        // Page number
        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.setFont("helvetica", "normal");
        doc.text(
          `Page ${i} of ${pageCount}`,
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 15,
          { align: "center" }
        );
        
        // Disclaimer
        doc.setFontSize(8);
        doc.text(
          "This report is generated automatically. All amounts are in Indonesian Rupiah (IDR).",
          doc.internal.pageSize.getWidth() / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: "center" }
        );
      }

      // Save PDF
      const fileName = `financial-summary-${format(new Date(), "yyyy-MM-dd")}.pdf`;
      doc.save(fileName);

      toast({
        title: "Success",
        description: "PDF exported successfully",
      });
    } catch (error) {
      console.error("PDF export error:", error);
      toast({
        title: "Error",
        description: "Failed to export PDF",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button
          onClick={exportToPDF}
          variant="outline"
          size="sm"
          className="transition-all duration-200 hover:scale-105 active:scale-95 bg-gradient-to-r from-pink-50 to-purple-50 hover:from-pink-100 hover:to-purple-100 border-pink-200"
        >
          <FileDown className="mr-2 h-4 w-4" />
          Export PDF
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="glass-card animate-fade-in overflow-hidden border-pink-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-pink-700">💰 Total Income</CardTitle>
          <div className="p-2 rounded-full bg-pink-100 backdrop-blur-sm">
            <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-pink-500 animate-bounce-subtle" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-pink-600 transition-all duration-300 break-words">
            {formatIDR(totalIncome)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All amounts converted to IDR
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in overflow-hidden border-rose-200" style={{ animationDelay: '0.1s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-rose-700">💸 Total Expenses</CardTitle>
          <div className="p-2 rounded-full bg-rose-100 backdrop-blur-sm">
            <TrendingDown className="h-4 w-4 sm:h-5 sm:w-5 text-rose-500 animate-bounce-subtle" style={{ animationDelay: '0.1s' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 transition-all duration-300 break-words">
            {formatIDR(totalExpenses)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            All amounts converted to IDR
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card animate-fade-in overflow-hidden border-purple-200 sm:col-span-2 lg:col-span-1" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-purple-700">💝 Balance</CardTitle>
          <div className="p-2 rounded-full bg-purple-100 backdrop-blur-sm">
            <Wallet className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500 animate-bounce-subtle" style={{ animationDelay: '0.2s' }} />
          </div>
        </CardHeader>
        <CardContent>
          <div
            className={`text-xl sm:text-2xl font-bold transition-all duration-300 break-words ${
              balance >= 0 ? "text-purple-600" : "text-rose-600"
            }`}
          >
            {formatIDR(balance)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Net balance in IDR
          </p>
        </CardContent>
      </Card>
    </div>
    </div>
  );
}
