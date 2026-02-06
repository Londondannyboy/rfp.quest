'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NeonAuthUIProvider } from '@neondatabase/auth/react/ui';
import { authClient } from '@/lib/auth/client';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <NeonAuthUIProvider
        // @ts-expect-error - type mismatch due to nested better-auth/better-fetch version conflicts
        authClient={authClient}
        redirectTo="/dashboard"
        social={{ providers: ['google'] }}
      >
        {children}
      </NeonAuthUIProvider>
    </QueryClientProvider>
  );
}
