import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { searchTenders } from '@/lib/api/find-a-tender';
import type { TenderSearchParams } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Parse query parameters
    const params: TenderSearchParams = {
      limit: searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 50,
      cursor: searchParams.get('cursor') || undefined,
      updatedFrom: searchParams.get('updatedFrom') || undefined,
      updatedTo: searchParams.get('updatedTo') || undefined,
      keyword: searchParams.get('keyword') || undefined,
      buyerName: searchParams.get('buyerName') || undefined,
      cpvCode: searchParams.get('cpvCode') || undefined,
      region: searchParams.get('region') || undefined,
      minValue: searchParams.get('minValue') ? parseInt(searchParams.get('minValue')!) : undefined,
      maxValue: searchParams.get('maxValue') ? parseInt(searchParams.get('maxValue')!) : undefined,
    };

    // Parse stages array
    const stagesParam = searchParams.get('stages');
    if (stagesParam) {
      params.stages = stagesParam.split(',') as TenderSearchParams['stages'];
    }

    // Fetch tenders from Find a Tender API (public API, no auth required)
    const result = await searchTenders(params);

    // Apply client-side filters that aren't supported by the API
    let filteredTenders = result.tenders;

    if (params.keyword) {
      const keyword = params.keyword.toLowerCase();
      filteredTenders = filteredTenders.filter(
        (t) =>
          t.title.toLowerCase().includes(keyword) ||
          t.description?.toLowerCase().includes(keyword) ||
          t.buyerName.toLowerCase().includes(keyword)
      );
    }

    if (params.buyerName) {
      const buyerName = params.buyerName.toLowerCase();
      filteredTenders = filteredTenders.filter((t) =>
        t.buyerName.toLowerCase().includes(buyerName)
      );
    }

    if (params.cpvCode) {
      filteredTenders = filteredTenders.filter((t) =>
        t.cpvCodes.some((code) => code.startsWith(params.cpvCode!))
      );
    }

    if (params.region) {
      const region = params.region.toLowerCase();
      filteredTenders = filteredTenders.filter(
        (t) => t.region?.toLowerCase().includes(region)
      );
    }

    if (params.minValue !== undefined) {
      filteredTenders = filteredTenders.filter(
        (t) => (t.valueMax ?? t.valueMin ?? 0) >= params.minValue!
      );
    }

    if (params.maxValue !== undefined) {
      filteredTenders = filteredTenders.filter(
        (t) => (t.valueMin ?? t.valueMax ?? Infinity) <= params.maxValue!
      );
    }

    return NextResponse.json({
      tenders: filteredTenders,
      nextCursor: result.nextCursor,
      totalCount: filteredTenders.length,
    });
  } catch (error) {
    console.error('Tender search error:', error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to search tenders',
      },
      { status: 500 }
    );
  }
}
