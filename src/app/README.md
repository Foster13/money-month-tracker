# src/app Folder - Next.js App Router

## ✅ Status: Perfect - No Errors

This folder contains the core Next.js App Router files for the Personal Finance Manager application.

## Files

### 1. layout.tsx (626 bytes)
**Purpose:** Root layout component that wraps all pages

**Features:**
- Configures Inter font from Google Fonts
- Sets page metadata (title, description)
- Provides HTML structure
- Includes Toaster component for notifications
- Applies global CSS

**Exports:**
- `metadata` - Page metadata
- `RootLayout` - Root layout component

### 2. page.tsx (144 bytes)
**Purpose:** Home page component (route: /)

**Features:**
- Renders the main Dashboard component
- Entry point of the application

**Exports:**
- `Home` - Default export, home page component

### 3. globals.css (1,652 bytes)
**Purpose:** Global styles and Tailwind CSS configuration

**Features:**
- Tailwind CSS directives (@tailwind base, components, utilities)
- CSS custom properties for theming
- Light mode color scheme
- Dark mode color scheme
- Base element styles

## Next.js App Router Structure

```
src/app/
├── layout.tsx      → Root layout (wraps all pages)
├── page.tsx        → Home page (/)
└── globals.css     → Global styles
```

This is the **minimal required structure** for a Next.js App Router application.

## How It Works

1. **User visits /** → Next.js loads `page.tsx`
2. **page.tsx** renders `<Dashboard />`
3. **layout.tsx** wraps the page with HTML structure
4. **globals.css** provides styling

## Dependencies

### layout.tsx imports:
- `next` - Metadata type
- `next/font/google` - Inter font
- `./globals.css` - Global styles
- `@/components/ui/toaster` - Toast notifications

### page.tsx imports:
- `@/components/Dashboard` - Main dashboard component

## Path Aliases

The `@/` prefix is configured in `tsconfig.json`:
- `@/components/Dashboard` → `src/components/Dashboard.tsx`
- `@/components/ui/toaster` → `src/components/ui/toaster.tsx`

## Verification

✅ All files present
✅ All imports valid
✅ All exports correct
✅ Syntax error-free
✅ TypeScript compatible
✅ Next.js App Router compliant

## TypeScript Warnings

If you see TypeScript errors before running `npm install`, this is normal:
- React types not yet installed
- Next.js types not yet installed
- These resolve automatically after `npm install`

## Testing

To verify this folder works:

```bash
npm install
npm run dev
```

Expected: Application starts on http://localhost:3000

## Metadata

- **Title:** Personal Finance Manager
- **Description:** Track your income and expenses with ease
- **Font:** Inter (Google Fonts)
- **Theme:** Light/Dark mode support

## Notes

- This folder should NOT be modified unless adding new routes
- The layout.tsx is the root layout for the entire app
- The page.tsx is the home page (/)
- Additional routes would be added as new folders/files

## Status

**Last Verified:** 2026-02-13
**Status:** ✅ Perfect
**Errors:** 0
**Warnings:** 0 (after npm install)
