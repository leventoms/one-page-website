import Link from 'next/link';
import { requireUser } from '@/platform/auth';
import { getOrdersForOwner } from '@/lib/orders';

export const metadata = { title: 'My pages — Surprise Pages', robots: { index: false } };

function statusLabel(status: string) {
  return status === 'published' ? 'Live' : status === 'previewing' ? 'Payment started' : 'Draft';
}

export default async function AccountPage() {
  const user = await requireUser();
  const orders = await getOrdersForOwner(user.id);

  return (
    <section className="sp-builder">
      <div className="sp-wrap" style={{ maxWidth: '900px', paddingTop: '2rem' }}>
        <header className="sp-builder-intro" style={{ maxWidth: '44rem', marginBottom: '2rem' }}>
          <span className="sp-eyebrow">your account</span>
          <h1>Your surprise pages</h1>
          <p className="lede">Signed in as {user.email}. Pages you create while signed in will appear here.</p>
        </header>

        {orders.length ? (
          <div style={{ display: 'grid', gap: '14px' }}>
            {orders.map((order) => (
              <article key={order.id} className="sp-form" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '16px', flexWrap: 'wrap' }}>
                  <div>
                    <span className="sp-eyebrow">{order.config.tier.replace('tier', 'tier ')}</span>
                    <h2 style={{ fontSize: '1.35rem', marginTop: '4px' }}>For {order.config.data.recipientName}</h2>
                    <p className="sp-form-note" style={{ marginTop: '6px' }}>Created {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="sp-account-status">{statusLabel(order.status)}</span>
                </div>
                {order.status === 'published' ? <Link href={`/p/${order.slug}`} className="sp-btn sp-btn-ghost" style={{ marginTop: '16px' }}>Open page</Link> : <p className="sp-form-note" style={{ marginTop: '16px' }}>This page is not live yet.</p>}
              </article>
            ))}
          </div>
        ) : (
          <div className="sp-form sp-form-done" style={{ maxWidth: '560px' }}>
            <div className="mark">✦</div><h3>No pages here yet</h3>
            <p>Create your next surprise while signed in and it will stay organised here.</p>
            <Link href="/builder" className="sp-btn sp-btn-red" style={{ marginTop: '18px' }}>Create a page</Link>
          </div>
        )}
      </div>
    </section>
  );
}
