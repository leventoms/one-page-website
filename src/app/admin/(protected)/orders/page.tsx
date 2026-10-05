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
      <header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Payments</span><h1>Orders</h1><p className="sp-admin-subtitle">Your 100 most recent orders, newest first.</p></div></header>
      {data?.length ? (
        <div className="sp-admin-card sp-admin-table-card"><div className="sp-admin-table-wrap"><table className="sp-admin-table">
          <thead><tr>{['Slug', 'Status', 'Price', 'Created', 'Paid'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
          <tbody>{data.map((order) => <tr key={order.id}>
            <td><code>{order.slug}</code></td><td><span className="sp-admin-status">{order.status}</span></td>
            <td>₹{(order.price_in_paise / 100).toFixed(2)}</td><td>{new Date(order.created_at).toLocaleString()}</td><td>{order.paid_at ? new Date(order.paid_at).toLocaleString() : '—'}</td>
          </tr>)}</tbody>
        </table></div></div>
      ) : <div className="sp-admin-card sp-admin-empty">No orders yet.</div>}
    </div>
  );
}
