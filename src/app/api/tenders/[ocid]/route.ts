import { NextResponse } from 'next/server';
import { getTenderByOcid } from '@/lib/api/find-a-tender';

interface RouteParams {
  params: Promise<{ ocid: string }>;
}

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { ocid } = await params;

    if (!ocid) {
      return NextResponse.json(
        { error: 'OCID is required' },
        { status: 400 }
      );
    }

    // Find a Tender API is public, no auth required
    const tender = await getTenderByOcid(ocid);

    if (!tender) {
      return NextResponse.json(
        { error: 'Tender not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tender);
  } catch (error) {
    console.error('Tender fetch error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to fetch tender',
      },
      { status: 500 }
    );
  }
}
