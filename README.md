# 💰 Personal Finance Manager

A modern Personal Finance Management web application built with Next.js 14. Track your income, expenses, and budget with an intuitive interface and powerful features!

## ✨ Features

### 💰 Financial Tracking
- ✅ Track income and expenses with customizable categories
- ✅ **Multi-currency support** (IDR, USD, SGD, GBP, EUR, JPY, AUD, CNY)
- ✅ **Real-time exchange rates** with automatic IDR conversion
- ✅ View financial summaries (income, expenses, balance)
- ✅ Visualize trends with interactive 6-month bar charts
- ✅ **Bulk operations** - Select and manage multiple transactions at once

### 🎯 Advanced Features
- ✅ **Dedicated Income & Expenses sections** with 6 sorting options
- ✅ **Budget tracking** with progress monitoring and alerts
- ✅ **Top 3 categories analysis** for spending insights
- ✅ **Latest transactions overview** on dashboard
- ✅ **Simulation mode** for financial projections
- ✅ **Undo/Redo support** for all operations
- ✅ **Category management** with color coding and custom icons
- ✅ **Dark mode** support with smooth transitions

### 🚀 Bulk Operations
- ✅ Select multiple transactions with checkboxes
- ✅ Bulk delete with confirmation
- ✅ Bulk category change
- ✅ Bulk export (JSON/CSV)
- ✅ Filter-aware selection
- ✅ Full keyboard accessibility

### 🔧 Technical Features
- ✅ **Progressive Web App (PWA)** - Install on any device
- ✅ **Offline support** with service workers
- ✅ **Client-side only** - No backend required
- ✅ **localStorage persistence** - Your data stays private
- ✅ **Form validation** with Zod schemas
- ✅ **Toast notifications** for user feedback
- ✅ **Responsive design** - Works on mobile, tablet, and desktop
- ✅ **Accessibility** - Full keyboard navigation and ARIA support

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/personal-finance-manager.git
cd personal-finance-manager
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open browser**
Navigate to [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (strict mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn/UI](https://ui.shadcn.com/) (Radix UI)
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand) with localStorage
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **PWA**: [next-pwa](https://github.com/shadowwalker/next-pwa)

## 🎯 Usage Guide

### Adding Transactions
1. Click "Add Transaction" button
2. Fill in amount, description, category, and date
3. Select currency (optional, defaults to IDR)
4. Click "Add" to save

### Bulk Operations
1. Select transactions using checkboxes
2. Use "Select All" to select all filtered transactions
3. Click bulk action buttons (Delete, Category, Export)
4. Confirm your action in the dialog

### Managing Budget
1. Navigate to Budget section
2. Set your monthly budget
3. Track spending progress with visual indicators
4. View top spending categories

### Exchange Rates
1. Navigate to Rates section
2. Click "Update Rates" to fetch latest rates
3. All transactions automatically convert to IDR

### Data Export/Import
1. Go to Settings or Data Controls
2. Click "Export Data" to download JSON backup
3. Click "Import Data" to restore from backup

## 🔧 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run verify       # Verify all files exist
```

## 📁 Project Structure

```
personal-finance-manager/
├── src/
│   ├── app/                 # Next.js App Router pages
│   ├── components/          # React components
│   │   ├── ui/             # Base UI components (shadcn/ui)
│   │   └── ...             # Feature components
│   ├── constants/          # Application constants
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── stores/             # Zustand state management
│   └── types/              # TypeScript type definitions
├── public/                 # Static assets
├── docs/                   # Documentation
└── ...config files
```

## 🐛 Troubleshooting

### TypeScript Errors
```bash
npm install  # Install all dependencies
```

### Build Errors
Ensure Node.js version:
```bash
node --version  # Should be >= 18
```

### Missing Dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🔒 Privacy

All data is stored locally in your browser's localStorage. No data is sent to any server. Your financial information stays completely private.

---
