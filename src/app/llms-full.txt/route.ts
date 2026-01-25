import { sql } from '@/lib/db';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 86400;

export async function GET() {
  const result = await sql`
    SELECT value FROM site_config WHERE key = 'llms_full_txt'
  `;

  if (!result.length) {
    return new NextResponse('# rfp.quest\n\nAI-powered RFP and tender management software.\n\nFull documentation coming soon.', {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return new NextResponse(result[0].value, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
