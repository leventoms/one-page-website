export interface AdminNavItem {
  label: string;
  href: string;
}

/**
 * Admin sidebar navigation registry.
 * Modules append their entries here. The admin layout reads this array
 * to render the sidebar — add a new entry here when adding a new admin page.
 */
export const ADMIN_NAV: AdminNavItem[] = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Orders', href: '/admin/orders' },
  { label: 'Manual requests', href: '/admin/manual-requests' },
  { label: 'Security', href: '/admin/security' },
];
