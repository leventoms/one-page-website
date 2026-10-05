import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { requireAdminRole, AdminRequiredError, AuthRequiredError } from '@/platform/auth';
import { ADMIN_NAV } from '@/platform/admin-nav';
import './admin.css';

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
    <div className="sp-admin">
      <div className="sp-admin-shell">
        <aside className="sp-admin-sidebar">
          <Link href="/" className="sp-admin-brand"><span className="sp-admin-brand-mark" />surprise pages</Link>
          <span className="sp-admin-kicker">Workspace</span>
          <nav className="sp-admin-nav" aria-label="Admin navigation">
            {ADMIN_NAV.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
          </nav>
          <div className="sp-admin-sidebar-foot">
            <Link href="/">View site</Link>
            <Link href="/auth/signout">Sign out</Link>
          </div>
        </aside>
        <main className="sp-admin-main">{children}</main>
      </div>
    </div>
  );
}
