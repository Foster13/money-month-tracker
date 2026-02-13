// File: src/components/DataControls.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DataControlsProps {
  onExport: () => string;
  onImport: (data: string) => void;
}

export function DataControls({ onExport, onImport }: DataControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        onImport(content);
        toast({
          title: "Success",
          description: "Data imported successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to import data. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);

    // Reset input so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={handleExport} className="transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm flex-1 sm:flex-initial">
        <Download className="mr-0 sm:mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Export Data</span>
        <span className="sm:hidden">Export</span>
      </Button>
      <Button
        variant="outline"
        onClick={() => fileInputRef.current?.click()}
        className="transition-all duration-200 hover:scale-105 active:scale-95 text-xs sm:text-sm flex-1 sm:flex-initial"
      >
        <Upload className="mr-0 sm:mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Import Data</span>
        <span className="sm:hidden">Import</span>
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />
    </div>
  );
}
