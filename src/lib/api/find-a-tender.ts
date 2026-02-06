import type {
  OCDSReleasePackage,
  OCDSRelease,
  Tender,
  TenderSearchParams,
  TenderSearchResponse,
} from './types';

const FIND_A_TENDER_BASE_URL = 'https://www.find-tender.service.gov.uk/api/1.0';

function transformReleasesToTenders(releases: OCDSRelease[]): Tender[] {
  return releases.map((release) => {
    const tender = release.tender;
    const buyer = release.buyer || release.parties?.find(p => p.roles?.includes('buyer'));

    // Extract CPV codes from items
    const cpvCodes: string[] = [];
    tender?.items?.forEach(item => {
      if (item.classification?.scheme === 'CPV' && item.classification.id) {
        cpvCodes.push(item.classification.id);
      }
    });

    // Determine value range
    let valueMin: number | undefined;
    let valueMax: number | undefined;
    let currency = 'GBP';

    if (tender?.minValue?.amount !== undefined) {
      valueMin = tender.minValue.amount;
      currency = tender.minValue.currency || 'GBP';
    }
    if (tender?.value?.amount !== undefined) {
      valueMax = tender.value.amount;
      currency = tender.value.currency || 'GBP';
    }

    // Determine status
    let status = tender?.status || 'unknown';
    if (release.tag.includes('planning')) status = 'planning';
    else if (release.tag.includes('tender')) status = 'active';
    else if (release.tag.includes('award')) status = 'awarded';
    else if (release.tag.includes('contract')) status = 'contracted';

    return {
      ocid: release.ocid,
      title: tender?.title || 'Untitled Tender',
      buyerName: buyer?.name || 'Unknown Buyer',
      buyerId: buyer?.id,
      description: tender?.description,
      valueMin,
      valueMax,
      currency,
      deadline: tender?.tenderPeriod?.endDate,
      publishedDate: release.date,
      status,
      procurementMethod: tender?.procurementMethod,
      mainCategory: tender?.mainProcurementCategory,
      cpvCodes,
      region: buyer?.address?.region,
      externalUrl: `https://www.find-tender.service.gov.uk/Notice/${release.ocid}`,
      source: 'find-a-tender' as const,
      raw: release,
    };
  });
}

export async function searchTenders(
  params: TenderSearchParams
): Promise<TenderSearchResponse> {
  const url = new URL(`${FIND_A_TENDER_BASE_URL}/ocdsReleasePackages`);

  // Build query params per API spec
  // Allowed: limit (1-100), cursor, updatedFrom, updatedTo, stages (planning|tender|award)
  if (params.stages?.length) {
    // Filter to only valid stages per API spec
    const validStages = params.stages.filter(s =>
      ['planning', 'tender', 'award'].includes(s)
    );
    if (validStages.length) {
      url.searchParams.set('stages', validStages.join(','));
    }
  }
  if (params.limit) {
    // API limit is 1-100
    url.searchParams.set('limit', String(Math.min(Math.max(params.limit, 1), 100)));
  }
  if (params.cursor) {
    url.searchParams.set('cursor', params.cursor);
  }
  if (params.updatedFrom) {
    url.searchParams.set('updatedFrom', params.updatedFrom);
  }
  if (params.updatedTo) {
    url.searchParams.set('updatedTo', params.updatedTo);
  }

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  // Note: Find a Tender API is public - no authentication required

  const response = await fetch(url.toString(), { headers });

  // Handle rate limiting
  if (response.status === 429 || response.status === 503) {
    const retryAfter = response.headers.get('Retry-After');
    throw new Error(`Rate limited. Retry after ${retryAfter || 'unknown'} seconds.`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Find a Tender API error: ${response.status} - ${errorText}`);
  }

  const data: OCDSReleasePackage = await response.json();
  const tenders = transformReleasesToTenders(data.releases);

  // Extract cursor from response headers or pagination info
  const linkHeader = response.headers.get('Link');
  let nextCursor: string | undefined;

  if (linkHeader) {
    const nextMatch = linkHeader.match(/<[^>]*[?&]cursor=([^&>]+)[^>]*>;\s*rel="next"/);
    if (nextMatch) {
      nextCursor = nextMatch[1];
    }
  }

  return {
    tenders,
    nextCursor,
  };
}

export async function getTenderByOcid(ocid: string): Promise<Tender | null> {
  const url = `${FIND_A_TENDER_BASE_URL}/ocdsReleasePackages/${encodeURIComponent(ocid)}`;

  const headers: Record<string, string> = {
    'Accept': 'application/json',
  };

  const response = await fetch(url, { headers });

  if (response.status === 404) {
    return null;
  }

  // Handle rate limiting
  if (response.status === 429 || response.status === 503) {
    const retryAfter = response.headers.get('Retry-After');
    throw new Error(`Rate limited. Retry after ${retryAfter || 'unknown'} seconds.`);
  }

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Find a Tender API error: ${response.status} - ${errorText}`);
  }

  const data: OCDSReleasePackage = await response.json();

  if (!data.releases.length) {
    return null;
  }

  const tenders = transformReleasesToTenders(data.releases);
  return tenders[0];
}

// Helper to format currency values
export function formatCurrency(amount: number | undefined, currency = 'GBP'): string {
  if (amount === undefined) return 'Not specified';

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper to format value range
export function formatValueRange(
  min: number | undefined,
  max: number | undefined,
  currency = 'GBP'
): string {
  if (min === undefined && max === undefined) {
    return 'Not specified';
  }
  if (min !== undefined && max !== undefined) {
    if (min === max) {
      return formatCurrency(min, currency);
    }
    return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
  }
  if (max !== undefined) {
    return `Up to ${formatCurrency(max, currency)}`;
  }
  return `From ${formatCurrency(min, currency)}`;
}

// Helper to format deadline
export function formatDeadline(deadline: string | undefined): string {
  if (!deadline) return 'Not specified';

  const date = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  const formatted = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  if (diffDays < 0) {
    return `${formatted} (Closed)`;
  }
  if (diffDays === 0) {
    return `${formatted} (Today!)`;
  }
  if (diffDays <= 7) {
    return `${formatted} (${diffDays} days)`;
  }

  return formatted;
}
