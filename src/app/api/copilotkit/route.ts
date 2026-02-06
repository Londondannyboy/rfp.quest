import {
  CopilotRuntime,
  GoogleGenerativeAIAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from '@copilotkit/runtime';
import { NextRequest } from 'next/server';

const serviceAdapter = new GoogleGenerativeAIAdapter({
  model: 'gemini-2.0-flash',
});

const runtime = new CopilotRuntime({
  actions: [
    {
      name: 'analyzeTender',
      description: 'Analyze a UK government tender and extract key information, requirements, and evaluation criteria',
      parameters: [
        {
          name: 'ocid',
          type: 'string',
          description: 'The OCID (Open Contracting ID) of the tender to analyze',
          required: true,
        },
      ],
      handler: async ({ ocid }: { ocid: string }) => {
        // Fetch tender from our database
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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

        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
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
      name: 'renderTenderHero',
      description: 'Render the main hero section for a tender with title, buyer, value, and deadline',
      parameters: [
        {
          name: 'title',
          type: 'string',
          description: 'Tender title',
          required: true,
        },
        {
          name: 'buyerName',
          type: 'string',
          description: 'Name of the buying organization',
          required: true,
        },
        {
          name: 'stage',
          type: 'string',
          description: 'Tender stage: planning, tender, award, or contract',
          required: true,
        },
        {
          name: 'valueMin',
          type: 'number',
          description: 'Minimum contract value in GBP',
          required: false,
        },
        {
          name: 'valueMax',
          type: 'number',
          description: 'Maximum contract value in GBP',
          required: false,
        },
        {
          name: 'deadline',
          type: 'string',
          description: 'Submission deadline ISO date string',
          required: false,
        },
        {
          name: 'publishedDate',
          type: 'string',
          description: 'Publication date ISO string',
          required: true,
        },
        {
          name: 'ocid',
          type: 'string',
          description: 'The OCID of the tender',
          required: true,
        },
        {
          name: 'description',
          type: 'string',
          description: 'Short description of the tender',
          required: false,
        },
      ],
      handler: async (args: Record<string, unknown>) => {
        // Return component render instruction
        return {
          component: 'TenderHero',
          props: args,
        };
      },
    },
    {
      name: 'renderTimelineView',
      description: 'Render a timeline of key dates and milestones for the tender',
      parameters: [
        {
          name: 'events',
          type: 'object[]',
          description: 'Array of timeline events with id, date, title, type, and description',
          required: true,
        },
      ],
      handler: async ({ events }: { events: unknown[] }) => {
        return {
          component: 'TimelineView',
          props: { events },
        };
      },
    },
    {
      name: 'renderRiskAssessment',
      description: 'Render a risk assessment showing identified risks and overall score',
      parameters: [
        {
          name: 'risks',
          type: 'object[]',
          description: 'Array of risk items with id, category, title, description, level, and mitigation',
          required: true,
        },
        {
          name: 'overallScore',
          type: 'number',
          description: 'Overall risk score from 0-100 (higher is less risky)',
          required: true,
        },
      ],
      handler: async ({ risks, overallScore }: { risks: unknown[]; overallScore: number }) => {
        return {
          component: 'RiskAssessment',
          props: { risks, overallScore },
        };
      },
    },
    {
      name: 'renderValueAnalysis',
      description: 'Render a contract value analysis with breakdown and market comparison',
      parameters: [
        {
          name: 'valueMin',
          type: 'number',
          description: 'Minimum contract value',
          required: false,
        },
        {
          name: 'valueMax',
          type: 'number',
          description: 'Maximum contract value',
          required: false,
        },
        {
          name: 'duration',
          type: 'number',
          description: 'Contract duration in months',
          required: false,
        },
        {
          name: 'priceModel',
          type: 'string',
          description: 'Pricing model: fixed, variable, framework, or lot-based',
          required: false,
        },
      ],
      handler: async (args: Record<string, unknown>) => {
        return {
          component: 'ValueAnalysis',
          props: args,
        };
      },
    },
    {
      name: 'renderBuyerProfile',
      description: 'Render a profile card for the buying organization',
      parameters: [
        {
          name: 'name',
          type: 'string',
          description: 'Organization name',
          required: true,
        },
        {
          name: 'department',
          type: 'string',
          description: 'Government department',
          required: false,
        },
        {
          name: 'region',
          type: 'string',
          description: 'Geographic region',
          required: false,
        },
        {
          name: 'description',
          type: 'string',
          description: 'Organization description',
          required: false,
        },
      ],
      handler: async (args: Record<string, unknown>) => {
        return {
          component: 'BuyerProfile',
          props: args,
        };
      },
    },
    {
      name: 'renderTenderStats',
      description: 'Render key statistics about the tender in a grid or row layout',
      parameters: [
        {
          name: 'stats',
          type: 'object[]',
          description: 'Array of stat items with label, value, icon, and optional trend',
          required: true,
        },
        {
          name: 'title',
          type: 'string',
          description: 'Optional title for the stats section',
          required: false,
        },
        {
          name: 'layout',
          type: 'string',
          description: 'Layout style: grid or row',
          required: false,
        },
      ],
      handler: async (args: Record<string, unknown>) => {
        return {
          component: 'TenderStats',
          props: args,
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
