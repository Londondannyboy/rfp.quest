import { NextRequest, NextResponse } from 'next/server';
import { fetchTenderImage, getFallbackImage } from '@/lib/unsplash';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ocid = searchParams.get('ocid');
  const title = searchParams.get('title') || '';
  const cpvCodes = searchParams.get('cpv')?.split(',').filter(Boolean) || [];
  const description = searchParams.get('description');

  if (!ocid) {
    return NextResponse.json({ error: 'Missing ocid parameter' }, { status: 400 });
  }

  try {
    const image = await fetchTenderImage(ocid, title, cpvCodes, description);

    if (image) {
      return NextResponse.json(image, {
        headers: {
          'Cache-Control': 'public, max-age=86400, s-maxage=86400', // Cache for 24 hours
        },
      });
    }

    // Return fallback image
    return NextResponse.json({
      url: getFallbackImage(cpvCodes),
      attribution: null,
      blurHash: null,
    }, {
      headers: {
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch (error) {
    console.error('Error fetching tender image:', error);

    return NextResponse.json({
      url: getFallbackImage(cpvCodes),
      attribution: null,
      blurHash: null,
    });
  }
}
