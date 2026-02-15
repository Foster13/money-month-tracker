# 💖 Personal Finance Manager

A beautiful, modern Personal Finance Management web application with soft pastel pink theme. Track your income, expenses, and budget with style! ✨

## 🌟 Live Demo

**Ready to deploy!** See [DEPLOY.md](DEPLOY.md) for quick deployment guide.

## ✨ Features

### 💰 Financial Tracking
- ✅ Track income and expenses with customizable categories
- ✅ **Multi-currency support (IDR, USD, SGD, GBP, EUR, JPY, AUD, CNY)**
- ✅ **Real-time exchange rates with automatic IDR conversion**
- ✅ View financial summaries (income, expenses, balance)
- ✅ Visualize trends with 6-month bar charts

### 🎯 Advanced Features
- ✅ **Dedicated Income & Expenses sections with 6 sorting options**
- ✅ **Budget tracking with progress monitoring**
- ✅ **Top 3 categories analysis**
- ✅ **Latest transactions overview**
- ✅ Simulation mode for financial projections
- ✅ Data import/export as JSON for backup
- ✅ Category management with color coding

### 🎨 Beautiful Design
- ✅ **Soft pastel pink theme (cute & attractive)**
- ✅ **Dark mode support with smooth toggle**
- ✅ **Glassmorphism effects**
- ✅ **Smooth animations and transitions**
- ✅ **Fully responsive (mobile, tablet, desktop)**
- ✅ Modern UI with Shadcn/UI components

### 🔧 Technical Features
- ✅ Fully client-side with localStorage persistence
- ✅ Form validation with Zod
- ✅ Toast notifications
- ✅ No backend required
- ✅ PWA-ready

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open Browser
Navigate to [http://localhost:3000](http://localhost:3000)

### 4. Start Tracking! 💖
- Add your first transaction
- Set your monthly budget
- Explore all 6 sections

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
- **Theme**: next-themes

## 📱 Navigation

The app features 6 main sections:

1. **🏠 Home** - Dashboard overview with summary cards and 6-month chart
2. **💰 Income** - Dedicated income view with sorting options
3. **💸 Expenses** - Dedicated expenses view with sorting options
4. **💝 Budget** - Monthly budget tracking with insights
5. **💱 Rates** - Exchange rates management
6. **🎯 Sim** - Financial simulation mode

### Sorting Options (Income & Expenses)
- 📅 Newest First / Oldest First
- 💵 Highest Amount / Lowest Amount
- 🏷️ By Category
- 🔤 Alphabetical

### Budget Section Features
- Set monthly budget with inline editing
- Progress bar with color warnings (purple → orange → red)
- Quick stats (Income, Expenses, Balance)
- Top 3 categories by transaction count
- Latest 5 transactions

## 🎯 Usage

### Adding Transactions
1. Go to 🏠 Home tab
2. Fill in the transaction form
3. Select type (Income/Expense), amount, category, date
4. Click "Add Transaction"

### Managing Budget
1. Go to 💝 Budget tab
2. Click edit icon to set monthly budget
3. Monitor progress bar and spending
4. Review top categories and latest transactions

### Viewing Income/Expenses
1. Go to 💰 Income or 💸 Expenses tab
2. Use sort dropdown to organize transactions
3. View totals and transaction counts
4. Review spending patterns

### Managing Categories
1. Click "Manage Categories" button (top right)
2. Add new categories with custom colors
3. Delete categories (removes associated transactions)

### Exchange Rates
1. Go to 💱 Rates tab
2. Click "Update Rates" for latest rates
3. All amounts auto-convert to IDR

### Simulation Mode
1. Go to 🎯 Sim tab
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

### Quick Deploy to Vercel (Recommended) ⭐

```bash
# Push to GitHub
git init
git add .
git commit -m "Personal Finance Manager"
git push

# Deploy
npm i -g vercel
vercel
```

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Click "Deploy"
4. Done! 🎉

### Other Platforms

**Netlify:**
- Build command: `npm run build`
- Publish directory: `.next`

**Railway / Render:**
- Auto-detects Next.js
- One-click deploy

**Self-Hosted:**
- Requires Node.js 18+
- Run `npm install && npm run build && npm start`

📖 **Full deployment guide:** [docs/DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md)
📋 **Quick guide:** [DEPLOY.md](DEPLOY.md)

## � Documentation

- 📖 [Full Documentation Index](docs/INDEX.md)
- 🚀 [Quick Deployment Guide](DEPLOY.md)
- 🌐 [Complete Deployment Guide](docs/DEPLOYMENT_GUIDE.md)
- 🧭 [Navigation & Features](docs/NAVIGATION_FEATURES.md)
- 🎨 [Pink Theme Guide](docs/PINK_THEME.md)
- 💱 [Currency Features](docs/CURRENCY_FEATURE.md)
- 🌙 [Dark Mode Guide](docs/DARKMODE_FEATURE.md)
- 📱 [Responsive Design](docs/RESPONSIVE_DESIGN.md)
- ✨ [Animations Guide](docs/ANIMATIONS_FEATURE.md)
- 🔮 [Glassmorphism Effects](docs/GLASSMORPHISM_FEATURE.md)

## 📝 Notes

- **Data Storage**: All data is stored in browser localStorage
- **First Run**: Application pre-populates with default categories
- **Simulation Mode**: Uses separate non-persistent store
- **No Backend**: Fully client-side application
- **No Authentication**: Single-user application
- **Privacy First**: All data stays in your browser
- **Multi-Device**: Export/import to sync between devices

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

## 🎨 Customization

### Theme Colors
Modify `src/app/globals.css` to change the pink theme:
```css
:root {
  --primary: 340 82% 67%; /* Main pink color */
  --secondary: 320 70% 95%; /* Light pink */
  /* ... more colors */
}

---
