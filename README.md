# Personal Finance Manager

A modern, full-stack Personal Finance Management web application. Still to be updated. To find out where your money is going...

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Verify Installation (Optional)
```bash
npm run verify
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

## ✨ Features

- ✅ Track income and expenses with customizable categories
- ✅ **Multi-currency support (IDR, USD, SGD, GBP, EUR, JPY, AUD, CNY)**
- ✅ **Real-time exchange rates with automatic IDR conversion**
- ✅ View financial summaries (income, expenses, balance)
- ✅ Visualize trends with 6-month charts
- ✅ Paginated transaction list
- ✅ Category management with color coding
- ✅ Simulation mode for financial projections (non-persistent)
- ✅ Data import/export as JSON for backup
- ✅ Fully client-side with localStorage persistence
- ✅ Responsive design with Shadcn/UI components
- ✅ Form validation with Zod
- ✅ Toast notifications

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/UI
- **State Management**: Zustand (with localStorage persistence)
- **Form Handling**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Date Handling**: date-fns
- **Icons**: Lucide React

## 🎯 Usage

### Adding Transactions
1. Select transaction type (Income/Expense)
2. Enter amount, category, date, and description
3. Click "Add Transaction"

### Managing Categories
1. Click "Manage Categories" button
2. Add new categories with custom colors
3. Delete categories (removes associated transactions)

### Simulation Mode
1. Switch to "Simulation" tab
2. Click "Start Simulation" to load current data
3. Add projected transactions
4. View projected finances
5. Reset to clear simulation data

### Data Backup
1. Click "Export Data" to download JSON backup
2. Click "Import Data" to restore from backup

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run verify` - Verify all files exist

## 🌐 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel
```

### Netlify
- Build command: `npm run build`
- Publish directory: `.next`

### Other Platforms
- Requires Node.js 18+
- Run `npm install && npm run build`
- Start with `npm start`

## 📝 Notes

- **Data Storage**: All data is stored in browser localStorage
- **First Run**: Application pre-populates with default categories
- **Simulation Mode**: Uses separate non-persistent store
- **No Backend**: Fully client-side application
- **No Authentication**: Single-user application

## 🔒 Privacy

- All data stays in your browser
- No data sent to external servers
- No tracking or analytics
- Export your data anytime

## 🐛 Troubleshooting

### TypeScript Errors Before Installation
Run `npm install` to install all dependencies and resolve type errors.

### Build Errors
Ensure you're using Node.js 18 or higher:
```bash
node --version
```

### Missing Dependencies
If you see missing module errors:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📄 License

This project is open source and available for personal and commercial use.

## ⚡ Performance

- Optimized with Next.js App Router
- Client-side rendering for instant interactions
- Minimal bundle size with tree-shaking
- Fast localStorage operations

## 🎨 Customization

- Modify colors in `tailwind.config.ts`
- Add new categories in the UI
- Extend transaction types in `src/types/index.ts`
- Customize charts in `src/components/FinanceChart.tsx`

---
