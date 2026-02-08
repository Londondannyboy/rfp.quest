import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { sql } from '@/lib/db';
import { WizardContainer } from '@/components/onboarding/WizardContainer';

export default async function OnboardingPage() {
  const session = await getSession();

  // Require login
  if (!session.isLoggedIn || !session.userId) {
    redirect('/login');
  }

  // Check if profile already complete
  const profileResult = await sql`
    SELECT company_name, target_cpv_divisions, target_regions
    FROM company_profiles
    WHERE user_id = ${session.userId}
  `;

  if (profileResult.length > 0) {
    const profile = profileResult[0];
    const hasName = !!profile.company_name;
    const hasSectors = (profile.target_cpv_divisions as string[] | null)?.length ?? 0 > 0;
    const hasRegions = (profile.target_regions as string[] | null)?.length ?? 0 > 0;

    // If profile is complete, redirect to dashboard
    if (hasName && hasSectors && hasRegions) {
      redirect('/dashboard');
    }
  }

  return <WizardContainer />;
}
