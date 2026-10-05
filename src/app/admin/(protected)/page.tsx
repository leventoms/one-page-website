import { getSupabaseServerClient } from '@/lib/supabase';

async function getCount(table: string): Promise<number> {
  const supabase = getSupabaseServerClient();
  const { count } = await supabase
    .from(table)
    .select('*', { count: 'exact', head: true });
  return count ?? 0;
}

export default async function AdminDashboard() {
  const [ordersCount, manualRequestsCount] = await Promise.all([
    getCount('orders'),
    getCount('manual_requests'),
  ]);

  const cards = [
    { label: 'Total orders', value: ordersCount, href: '/admin/orders' },
    { label: 'Manual requests', value: manualRequestsCount, href: '/admin/manual-requests' },
  ];

  return (
    <div>
      <header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Overview</span><h1>Good to see you.</h1><p className="sp-admin-subtitle">A simple view of the pages and requests people have trusted you with.</p></div></header>
      <div className="sp-admin-stats">
        {cards.map((card) => (
          <a key={card.label} href={card.href} className="sp-admin-card sp-admin-stat">
            <div className="sp-admin-stat-value">{card.value}</div>
            <div className="sp-admin-stat-label">{card.label} →</div>
          </a>
        ))}
      </div>
    </div>
  );
}
