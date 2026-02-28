// File: src/constants/routes.ts
export const ROUTES = {
  HOME: '/',
  INCOME: '/income',
  EXPENSES: '/expenses',
  BUDGET: '/budget',
  RATES: '/rates',
  SIMULATION: '/simulation',
  NOTES: '/notes',
  ICONS_PREVIEW: '/icons-preview',
} as const;

export const ROUTE_TITLES = {
  [ROUTES.HOME]: 'Dashboard',
  [ROUTES.INCOME]: 'Income',
  [ROUTES.EXPENSES]: 'Expenses',
  [ROUTES.BUDGET]: 'Budget',
  [ROUTES.RATES]: 'Exchange Rates',
  [ROUTES.SIMULATION]: 'Simulation Mode',
  [ROUTES.NOTES]: 'Notes',
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = typeof ROUTES[RouteKey];
