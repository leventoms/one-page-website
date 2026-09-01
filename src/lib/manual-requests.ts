import { getSupabaseServerClient } from '@/lib/supabase';
import { notifyManualRequest } from '@/lib/email';
import type { ManualRequest, ManualRequestInput } from '@/types';

interface ManualRequestRow {
  id: string;
  tier: ManualRequest['tier'];
  recipient_name: string;
  contact_email: string;
  sender_name: string | null;
  occasion: string | null;
  message: string | null;
  notes: string | null;
  status: ManualRequest['status'];
  created_at: string;
}

function toManualRequest(row: ManualRequestRow): ManualRequest {
  return {
    id: row.id, tier: row.tier, recipientName: row.recipient_name, contactEmail: row.contact_email,
    senderName: row.sender_name ?? undefined, occasion: row.occasion ?? undefined,
    message: row.message ?? undefined, notes: row.notes ?? undefined,
    status: row.status, createdAt: row.created_at,
  };
}

export async function submitManualRequest(input: ManualRequestInput): Promise<ManualRequest> {
  const { data, error } = await getSupabaseServerClient()
    .from('manual_requests')
    .insert({
      tier: input.tier, recipient_name: input.recipientName, contact_email: input.contactEmail,
      sender_name: input.senderName ?? null, occasion: input.occasion ?? null,
      message: input.message ?? null, notes: input.notes ?? null, status: 'new',
    })
    .select()
    .single<ManualRequestRow>();

  if (error || !data) throw new Error(`Failed to create manual request: ${error?.message ?? 'unknown error'}`);

  const request = toManualRequest(data);
  try {
    await notifyManualRequest(request);
  } catch (err) {
    console.error('Failed to notify about new manual request', request.id, err);
  }
  return request;
}
