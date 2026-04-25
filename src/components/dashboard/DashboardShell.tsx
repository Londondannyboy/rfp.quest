'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  MagnifyingGlassIcon,
  TableCellsIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ProfileGate } from './ProfileGate';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: TableCellsIcon },
  { name: 'Search', href: '/dashboard/search', icon: MagnifyingGlassIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-slate-700/50 bg-slate-900/60 backdrop-blur-xl border-slate-700/50">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-4 border-b border-slate-700/50">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-xl font-bold text-blue-600">RFP</span>
              <span className="text-xl font-medium text-slate-100">Quest</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive =
                item.href === '/dashboard'
                  ? pathname === '/dashboard'
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-blue-950/20 text-blue-600'
                      : 'text-slate-300 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 hover:text-slate-100',
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive
                        ? 'text-blue-600'
                        : 'text-slate-400 group-hover:text-slate-500',
                      'h-5 w-5 shrink-0'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Back to site */}
          <div className="shrink-0 border-t border-slate-700/50 p-4">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-300 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 hover:text-slate-100 transition-colors"
            >
              <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-slate-400 group-hover:text-slate-500" />
              Back to site
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex h-16 shrink-0 items-center justify-between border-b border-slate-700/50 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 px-4">
          <Link href="/" className="flex items-center gap-1">
            <span className="text-xl font-bold text-blue-600">RFP</span>
            <span className="text-xl font-medium text-slate-100">Quest</span>
          </Link>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <ProfileGate>{children}</ProfileGate>
        </main>
      </div>
    </div>
  );
}
