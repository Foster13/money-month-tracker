// File: src/constants/category-icons.ts

/**
 * Common Lucide icons suitable for transaction categories
 * Organized by category type for easier selection
 */

export const INCOME_ICONS = [
  { name: "Briefcase", label: "Briefcase (Salary)" },
  { name: "Laptop", label: "Laptop (Freelance)" },
  { name: "TrendingUp", label: "Trending Up (Investments)" },
  { name: "DollarSign", label: "Dollar Sign (Income)" },
  { name: "Coins", label: "Coins (Money)" },
  { name: "Wallet", label: "Wallet (Earnings)" },
  { name: "PiggyBank", label: "Piggy Bank (Savings)" },
  { name: "Gift", label: "Gift (Bonus)" },
  { name: "Award", label: "Award (Achievement)" },
  { name: "Trophy", label: "Trophy (Prize)" },
];

export const EXPENSE_ICONS = [
  { name: "Home", label: "Home (Housing)" },
  { name: "Car", label: "Car (Transportation)" },
  { name: "UtensilsCrossed", label: "Utensils (Food)" },
  { name: "Zap", label: "Zap (Utilities)" },
  { name: "Heart", label: "Heart (Healthcare)" },
  { name: "Film", label: "Film (Entertainment)" },
  { name: "ShoppingBag", label: "Shopping Bag" },
  { name: "ShoppingCart", label: "Shopping Cart" },
  { name: "Coffee", label: "Coffee (Dining)" },
  { name: "Shirt", label: "Shirt (Clothing)" },
  { name: "Smartphone", label: "Smartphone (Tech)" },
  { name: "Wifi", label: "WiFi (Internet)" },
  { name: "Fuel", label: "Fuel (Gas)" },
  { name: "Plane", label: "Plane (Travel)" },
  { name: "Hotel", label: "Hotel (Lodging)" },
  { name: "GraduationCap", label: "Graduation Cap (Education)" },
  { name: "Book", label: "Book (Learning)" },
  { name: "Dumbbell", label: "Dumbbell (Fitness)" },
  { name: "Gamepad2", label: "Gamepad (Gaming)" },
  { name: "Music", label: "Music (Entertainment)" },
  { name: "Scissors", label: "Scissors (Grooming)" },
  { name: "Wrench", label: "Wrench (Maintenance)" },
  { name: "Package", label: "Package (Delivery)" },
  { name: "MoreHorizontal", label: "More (Other)" },
];

export const ALL_CATEGORY_ICONS = [...INCOME_ICONS, ...EXPENSE_ICONS];

/**
 * Get icon suggestions based on category type
 */
export function getIconSuggestions(type: "income" | "expense") {
  return type === "income" ? INCOME_ICONS : EXPENSE_ICONS;
}
