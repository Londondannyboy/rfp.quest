import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RFP Platform Quest',
    short_name: 'RFP Platform Quest',
    description: 'RFP Platform and RFP software for UK businesses. AI-powered bid writing and proposal management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0F766E',
    icons: [
      {
        src: '/favicon.svg',
        sizes: '48x48',
        type: 'image/svg+xml',
      },
      {
        src: '/manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'en-GB',
  };
}
