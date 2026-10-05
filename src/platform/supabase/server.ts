// For Server Components and API route handlers that need the user's session.
// Uses cookies() from next/headers — never import from 'use client'.
// set/remove are no-ops: middleware owns all cookie writes.
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseSessionClient(): SupabaseClient {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {
          // no-op: middleware owns cookie writes
        },
        remove() {
          // no-op: middleware owns cookie writes
        },
      },
    }
  );
}
