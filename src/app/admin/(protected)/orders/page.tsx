import { getSupabaseServerClient } from '@/lib/supabase';

export default async function AdminOrdersPage() {
  const { data, error } = await getSupabaseServerClient()
    .from('orders')
    .select('id, slug, status, price_in_paise, created_at, paid_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error(`Could not load orders: ${error.message}`);

  return (
    <div>
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Orders</h1>
      {data?.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr>{['Slug', 'Status', 'Price', 'Created', 'Paid'].map((heading) => <th key={heading} style={cellStyle}>{heading}</th>)}</tr></thead>
          <tbody>{data.map((order) => <tr key={order.id}>
            <td style={cellStyle}>{order.slug}</td><td style={cellStyle}>{order.status}</td>
            <td style={cellStyle}>₹{(order.price_in_paise / 100).toFixed(2)}</td>
            <td style={cellStyle}>{new Date(order.created_at).toLocaleString()}</td>
            <td style={cellStyle}>{order.paid_at ? new Date(order.paid_at).toLocaleString() : '—'}</td>
          </tr>)}</tbody>
        </table>
      ) : <p style={{ color: '#9ca3af' }}>No orders yet.</p>}
    </div>
  );
}

const cellStyle = { textAlign: 'left' as const, padding: '0.75rem', borderBottom: '1px solid #1f2937' };
