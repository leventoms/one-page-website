export interface RouteGuard {
  prefix: string;
  role: 'user' | 'admin';
}

/**
 * Maps URL path prefixes to the minimum role required to access them.
 * Middleware reads this file — add a new entry here when adding a new
 * protected area; never edit middleware.ts directly for route changes.
 */
export const PROTECTED_ROUTES: RouteGuard[] = [
  { prefix: '/account', role: 'user' },
  { prefix: '/mature', role: 'user' },
  { prefix: '/admin', role: 'admin' },
];
