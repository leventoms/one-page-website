import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdminRole, AdminRequiredError, AuthRequiredError } from '@/platform/auth';
import { ADMIN_NAV } from '@/platform/admin-nav';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdminRole();
  } catch (err) {
    if (err instanceof AuthRequiredError) {
      redirect('/login?next=/admin');
    }
    if (err instanceof AdminRequiredError) {
      // Non-admin — middleware handles 404 at the edge; this is defence-in-depth
      redirect('/');
    }
    throw err;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0a0a0c', color: '#e5e7eb' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220,
        flexShrink: 0,
        borderRight: '1px solid #1f2937',
        padding: '1.5rem 0',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
      }}>
        <div style={{
          padding: '0 1.25rem 1.25rem',
          borderBottom: '1px solid #1f2937',
          marginBottom: '0.5rem',
        }}>
          <span style={{
            fontSize: '0.75rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            color: '#6b7280',
            textTransform: 'uppercase',
          }}>
            Admin
          </span>
        </div>
        {ADMIN_NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.875rem',
              color: '#d1d5db',
              textDecoration: 'none',
              borderRadius: 4,
              margin: '0 0.5rem',
            }}
          >
            {item.label}
          </Link>
        ))}
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '2rem', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
