import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Clears the current Supabase session, then sends the user to the admin login
 * flow. This is useful after a user's app_metadata role has changed because
 * the new role is included in the next access token they receive.
 */
export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login?next=/admin', request.url));

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  await supabase.auth.signOut();
  return response;
}
