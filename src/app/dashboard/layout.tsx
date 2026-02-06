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

const navigation = [
  { name: 'Tenders', href: '/dashboard', icon: TableCellsIcon },
  { name: 'Search', href: '/dashboard/search', icon: MagnifyingGlassIcon },
  { name: 'Graph', href: '/dashboard/graph', icon: ChartBarIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center px-4 border-b border-gray-200">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-indigo-600">RFP</span>
              <span className="text-xl font-medium text-gray-900">.quest</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-2 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    isActive
                      ? 'bg-indigo-50 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                    'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors'
                  )}
                >
                  <item.icon
                    className={classNames(
                      isActive
                        ? 'text-indigo-600'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'h-5 w-5 shrink-0'
                    )}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Back to site */}
          <div className="shrink-0 border-t border-gray-200 p-4">
            <Link
              href="/"
              className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftEndOnRectangleIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
              Back to site
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="md:hidden flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-indigo-600">RFP</span>
            <span className="text-xl font-medium text-gray-900">.quest</span>
          </Link>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
