import { redirect } from 'next/navigation';
import { authServer } from '@/lib/auth/server';
import { sql } from '@/lib/db';
import { WizardContainer } from '@/components/onboarding/WizardContainer';

// Force dynamic rendering since we need session cookies
export const dynamic = 'force-dynamic';

export default async function OnboardingPage() {
  // Use Neon Auth session
  const { data: session } = await authServer.getSession();

  // Require login
  if (!session?.user) {
    redirect('/auth/sign-in');
  }

  // Check if profile already complete
  const profileResult = await sql`
    SELECT company_name, target_cpv_divisions, target_regions
    FROM company_profiles
    WHERE user_id = ${session.user.id}
  `;

  if (profileResult.length > 0) {
    const profile = profileResult[0];
    const hasName = !!profile.company_name;
    const hasSectors = ((profile.target_cpv_divisions as string[] | null)?.length ?? 0) > 0;
    const hasRegions = ((profile.target_regions as string[] | null)?.length ?? 0) > 0;

    // If profile is complete, redirect to dashboard
    if (hasName && hasSectors && hasRegions) {
      redirect('/dashboard');
    }
  }

  return <WizardContainer />;
}
