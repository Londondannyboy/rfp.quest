// OCDS Types for Find a Tender API
// Based on Open Contracting Data Standard v1.1.5

export interface OCDSRelease {
  ocid: string;
  id: string;
  date: string;
  tag: string[];
  initiationType: string;
  language: string;
  buyer?: OCDSOrganization;
  planning?: OCDSPlanning;
  tender?: OCDSTender;
  awards?: OCDSAward[];
  contracts?: OCDSContract[];
  parties?: OCDSOrganization[];
}

export interface OCDSOrganization {
  id: string;
  name: string;
  identifier?: {
    scheme: string;
    id: string;
    legalName?: string;
  };
  address?: {
    streetAddress?: string;
    locality?: string;
    region?: string;
    postalCode?: string;
    countryName?: string;
  };
  contactPoint?: {
    name?: string;
    email?: string;
    telephone?: string;
    url?: string;
  };
  roles?: string[];
}

export interface OCDSPlanning {
  budget?: {
    amount?: {
      amount: number;
      currency: string;
    };
    budgetBreakdown?: Array<{
      id: string;
      description?: string;
      amount?: { amount: number; currency: string };
      period?: { startDate?: string; endDate?: string };
    }>;
  };
}

export interface OCDSTender {
  id: string;
  title: string;
  description?: string;
  status?: string;
  procuringEntity?: OCDSOrganization;
  items?: OCDSItem[];
  value?: {
    amount?: number;
    currency?: string;
  };
  minValue?: {
    amount?: number;
    currency?: string;
  };
  procurementMethod?: string;
  procurementMethodDetails?: string;
  mainProcurementCategory?: string;
  additionalProcurementCategories?: string[];
  tenderPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  enquiryPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  contractPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  hasEnquiries?: boolean;
  eligibilityCriteria?: string;
  submissionMethod?: string[];
  submissionMethodDetails?: string;
  documents?: OCDSDocument[];
  numberOfTenderers?: number;
  tenderers?: OCDSOrganization[];
}

export interface OCDSItem {
  id: string;
  description?: string;
  classification?: {
    scheme: string;
    id: string;
    description?: string;
  };
  quantity?: number;
  unit?: {
    scheme?: string;
    id?: string;
    name?: string;
  };
}

export interface OCDSAward {
  id: string;
  title?: string;
  description?: string;
  status?: string;
  date?: string;
  value?: {
    amount?: number;
    currency?: string;
  };
  suppliers?: OCDSOrganization[];
  items?: OCDSItem[];
  contractPeriod?: {
    startDate?: string;
    endDate?: string;
  };
  documents?: OCDSDocument[];
}

export interface OCDSContract {
  id: string;
  awardID?: string;
  title?: string;
  description?: string;
  status?: string;
  period?: {
    startDate?: string;
    endDate?: string;
  };
  value?: {
    amount?: number;
    currency?: string;
  };
  items?: OCDSItem[];
  documents?: OCDSDocument[];
  dateSigned?: string;
}

export interface OCDSDocument {
  id: string;
  documentType?: string;
  title?: string;
  description?: string;
  url?: string;
  datePublished?: string;
  format?: string;
  language?: string;
}

export interface OCDSReleasePackage {
  uri: string;
  version: string;
  extensions?: string[];
  publishedDate: string;
  releases: OCDSRelease[];
  publisher: {
    name: string;
    scheme?: string;
    uid?: string;
    uri?: string;
  };
  license?: string;
  publicationPolicy?: string;
}

// Simplified Tender type for our application
export interface Tender {
  ocid: string;
  title: string;
  buyerName: string;
  buyerId?: string;
  description?: string;
  valueMin?: number;
  valueMax?: number;
  currency: string;
  deadline?: string;
  publishedDate: string;
  status: string;
  procurementMethod?: string;
  mainCategory?: string;
  cpvCodes: string[];
  region?: string;
  externalUrl: string;
  source: 'find-a-tender' | 'contracts-finder';
  raw?: OCDSRelease;
}

// Search parameters for Find a Tender API
// Per API spec: stages can be planning, tender, or award
export interface TenderSearchParams {
  stages?: ('planning' | 'tender' | 'award')[];
  limit?: number;  // API limit: 1-100, default 100
  cursor?: string; // Pagination token, max 300 chars
  updatedFrom?: string; // ISO date: YYYY-MM-DDTHH:MM:SS
  updatedTo?: string;   // ISO date: YYYY-MM-DDTHH:MM:SS
  // Client-side filters (not API params)
  keyword?: string;
  buyerName?: string;
  cpvCode?: string;
  region?: string;
  minValue?: number;
  maxValue?: number;
}

// Search response
export interface TenderSearchResponse {
  tenders: Tender[];
  nextCursor?: string;
  totalCount?: number;
}
