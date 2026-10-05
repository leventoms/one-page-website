import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { PROTECTED_ROUTES } from '@/platform/routes';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Find the first matching protected route guard
  const guard = PROTECTED_ROUTES.find((g) => pathname.startsWith(g.prefix));

  // Build a response we can mutate with refreshed session cookies
  let response = NextResponse.next({ request: { headers: request.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name) {
          return request.cookies.get(name)?.value;
        },
        set(name, value, options) {
          request.cookies.set({ name, value, ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value, ...options });
        },
        remove(name, options) {
          request.cookies.set({ name, value: '', ...options });
          response = NextResponse.next({ request: { headers: request.headers } });
          response.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  // Always call getUser() — this verifies the JWT with Supabase Auth
  // and rotates the session cookie if needed (never use getSession() here).
  const { data: { user } } = await supabase.auth.getUser();

  if (guard) {
    if (!user) {
      // No session — redirect to login with return path
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (guard.role === 'admin') {
      const role = user.app_metadata?.role;
      if (role !== 'admin') {
        // Non-admins get 404 — don't confirm the admin panel exists
        return new NextResponse(null, { status: 404 });
      }
    }
  }

  return response;
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
