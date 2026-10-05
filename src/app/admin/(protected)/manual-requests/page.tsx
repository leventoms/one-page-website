import { getSupabaseServerClient } from '@/lib/supabase';

export default async function AdminManualRequestsPage() {
  const { data, error } = await getSupabaseServerClient()
    .from('manual_requests')
    .select('id, tier, recipient_name, contact_email, sender_name, occasion, status, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  if (error) throw new Error(`Could not load manual requests: ${error.message}`);

  return (
    <div>
      <header className="sp-admin-pagehead"><div><span className="sp-admin-eyebrow">Concierge</span><h1>Manual requests</h1><p className="sp-admin-subtitle">The latest requests from people who want your help creating something special.</p></div></header>
      {data?.length ? (
        <div className="sp-admin-card sp-admin-table-card"><div className="sp-admin-table-wrap"><table className="sp-admin-table">
          <thead><tr>{['Tier', 'Recipient', 'Contact', 'From', 'Occasion', 'Status', 'Created'].map((heading) => <th key={heading}>{heading}</th>)}</tr></thead>
          <tbody>{data.map((item) => <tr key={item.id}>
            <td>{item.tier}</td><td>{item.recipient_name}</td><td>{item.contact_email}</td><td>{item.sender_name ?? '—'}</td>
            <td>{item.occasion ?? '—'}</td><td><span className="sp-admin-status">{item.status}</span></td><td>{new Date(item.created_at).toLocaleString()}</td>
          </tr>)}</tbody>
        </table></div></div>
      ) : <div className="sp-admin-card sp-admin-empty">No manual requests yet.</div>}
    </div>
  );
}
