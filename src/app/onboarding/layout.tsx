import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Set Up Your Company Profile | RFP Quest',
  description: 'Complete your company profile to get personalized tender matches.',
};

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
