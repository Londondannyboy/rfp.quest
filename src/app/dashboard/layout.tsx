import { DashboardShell } from '@/components/dashboard/DashboardShell';

// Force dynamic rendering for real-time data
export const dynamic = 'force-dynamic';

// Dashboard is now publicly accessible - everyone sees the "shock and awe" experience
// Personalized content is layered on top for authenticated users with profiles
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardShell>{children}</DashboardShell>;
}
