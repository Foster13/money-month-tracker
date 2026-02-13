// File: src/components/CategoryManager.tsx
"use client";

import { useState } from "react";
import { Category } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Settings, Trash2, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CategoryManagerProps {
  categories: Category[];
  onAddCategory: (category: Omit<Category, "id">) => void;
  onDeleteCategory: (id: string) => void;
}

export function CategoryManager({
  categories,
  onAddCategory,
  onDeleteCategory,
}: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState<"income" | "expense">(
    "expense"
  );
  const [newCategoryColor, setNewCategoryColor] = useState("#64748b");
  const { toast } = useToast();

  const handleAddCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Error",
        description: "Category name is required",
        variant: "destructive",
      });
      return;
    }

    onAddCategory({
      name: newCategoryName,
      type: newCategoryType,
      color: newCategoryColor,
    });

    setNewCategoryName("");
    setNewCategoryType("expense");
    setNewCategoryColor("#64748b");

    toast({
      title: "Success",
      description: "Category added successfully",
    });
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${name}"? All transactions with this category will also be deleted.`
      )
    ) {
      onDeleteCategory(id);
      toast({
        title: "Success",
        description: "Category deleted successfully",
      });
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="transition-all duration-200 hover:scale-105 active:scale-95">
          <Settings className="mr-2 h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto animate-scale-in">
        <DialogHeader>
          <DialogTitle>Manage Categories</DialogTitle>
          <DialogDescription>
            Add new categories or delete existing ones
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Add New Category */}
          <div className="space-y-4 border-b pb-4 animate-slide-down">
            <h3 className="font-semibold">Add New Category</h3>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="category-name">Category Name</Label>
                <Input
                  id="category-name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="transition-all duration-200"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category-type">Type</Label>
                <Select
                  value={newCategoryType}
                  onValueChange={(value: "income" | "expense") =>
                    setNewCategoryType(value)
                  }
                >
                  <SelectTrigger id="category-type" className="transition-all duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="category-color">Color</Label>
                <div className="flex gap-2">
                  <Input
                    id="category-color"
                    type="color"
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    className="w-20 h-10 transition-all duration-200 cursor-pointer"
                  />
                  <Input
                    value={newCategoryColor}
                    onChange={(e) => setNewCategoryColor(e.target.value)}
                    placeholder="#000000"
                    className="transition-all duration-200"
                  />
                </div>
              </div>

              <Button onClick={handleAddCategory} className="transition-all duration-200 hover:scale-105 active:scale-95">
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          </div>

          {/* Income Categories */}
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <h3 className="font-semibold text-green-600">Income Categories</h3>
            <div className="space-y-2">
              {incomeCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 border rounded hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full transition-transform duration-200 hover:scale-125"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                    className="transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Categories */}
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="font-semibold text-red-600">Expense Categories</h3>
            <div className="space-y-2">
              {expenseCategories.map((category, index) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-2 border rounded hover-lift animate-slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full transition-transform duration-200 hover:scale-125"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      handleDeleteCategory(category.id, category.name)
                    }
                    className="transition-all duration-200 hover:bg-red-100 dark:hover:bg-red-900/30"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
