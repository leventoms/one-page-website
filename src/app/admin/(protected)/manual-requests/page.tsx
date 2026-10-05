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
      <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Manual requests</h1>
      {data?.length ? (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead><tr>{['Tier', 'Recipient', 'Contact', 'From', 'Occasion', 'Status', 'Created'].map((heading) => <th key={heading} style={cellStyle}>{heading}</th>)}</tr></thead>
          <tbody>{data.map((item) => <tr key={item.id}>
            <td style={cellStyle}>{item.tier}</td><td style={cellStyle}>{item.recipient_name}</td>
            <td style={cellStyle}>{item.contact_email}</td><td style={cellStyle}>{item.sender_name ?? '—'}</td>
            <td style={cellStyle}>{item.occasion ?? '—'}</td><td style={cellStyle}>{item.status}</td>
            <td style={cellStyle}>{new Date(item.created_at).toLocaleString()}</td>
          </tr>)}</tbody>
        </table>
      ) : <p style={{ color: '#9ca3af' }}>No manual requests yet.</p>}
    </div>
  );
}

const cellStyle = { textAlign: 'left' as const, padding: '0.75rem', borderBottom: '1px solid #1f2937' };
