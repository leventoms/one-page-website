import { getSupabaseServerClient } from '@/lib/supabase';

export interface AuditEntry {
  adminId: string;
  action: string;       // e.g. 'disable_order', 'dismiss_report', 'suspend_subscription'
  targetType: string;   // 'order' | 'report' | 'subscription' | 'manual_request'
  targetId: string;
  details?: Record<string, unknown>;
}

/**
 * Writes an admin action to the audit log.
 * NEVER throws — failures are logged internally so audit errors
 * never block the primary action.
 */
export async function audit(entry: AuditEntry): Promise<void> {
  try {
    const supabase = getSupabaseServerClient();
    const { error } = await supabase.from('admin_actions').insert({
      admin_id: entry.adminId,
      action: entry.action,
      target_type: entry.targetType,
      target_id: entry.targetId,
      details: entry.details ?? null,
    });

    if (error) {
      console.error('[audit] Failed to write audit log:', error.message, entry);
    }
  } catch (err) {
    console.error('[audit] Unexpected error writing audit log:', err, entry);
  }
}
