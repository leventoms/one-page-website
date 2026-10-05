import { getSupabaseServerClient } from '@/lib/supabase';

/**
 * Table-based sliding-window rate limiter.
 * Returns true if the caller is within the limit, false if exceeded.
 * Fails open (returns true) on any database error to avoid blocking legitimate traffic.
 *
 * @param key           Unique identifier (e.g. 'report:1.2.3.4')
 * @param limit         Max requests allowed in the window
 * @param windowSeconds Window duration in seconds
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): Promise<boolean> {
  const now = Math.floor(Date.now() / 1000);
  const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
  const supabase = getSupabaseServerClient();

  try {
    // Read the current count for this key + window
    const { data: existing } = await supabase
      .from('rate_limit_buckets')
      .select('count')
      .eq('key', key)
      .eq('window_start', windowStart)
      .maybeSingle();

    if (!existing) {
      // No bucket yet — insert with count=1 (first request in this window)
      await supabase
        .from('rate_limit_buckets')
        .insert({ key, window_start: windowStart, count: 1 });
      return true;
    }

    const newCount = existing.count + 1;

    if (newCount > limit) return false;

    await supabase
      .from('rate_limit_buckets')
      .update({ count: newCount })
      .eq('key', key)
      .eq('window_start', windowStart);

    return true;
  } catch (err) {
    console.error('[rateLimit] Unexpected error:', err);
    return true; // fail open
  }
}
