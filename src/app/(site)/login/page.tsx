import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSupabaseSessionClient } from '@/platform/supabase';
import LoginForm from '@/components/auth/LoginForm';

interface PageProps {
  searchParams: { next?: string };
}

function validateNext(next: string | undefined): string {
  if (!next) return '/';
  if (!next.startsWith('/')) return '/';
  if (next.startsWith('//')) return '/';
  return next;
}

export const metadata: Metadata = {
  title: 'Sign in — Surprise Pages',
  robots: { index: false },
};

export default async function LoginPage({ searchParams }: PageProps) {
  const next = validateNext(searchParams.next);

  const supabase = getSupabaseSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(next);

  return (
    <section className="sp-builder">
      <div className="sp-wrap" style={{ maxWidth: '480px', margin: '0 auto', paddingTop: '4rem' }}>
        <div className="sp-builder-intro">
          <span className="sp-eyebrow">sign in</span>
          <h1>Welcome back</h1>
          <p className="lede">
            Enter your email and we&apos;ll send you a magic link — no password needed.
          </p>
        </div>
        <LoginForm next={next} />
      </div>
    </section>
  );
}
