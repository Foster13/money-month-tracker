// File: src/components/UndoRedoControls.tsx
"use client";

import { useEffect } from "react";
import { useTransactionStore } from "@/stores/transactionStore";
import { Button } from "@/components/ui/button";
import { Undo2, Redo2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function UndoRedoControls() {
  const { toast } = useToast();
  const undo = useTransactionStore((state) => state.undo);
  const redo = useTransactionStore((state) => state.redo);
  const canUndo = useTransactionStore((state) => state.canUndo());
  const canRedo = useTransactionStore((state) => state.canRedo());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+Z or Cmd+Z for undo
      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
          try {
            undo();
            toast({
              title: "Undo",
              description: "Action undone successfully",
            });
          } catch (error) {
            toast({
              title: "Undo failed",
              description: error instanceof Error ? error.message : "Failed to undo operation",
              variant: "destructive",
            });
          }
        }
      }
      
      // Ctrl+Shift+Z or Cmd+Shift+Z or Ctrl+Y for redo
      if (
        ((e.ctrlKey || e.metaKey) && e.key === "z" && e.shiftKey) ||
        (e.ctrlKey && e.key === "y")
      ) {
        e.preventDefault();
        if (canRedo) {
          try {
            redo();
            toast({
              title: "Redo",
              description: "Action redone successfully",
            });
          } catch (error) {
            toast({
              title: "Redo failed",
              description: error instanceof Error ? error.message : "Failed to redo operation",
              variant: "destructive",
            });
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [canUndo, canRedo, undo, redo, toast]);

  const handleUndo = () => {
    try {
      undo();
      toast({
        title: "Undo",
        description: "Action undone successfully",
      });
    } catch (error) {
      toast({
        title: "Undo failed",
        description: error instanceof Error ? error.message : "Failed to undo operation",
        variant: "destructive",
      });
    }
  };

  const handleRedo = () => {
    try {
      redo();
      toast({
        title: "Redo",
        description: "Action redone successfully",
      });
    } catch (error) {
      toast({
        title: "Redo failed",
        description: error instanceof Error ? error.message : "Failed to redo operation",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleUndo}
        disabled={!canUndo}
        className="transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px]"
        title="Undo (Ctrl+Z)"
        aria-label="Undo last action (Ctrl+Z)"
      >
        <Undo2 className="h-4 w-4 mr-0 sm:mr-2" aria-hidden={true} />
        <span className="hidden sm:inline">Undo</span>
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleRedo}
        disabled={!canRedo}
        className="transition-all duration-200 hover:scale-105 active:scale-95 min-h-[44px]"
        title="Redo (Ctrl+Shift+Z)"
        aria-label="Redo last action (Ctrl+Shift+Z)"
      >
        <Redo2 className="h-4 w-4 mr-0 sm:mr-2" aria-hidden={true} />
        <span className="hidden sm:inline">Redo</span>
      </Button>
    </div>
  );
}
