import { redirect } from 'next/navigation';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { DashboardShell } from '@/components/dashboard/DashboardShell';

// Force dynamic rendering since we need session cookies
export const dynamic = 'force-dynamic';

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
  // Use Neon Auth session instead of custom iron-session
  const { data: session } = await authServer.getSession();

  // Not logged in → redirect to sign-in
  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  // Check profile completeness using Neon Auth user ID
  const complete = await isProfileComplete(session.user.id);
  if (!complete) {
    redirect('/onboarding');
  }

  return <DashboardShell>{children}</DashboardShell>;
}
