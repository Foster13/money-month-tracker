# 💰 Money Month Tracker

A simple, fast Personal Finance Manager built with Next.js 14 and Supabase.

`ponytail: YAGNI. No bloated docs, no over-engineered state. Supabase is the single source of truth.`

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🛠️ Tech Stack

- **Next.js 14 (App Router)** - Server components for performance
- **Supabase** - Auth, DB, and RLS (Single Source of Truth)
- **Tailwind CSS + shadcn/ui** - Minimalist styling
- **Zustand** - For lightweight UI state only (no heavy client-side data syncing)

## 🆕 Recent Updates (v0.2.1)

- **Native Platform Features**: Switched to `crypto.randomUUID()` for generating simulation IDs.
- **YAGNI Cleanup**: Removed unused `jspdf` typings and obsolete Zustand persist middleware imports.
- **Supabase Integration**: Migrated from local storage to Supabase for reliable cross-device sync.
- **Supabase Auth**: Secure user login with Row Level Security (RLS).
- **API Proxy**: Built-in proxy route to bypass aggressive adblockers blocking Supabase requests.
- **Responsive Sidebar**: Clean navigation that works everywhere.
- **Dead Code Eliminated**: Removed unused hooks, test pages, and heavy docs. YAGNI.

## 💡 Developer Guidelines (Ponytail Mode)

1. **Source of Truth is Supabase:** No `localStorage` for core data. Query the DB.
2. **YAGNI:** Build the minimum that works. No over-engineering.
3. **Strict RLS:** Data privacy is handled entirely by PostgreSQL RLS.
4. **Lean Client:** Let the server (and Postgres) do the heavy lifting.
