# 🏛️ Core Architecture (The Source of Truth)

**Project:** Personal Finance Manager
**Target Users:** 20-30 people
**Goal:** Cross-device sync, data safety against browser resets, simple to use.

---

## 🛠️ 1. The Stack

- **Frontend:** Next.js 14 (App Router)
- **UI:** Tailwind CSS + Shadcn UI
- **State:** Zustand (UI caching & optimistic updates)
- **Backend & Database:** Supabase (Auth + PostgreSQL)

---

## 🗄️ 2. Database Schema (Supabase)

We follow the **YAGNI (You Aren't Gonna Need It)** principle. Keep tables to an absolute minimum.

### A. `users` (Managed by Supabase Auth)

Handles login/registration automatically. We don't touch this directly.

### B. `transactions`

The main table storing every income and expense.

- `id`: `UUID` (Primary Key)
- `user_id`: `UUID` (Foreign Key -> `auth.users`)
- `type`: `VARCHAR` ('income' | 'expense')
- `amount`: `NUMERIC`
- `category`: `VARCHAR`
- `description`: `TEXT`
- `date`: `TIMESTAMP WITH TIME ZONE`
- `currency`: `VARCHAR` (Default 'IDR')
- `created_at`: `TIMESTAMP WITH TIME ZONE` (Default `now()`)

### C. `user_preferences`

Instead of creating separate tables for custom categories, budgets, and themes, we dump them into a JSONB column to avoid unnecessary joins and queries.

- `user_id`: `UUID` (Primary Key, Foreign Key -> `auth.users`)
- `settings`: `JSONB`
  - _Example payload:_ `{"theme": "dark", "monthly_budget": 5000000, "custom_categories": ["Gofood", "Netflix"]}`

---

## 📜 3. The Rules (Aturan Main)

1. **Source of Truth is Supabase:** `localStorage` is completely abandoned for core data. If a user clears their cache, they just log in again and everything is there.
2. **One Line Rules:** If we can query it directly in Supabase (like comparing this month vs last month's cashflow), do it in the query. Don't fetch everything and filter in Javascript.
3. **No Over-engineering:** Do not add Prisma, Drizzle, or heavy ORMs. Use the standard `@supabase/supabase-js` client. It's fast and direct.
4. **RLS (Row Level Security):** This is **CRITICAL**. Every table must have RLS enabled so `user_id = auth.uid()`. User A must never be able to read or modify User B's transactions.

---

_Note: Any major architectural changes must be updated in this document first._

Database password (Supabase): money-tracker-1
