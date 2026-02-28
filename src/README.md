# Source Code Structure

## Overview
This directory contains all the source code for the Personal Finance Manager application, organized following best practices for React and Next.js applications.

## Directory Structure

```
src/
├── app/                    # Next.js App Router pages
├── components/             # React components
├── constants/              # Application constants
├── hooks/                  # Custom React hooks
├── lib/                    # Utility functions and helpers
├── stores/                 # Zustand state management
└── types/                  # TypeScript type definitions
```

## Detailed Structure

### `/app` - Next.js Pages
Application routes and pages using Next.js App Router.

```
app/
├── layout.tsx              # Root layout with providers
├── page.tsx                # Home page (Dashboard)
├── globals.css             # Global styles
├── income/page.tsx         # Income page
├── expenses/page.tsx       # Expenses page
├── budget/page.tsx         # Budget page
├── rates/page.tsx          # Exchange rates page
├── simulation/page.tsx     # Simulation mode page
└── icons-preview/page.tsx  # Icon showcase page
```

### `/components` - React Components
Reusable UI components organized by feature.

```
components/
├── ui/                     # Base UI components (shadcn/ui)
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── icons/                  # Icon components
│   └── Icon.tsx
├── Dashboard.tsx           # Main dashboard component
├── FloatingNavbar.tsx      # Navigation bar
├── Summary.tsx             # Financial summary
├── TransactionForm.tsx     # Transaction input form
├── TransactionList.tsx     # Transaction list display
├── IncomeSection.tsx       # Income page content
├── ExpensesSection.tsx     # Expenses page content
├── BudgetSection.tsx       # Budget page content
├── FinanceChart.tsx        # Chart visualization
├── CategoryManager.tsx     # Category management
├── DataControls.tsx        # Import/Export controls
├── ExchangeRateDisplay.tsx # Currency rates display
├── SimulationMode.tsx      # Simulation mode
├── InstallPWA.tsx          # PWA install prompt
├── AnimatedThemeToggle.tsx # Theme switcher
├── GradientBackground.tsx  # Animated background
├── ThemeTransition.tsx     # Theme transition effect
├── theme-provider.tsx      # Theme context provider
└── theme-toggle.tsx        # Theme toggle button
```

### `/constants` - Application Constants
Centralized constants for consistency and maintainability.

```
constants/
├── routes.ts               # Route definitions
├── navigation.ts           # Navigation items and mappings
├── theme.ts                # Theme colors and gradients
└── index.ts                # Barrel export
```

**Usage:**
```typescript
import { ROUTES, NAV_ITEMS, THEME_COLORS } from '@/constants';
```

### `/hooks` - Custom React Hooks
Reusable logic extracted into custom hooks.

```
hooks/
├── use-toast.ts            # Toast notifications
├── useNavigation.ts        # Navigation logic
├── useTransactions.ts      # Transaction operations
└── index.ts                # Barrel export
```

**Usage:**
```typescript
import { useNavigation, useTransactions } from '@/hooks';
```

### `/lib` - Utility Functions
Pure functions for common operations.

```
lib/
├── utils.ts                # General utilities
├── currency.ts             # Currency operations
├── date.ts                 # Date manipulation
├── calculations.ts         # Financial calculations
├── schemas.ts              # Validation schemas
└── index.ts                # Barrel export
```

**Usage:**
```typescript
import { 
  calculateTotalIncome, 
  formatCurrency, 
  getCurrentMonthTransactions 
} from '@/lib';
```

### `/stores` - State Management
Zustand stores for global state.

```
stores/
├── transactionStore.ts     # Main transaction state
└── simulationStore.ts      # Simulation mode state
```

**Usage:**
```typescript
import { useTransactionStore } from '@/stores/transactionStore';
```

### `/types` - TypeScript Types
Type definitions for the application.

```
types/
├── index.ts                # Main type definitions
└── jspdf-autotable.d.ts    # Third-party type declarations
```

**Usage:**
```typescript
import type { Transaction, Category, Currency } from '@/types';
```

