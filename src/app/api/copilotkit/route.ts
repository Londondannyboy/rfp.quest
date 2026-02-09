import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

// Use Railway agent as remote endpoint for analysis
const AGENT_URL = process.env.AGENT_URL || 'https://rfp-quest-agent-production.up.railway.app';

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: 'gemini-2.0-flash',
  apiKey: process.env.GOOGLE_API_KEY,
});

const runtime = new CopilotRuntime({
  // Remote actions from Railway agent
  remoteEndpoints: [
    {
      url: `${AGENT_URL}/copilotkit/`,
    },
  ],
  // Local actions for frontend-specific functionality
  actions: [
    {
      name: 'searchTenders',
      description: 'Search for UK government tenders by keyword, buyer, or sector',
      parameters: [
        {
          name: 'keyword',
          type: 'string',
          description: 'Search keyword to find relevant tenders',
          required: false,
        },
        {
          name: 'buyerName',
          type: 'string',
          description: 'Filter by buyer/organization name',
          required: false,
        },
        {
          name: 'stage',
          type: 'string',
          description: 'Filter by stage: planning, tender, award, or contract',
          required: false,
        },
        {
          name: 'limit',
          type: 'number',
          description: 'Maximum number of results to return (default 10)',
          required: false,
        },
      ],
      handler: async ({ keyword, buyerName, stage, limit = 10 }: {
        keyword?: string;
        buyerName?: string;
        stage?: string;
        limit?: number;
      }) => {
        const params = new URLSearchParams();
        if (keyword) params.set('keyword', keyword);
        if (buyerName) params.set('buyerName', buyerName);
        if (stage) params.set('stage', stage);
        params.set('limit', String(limit));

        // Use relative URL for server-side fetch in Next.js API routes
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/tenders/search?${params}`);

        if (!response.ok) {
          return { error: 'Search failed', tenders: [] };
        }

        const data = await response.json();

        return {
          totalCount: data.totalCount,
          tenders: data.tenders.map((t: Record<string, unknown>) => ({
            ocid: t.ocid,
            title: t.title,
            buyer: t.buyerName,
            value: t.valueMax,
            deadline: t.tenderEndDate,
            stage: t.stage,
          })),
        };
      },
    },
    {
      name: 'getTenderDetails',
      description: 'Get detailed information about a specific tender by OCID',
      parameters: [
        {
          name: 'ocid',
          type: 'string',
          description: 'The OCID (Open Contracting ID) of the tender',
          required: true,
        },
      ],
      handler: async ({ ocid }: { ocid: string }) => {
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/tenders/${ocid}`);

        if (!response.ok) {
          return { error: 'Tender not found', ocid };
        }

        const tender = await response.json();

        return {
          ocid: tender.ocid,
          title: tender.title,
          description: tender.description,
          buyer: tender.buyerName,
          valueMin: tender.valueMin,
          valueMax: tender.valueMax,
          deadline: tender.tenderEndDate,
          published: tender.publishedDate,
          stage: tender.stage,
          cpvCodes: tender.cpvCodes,
          region: tender.region,
        };
      },
    },
    {
      name: 'getMarketInsights',
      description: 'Get current UK government tender market statistics and insights',
      parameters: [],
      handler: async () => {
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const response = await fetch(`${baseUrl}/api/dashboard-stats`);

        if (!response.ok) {
          return { error: 'Failed to fetch market insights' };
        }

        const stats = await response.json();

        return {
          summary: {
            totalOpportunities: stats.totalOpportunities,
            averageValue: `£${(stats.averageValue / 1000000).toFixed(1)}M`,
            estimatedMarketSize: `£${((stats.totalOpportunities * stats.averageValue) / 1000000000).toFixed(1)}B`,
          },
          topSectors: stats.sectorBreakdown?.slice(0, 5).map((s: { sector: string; count: number; percentage: number }) => ({
            name: s.sector,
            count: s.count,
            marketShare: `${s.percentage}%`,
          })) || [],
          valueBreakdown: stats.valueDistribution?.map((v: { bucket: string; count: number }) => ({
            range: v.bucket,
            count: v.count,
          })) || [],
          urgentDeadlines: stats.upcomingDeadlines?.filter((d: { daysRemaining: number }) => d.daysRemaining <= 7).length || 0,
          lastUpdated: stats.lastUpdated,
        };
      },
    },
    {
      name: 'getSectorAnalysis',
      description: 'Analyze a specific sector in the UK government tender market',
      parameters: [
        {
          name: 'sector',
          type: 'string',
          description: 'The sector to analyze (e.g., Construction, Healthcare, IT Services)',
          required: true,
        },
      ],
      handler: async ({ sector }: { sector: string }) => {
        const baseUrl = process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const params = new URLSearchParams({ keyword: sector, limit: '20' });
        const response = await fetch(`${baseUrl}/api/tenders/search?${params}`);

        if (!response.ok) {
          return { error: 'Failed to fetch sector data' };
        }

        const data = await response.json();
        const tenders = data.tenders || [];

        const values = tenders
          .map((t: { valueMax?: number }) => t.valueMax)
          .filter((v: number | undefined): v is number => typeof v === 'number' && v > 0);
        const avgValue = values.length > 0 ? values.reduce((a: number, b: number) => a + b, 0) / values.length : 0;

        return {
          sector,
          totalOpportunities: data.totalCount,
          sampleSize: tenders.length,
          averageContractValue: avgValue > 0 ? `£${(avgValue / 1000).toFixed(0)}k` : 'Not specified',
          recentTenders: tenders.slice(0, 5).map((t: { title: string; buyerName?: string; valueMax?: number }) => ({
            title: t.title,
            buyer: t.buyerName,
            value: t.valueMax ? `£${(t.valueMax / 1000).toFixed(0)}k` : 'TBC',
          })),
        };
      },
    },
  ],
});

export const POST = async (req: NextRequest) => {
  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime,
    serviceAdapter,
    endpoint: '/api/copilotkit',
  });

  return handleRequest(req);
};
