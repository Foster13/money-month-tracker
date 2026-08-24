"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction, Category, Currency } from "@/types";
import { format, parseISO } from "date-fns";
import { formatCurrency } from "@/lib/currency";
import { IconRenderer } from "@/components/icons/IconRenderer";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const getColumns = (
  categories: Category[],
  exchangeRates: Record<Currency, number>,
  onEdit: (transaction: Transaction) => void,
  onDelete: (id: string) => void
): ColumnDef<Transaction>[] => {
  const getCategoryColor = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.color || "#64748b";
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.icon || "Circle";
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || "Unknown";
  };

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return format(parseISO(row.getValue("date")), "MMM dd, yyyy");
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => <div className="font-medium px-4">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "categoryId",
      header: "Category",
      cell: ({ row }) => {
        const categoryId = row.getValue("categoryId") as string;
        return (
          <span
            className="inline-flex items-center gap-2"
            style={{ color: getCategoryColor(categoryId) }}
          >
            <IconRenderer name={getCategoryIcon(categoryId)} className="w-4 h-4" />
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getCategoryColor(categoryId) }}
            />
            {getCategoryName(categoryId)}
          </span>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string;
        return (
          <span
            className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
              type === "income"
                ? "bg-income/20 text-income border border-income/30"
                : "bg-expense/20 text-expense border border-expense/30"
            }`}
          >
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-right">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const transaction = row.original;

        return (
          <div
            className={`text-right font-medium flex flex-col items-end ${
              transaction.type === "income" ? "text-income" : "text-expense"
            }`}
          >
            <span>
              {transaction.type === "income" ? "+" : "-"}
              {formatCurrency(amount, transaction.currency, false)}
            </span>
            {transaction.currency !== "IDR" && (
              <span className="text-xs text-muted-foreground">
                {formatCurrency(amount, transaction.currency, true, exchangeRates)
                  .split("(")[1]
                  ?.replace(")", "")}
              </span>
            )}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(transaction)}
              className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(transaction.id)}
              className="hover:bg-red-100 dark:hover:bg-red-900/30"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
};
