import { redirect } from 'next/navigation';
import { requireAdmin, AdminMfaRequiredError } from '@/platform/auth';

/** Protects admin data while leaving /admin/security available for MFA enrolment. */
export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AdminMfaRequiredError) redirect('/admin/security/challenge');
    throw error;
  }
  return children;
}
