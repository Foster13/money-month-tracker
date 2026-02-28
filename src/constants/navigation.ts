// File: src/constants/navigation.ts
import { ROUTES } from './routes';

export interface NavItem {
  name: string;
  icon: string;
  value: string;
  path: string;
}

export const NAV_ITEMS: NavItem[] = [
  { name: 'Home', icon: 'home', value: 'dashboard', path: ROUTES.HOME },
  { name: 'Income', icon: 'income', value: 'income', path: ROUTES.INCOME },
  { name: 'Expenses', icon: 'expenses', value: 'expenses', path: ROUTES.EXPENSES },
  { name: 'Budget', icon: 'budget', value: 'budget', path: ROUTES.BUDGET },
  { name: 'Rates', icon: 'rates', value: 'rates', path: ROUTES.RATES },
  { name: 'Sim', icon: 'simulation', value: 'simulation', path: ROUTES.SIMULATION },
  { name: 'Notes', icon: 'notes', value: 'notes', path: ROUTES.NOTES },
] as const;

export const PATH_TO_TAB_MAP: Record<string, string> = {
  [ROUTES.HOME]: 'dashboard',
  [ROUTES.INCOME]: 'income',
  [ROUTES.EXPENSES]: 'expenses',
  [ROUTES.BUDGET]: 'budget',
  [ROUTES.RATES]: 'rates',
  [ROUTES.SIMULATION]: 'simulation',
  [ROUTES.NOTES]: 'notes',
};

export const TAB_TO_PATH_MAP: Record<string, string> = {
  dashboard: ROUTES.HOME,
  income: ROUTES.INCOME,
  expenses: ROUTES.EXPENSES,
  budget: ROUTES.BUDGET,
  rates: ROUTES.RATES,
  simulation: ROUTES.SIMULATION,
  notes: ROUTES.NOTES,
};
