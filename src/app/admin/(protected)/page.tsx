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
      <h1 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 700 }}>Dashboard</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        gap: '1rem',
      }}>
        {cards.map((card) => (
          <a
            key={card.label}
            href={card.href}
            style={{
              display: 'block',
              background: '#1a1a1e',
              padding: '1.5rem',
              borderRadius: 12,
              border: '1px solid #1f2937',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#ff7a45' }}>{card.value}</div>
            <div style={{ fontSize: '0.875rem', color: '#9ca3af', marginTop: '0.25rem' }}>{card.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
