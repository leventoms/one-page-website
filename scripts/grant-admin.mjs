import { createClient } from '@supabase/supabase-js';
import nextEnv from '@next/env';

const { loadEnvConfig } = nextEnv;

// Match Next.js: load .env.local before reading configuration.
loadEnvConfig(process.cwd());

const adminEmails = process.env.ADMIN_EMAILS ?? '';
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

if (!supabaseUrl || !serviceRoleKey) throw new Error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');

const emails = adminEmails.split(',').map((email) => email.trim()).filter(Boolean);
if (!emails.length) throw new Error('Set ADMIN_EMAILS to at least one email address.');

const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
const { data, error } = await supabase.auth.admin.listUsers();
if (error) throw new Error(`Could not list users: ${error.message}`);

for (const email of emails) {
  const user = data.users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.warn(`No Supabase user found for ${email}. Ask them to sign in first, then run this again.`);
    continue;
  }

  const { error: updateError } = await supabase.auth.admin.updateUserById(user.id, {
    app_metadata: { ...user.app_metadata, role: 'admin' },
  });
  if (updateError) throw new Error(`Could not grant admin to ${email}: ${updateError.message}`);
  console.log(`Granted admin role to ${email}.`);
}
