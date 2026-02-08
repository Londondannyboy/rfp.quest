import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'RFP Platform Quest',
    short_name: 'RFP Quest',
    description: 'RFP Platform and RFP software for UK businesses. AI-powered bid writing and proposal management.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0F766E',
    icons: [
      {
        src: '/icon.svg',
        sizes: '48x48',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '192x192',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.svg',
        sizes: '512x512',
        type: 'image/svg+xml',
      },
    ],
    categories: ['business', 'productivity'],
    lang: 'en-GB',
  };
}
