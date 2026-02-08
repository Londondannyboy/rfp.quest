import { createAuthServer } from '@neondatabase/auth/next/server';

// Singleton server-side auth client for Next.js
export const authServer = createAuthServer();
