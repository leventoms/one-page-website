import { getSupabaseSessionClient } from '@/platform/supabase/server';
import type { User } from '@supabase/supabase-js';

export class AuthRequiredError extends Error {
  status = 401 as const;
  constructor() {
    super('Authentication required');
    this.name = 'AuthRequiredError';
  }
}

export class AdminRequiredError extends Error {
  status = 404 as const; // 404 not 403 — don't confirm admin panel exists
  constructor() {
    super('Not found');
    this.name = 'AdminRequiredError';
  }
}

export class AdminMfaRequiredError extends Error {
  status = 403 as const;
  redirectTo = '/admin/security/challenge' as const;
  constructor() {
    super('MFA required');
    this.name = 'AdminMfaRequiredError';
  }
}

/**
 * Returns the verified user from the current session.
 * Uses getUser() (network-verified JWT) — never getSession() (stale cache).
 * Throws AuthRequiredError if no valid session exists.
 */
export async function requireUser(): Promise<User> {
  const supabase = getSupabaseSessionClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) throw new AuthRequiredError();
  return user;
}

/**
 * Returns the verified admin user.
 * Throws AdminRequiredError (404) for non-admins — obscures panel existence.
 * Throws AdminMfaRequiredError (403) for admins at AAL1 who haven't completed MFA.
 */
export async function requireAdmin(): Promise<User> {
  const user = await requireAdminRole();

  // Check MFA assurance level
  const supabase = getSupabaseSessionClient();
  const { data: aalData, error: aalError } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
  if (aalError) throw new AdminRequiredError();

  if (aalData.currentLevel !== 'aal2') {
    throw new AdminMfaRequiredError();
  }

  return user;
}

/** Requires an admin role, but intentionally allows AAL1 for MFA enrolment pages. */
export async function requireAdminRole(): Promise<User> {
  const user = await requireUser();
  if (user.app_metadata?.role !== 'admin') throw new AdminRequiredError();
  return user;
}
