# 💰 Money Month Tracker (Personal Finance Manager)

A modern, offline-first Personal Finance Management web application built with Next.js 14. Track your income, expenses, and budget with an intuitive interface and powerful features!

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🛠️ Tech Stack

- **Core**: Next.js 14 (App Router), React 18, TypeScript (strict mode)
- **Styling**: Tailwind CSS v3, CSS Variables (HSL), shadcn/ui
- **State Management**: Zustand (Optimistic UI, directly syncs to Supabase)
- **Backend & Auth**: Supabase (PostgreSQL + RLS)
- **PWA**: `next-pwa` with Workbox caching strategies
- **Testing**: Vitest + React Testing Library

## 🏗️ Architecture & Data Flow

### Authentication & Initialization

1. `AuthGuard` checks session via `supabase.auth.getSession()`.
2. Unauthenticated users see the Login/Register form.
3. Authenticated users trigger `fetchData()` in `StoreInitializer` to load data from Supabase.

### State & Optimistic UI

The app uses Zustand for state management (`transactionStore.ts`), bypassing localStorage persistence to rely directly on Supabase.

- **Optimistic Updates**: Actions (add/update/delete) instantly update the local UI state before the server responds.
- **Background Sync**: Changes are asynchronously pushed to Supabase.

### Database Schema (Supabase)

Both tables use Row Level Security (RLS) `USING (auth.uid() = user_id)` to ensure data privacy.

- **`transactions`**: `id` (UUID), `user_id`, `type`, `amount`, `category` (stores `categoryId` string), `description`, `date`, `currency`.
- **`user_preferences`**: `user_id`, `settings` (JSONB: categories, exchange rates).

## 📁 Routing & Key Components

| Route / Component       | Description                                                                  |
| ----------------------- | ---------------------------------------------------------------------------- |
| `/`                     | Dashboard with Summary widgets, `FinanceChart` (Recharts), and DataControls. |
| `/income` & `/expenses` | Dedicated transaction management lists with filtering.                       |
| `/budget`               | Monthly budget tracking and usage visualization.                             |
| `/rates`                | Exchange rate synchronization (fetch from `open.er-api.com`).                |
| `/simulation`           | Sandbox mode powered by a separate, non-persistent `simulationStore`.        |
| `useTransactionFilters` | Engine for searching by text, amount range, date range, and categories.      |

## 🎨 Design System & PWA

- **Theme**: Pink pastel base (`HSL 340 82% 67%`). Fully supports Dark Mode.
- **Design Tokens**: Centralized in `src/constants/design-tokens.ts` and consumed by Tailwind.
- **Animations**: Uses custom spring easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- **Offline-first**: Service workers cache fonts, images, and JSON data. App is fully installable via `InstallPWA` prompt.

## 💡 Developer Guidelines (Ponytail Principles)

This project embraces a "lazy senior dev" (YAGNI) philosophy, marked by `// ponytail:` comments in the codebase.
**Target Users:** ~20-30 people. Focus on cross-device sync and data safety against browser resets.

**The Rules (Aturan Main):**

1. **Source of Truth is Supabase:** We do not use `localStorage` for core data. If a cache clears, users just log in again.
2. **No Heavy ORMs:** No Prisma or Drizzle. Use standard `@supabase/supabase-js` for speed and simplicity.
3. **One Line Rules:** If we can query/compute it directly in Supabase (like comparing cashflows), do it there. Don't fetch everything and filter in Javascript.
4. **Strict RLS:** Row Level Security is CRITICAL. `user_id = auth.uid()` must be strictly enforced.
5. **No bloat**: Use native HTML5 validation over heavy schemas where appropriate (e.g., Auth).
6. **Native features**: Client-side avatar compression uses the native Canvas API, avoiding heavy image manipulation libraries.
7. **Simplification**: One-line Supabase initialization. JSONB column used for user preferences to avoid table joins.
8. **Performance**: Heavy libraries (`lucide-react`, `recharts`, `date-fns`) are explicitly tree-shaken in `next.config.js`.

---

_Run `npm run verify` before committing to ensure all required files and build steps pass._
