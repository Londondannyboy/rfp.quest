import { AuthView } from '@neondatabase/auth/react/ui';
import Link from 'next/link';

export const dynamicParams = false;

export function generateStaticParams() {
  return [
    { path: 'sign-in' },
    { path: 'sign-up' },
    { path: 'sign-out' },
    { path: 'forgot-password' },
    { path: 'reset-password' },
    { path: 'verify-email' },
  ];
}

export default async function AuthPage({ params }: { params: Promise<{ path: string }> }) {
  const { path } = await params;

  const titles: Record<string, string> = {
    'sign-in': 'Welcome back',
    'sign-up': 'Create your account',
    'sign-out': 'Signing out...',
    'forgot-password': 'Reset your password',
    'reset-password': 'Set new password',
    'verify-email': 'Verify your email',
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px] opacity-50" />

      {/* Modal card */}
      <div className="relative w-full max-w-md">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-3xl font-bold text-indigo-600">RFP</span>
            <span className="text-3xl font-medium text-slate-100"> Platform Quest</span>
          </Link>
          <p className="mt-2 text-sm text-slate-400">
            UK Government Tender Analysis
          </p>
        </div>

        {/* Auth card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-2xl shadow-xl shadow-gray-200/50 border-slate-700/40 p-8">
          <h1 className="text-2xl font-semibold text-slate-100 text-center mb-6">
            {titles[path] || 'Authentication'}
          </h1>

          <AuthView path={path} />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-slate-400 mt-6">
          By continuing, you agree to our{' '}
          <Link href="/terms" className="text-indigo-600 hover:text-indigo-700">Terms</Link>
          {' '}and{' '}
          <Link href="/privacy" className="text-indigo-600 hover:text-indigo-700">Privacy Policy</Link>
        </p>
      </div>
    </main>
  );
}
