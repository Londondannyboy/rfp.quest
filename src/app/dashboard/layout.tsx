import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

// Check if profile is complete enough to access dashboard
async function isProfileComplete(userId: string): Promise<boolean> {
  const result = await sql`
    SELECT company_name, target_cpv_divisions, target_regions
    FROM company_profiles
    WHERE user_id = ${userId}
  `;

  if (result.length === 0) return false;

  const profile = result[0];
  const hasName = !!profile.company_name;
  const hasSectors = ((profile.target_cpv_divisions as string[] | null)?.length ?? 0) > 0;
  const hasRegions = ((profile.target_regions as string[] | null)?.length ?? 0) > 0;

  return hasName && hasSectors && hasRegions;
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Not logged in → redirect to login
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  // Check profile completeness
  const complete = await isProfileComplete(session.userId);
  if (!complete) {
    redirect('/onboarding');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