## Import Aliases

The application uses TypeScript path aliases for cleaner imports:

```typescript
// Instead of: import { Button } from '../../../components/ui/button'
import { Button } from '@/components/ui/button';

// Instead of: import { ROUTES } from '../../../constants/routes'
import { ROUTES } from '@/constants';

// Instead of: import { calculateBalance } from '../../../lib/calculations'
import { calculateBalance } from '@/lib';
```

## Code Organization Principles

### 1. Separation of Concerns
- **Components**: UI and presentation logic
- **Hooks**: Reusable stateful logic
- **Lib**: Pure utility functions
- **Stores**: Global state management
- **Constants**: Configuration and static data

### 2. Single Responsibility
Each file/function has one clear purpose:
- ✅ `calculateTotalIncome()` - Calculate income
- ✅ `useNavigation()` - Handle navigation
- ✅ `TransactionForm` - Display transaction form

### 3. DRY (Don't Repeat Yourself)
Common logic is extracted and reused:
- Calculations in `/lib/calculations.ts`
- Navigation logic in `useNavigation` hook
- Constants in `/constants`

### 4. Type Safety
TypeScript types ensure correctness:
- All functions have proper types
- Props are typed
- State is typed

## Best Practices

### Component Structure
```typescript
// 1. Imports
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks';

// 2. Types
interface MyComponentProps {
  title: string;
  onSave: () => void;
}

// 3. Component
export function MyComponent({ title, onSave }: MyComponentProps) {
  // 4. Hooks
  const [value, setValue] = useState('');
  const { transactions } = useTransactions();

  // 5. Handlers
  const handleClick = () => {
    // ...
  };

  // 6. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

### Hook Structure
```typescript
// 1. Imports
import { useState, useEffect } from 'react';

// 2. Hook
export function useMyHook() {
  // 3. State
  const [data, setData] = useState(null);

  // 4. Effects
  useEffect(() => {
    // ...
  }, []);

  // 5. Return
  return { data, setData };
}
```

### Utility Function Structure
```typescript
// 1. JSDoc comment
/**
 * Calculate total income from transactions
 * @param transactions - Array of transactions
 * @param exchangeRates - Currency exchange rates
 * @returns Total income in IDR
 */
export function calculateTotalIncome(
  transactions: Transaction[],
  exchangeRates: Record<Currency, number>
): number {
  // 2. Implementation
  return transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + convertToIDR(t.amount, t.currency, exchangeRates), 0);
}
```

## Testing Strategy

### Unit Tests
- Test utility functions in `/lib`
- Test custom hooks in `/hooks`
- Test calculations and transformations

### Integration Tests
- Test component interactions
- Test store operations
- Test form submissions

### E2E Tests
- Test user workflows
- Test navigation
- Test data persistence

## Performance Considerations

### Code Splitting
- Pages are automatically code-split by Next.js
- Large components can be lazy-loaded

### Memoization
- Use `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Use `React.memo` for pure components

### Bundle Size
- Import only what you need
- Use tree-shaking friendly imports
- Monitor bundle size with `npm run build`

## Development Workflow

### Adding a New Feature
1. Define types in `/types`
2. Add constants in `/constants`
3. Create utility functions in `/lib`
4. Create custom hooks in `/hooks`
5. Build components in `/components`
6. Add pages in `/app`

### Modifying Existing Code
1. Check if constants need updating
2. Update utility functions if needed
3. Modify hooks if logic changes
4. Update components
5. Test thoroughly

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## Contributing

When contributing to this codebase:
1. Follow the existing structure
2. Use TypeScript types
3. Write clear comments
4. Keep functions small and focused
5. Test your changes
6. Update documentation

## Questions?

If you have questions about the code structure or organization, please refer to:
- `/docs/REFACTORING_SUMMARY.md` - Refactoring details
- `/docs/ICONS_UPDATE.md` - Icon system
- `/docs/PWA_OFFLINE_SUPPORT.md` - PWA features
