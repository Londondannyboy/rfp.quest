import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import OpenAI from 'openai';

// Lazy-initialize OpenAI client to avoid build-time errors
let openaiClient: OpenAI | null = null;
function getOpenAI(): OpenAI {
  if (!openaiClient) {
    openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
  return openaiClient;
}

// Jina Reader API for web scraping
const JINA_API_KEY = process.env.JINA_API_KEY || 'jina_d483443a23d64bd286284a338539f9e86b5PF0Pi4ayLaHp7Bp2ydoogA9Rd';
const JINA_READER_URL = 'https://r.jina.ai';

export interface ScrapedCompanyData {
  companyName: string | null;
  description: string | null;
  services: string[];
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  certifications: string[];
  website: string;
  meta: {
    title: string | null;
    metaDescription: string | null;
    h1: string | null;
  };
}

// Extract social links from markdown content
function extractSocialLinks(content: string): ScrapedCompanyData['socialLinks'] {
  const links: ScrapedCompanyData['socialLinks'] = {};

  const linkedinMatch = content.match(/https?:\/\/(?:www\.)?linkedin\.com\/company\/[^\s\)"\]]+/i);
  if (linkedinMatch) links.linkedin = linkedinMatch[0];

  const twitterMatch = content.match(/https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^\s\)"\]]+/i);
  if (twitterMatch) links.twitter = twitterMatch[0];

  const facebookMatch = content.match(/https?:\/\/(?:www\.)?facebook\.com\/[^\s\)"\]]+/i);
  if (facebookMatch) links.facebook = facebookMatch[0];

  return links;
}

// Extract title from Jina markdown (first # heading)
function extractTitle(content: string): string | null {
  const titleMatch = content.match(/^#\s+(.+)$/m);
  return titleMatch?.[1]?.trim() || null;
}

// Use AI to extract structured data from markdown content
async function extractWithAI(
  content: string,
  url: string
): Promise<{
  companyName: string | null;
  description: string | null;
  services: string[];
  certifications: string[];
}> {
  try {
    const response = await getOpenAI().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are an expert at extracting company information from website content. Extract structured data and return valid JSON only.`,
        },
        {
          role: 'user',
          content: `Extract company information from this website content.

URL: ${url}

Website Content (Markdown):
${content.substring(0, 6000)}

Return JSON with these fields:
- companyName: The company's official name (string or null)
- description: A 2-3 sentence description of what the company does (string or null)
- services: Array of products/services they offer (max 8 items, short phrases)
- certifications: Array of certifications mentioned (ISO 9001, ISO 14001, ISO 27001, Cyber Essentials, etc.)

Return ONLY valid JSON, no markdown code blocks.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    const text = response.choices[0]?.message?.content || '{}';
    // Clean up potential markdown code blocks
    const cleanJson = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('AI extraction error:', error);
    return {
      companyName: null,
      description: null,
      services: [],
      certifications: [],
    };
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Validate URL format
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format. Please include http:// or https://' },
        { status: 400 }
      );
    }

    // Fetch website content using Jina Reader
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for Jina

    let content: string;
    try {
      const jinaUrl = `${JINA_READER_URL}/${parsedUrl.toString()}`;
      console.log(`[Jina Reader] Fetching: ${jinaUrl}`);

      const response = await fetch(jinaUrl, {
        headers: {
          'Authorization': `Bearer ${JINA_API_KEY}`,
          'Accept': 'text/plain',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[Jina Reader] Error ${response.status}:`, errorText);
        throw new Error(`Jina Reader returned ${response.status}`);
      }

      content = await response.text();
      console.log(`[Jina Reader] Received ${content.length} characters`);
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      console.error('[Jina Reader] Fetch error:', errorMessage);
      return NextResponse.json(
        { error: `Could not fetch website: ${errorMessage}. Please enter your company details manually.` },
        { status: 422 }
      );
    }

    // Extract data
    const title = extractTitle(content);
    const socialLinks = extractSocialLinks(content);

    // Use AI to extract structured data from markdown
    const aiData = await extractWithAI(content, parsedUrl.toString());

    const result: ScrapedCompanyData = {
      companyName: aiData.companyName,
      description: aiData.description,
      services: aiData.services || [],
      socialLinks,
      certifications: aiData.certifications || [],
      website: parsedUrl.origin,
      meta: {
        title,
        metaDescription: aiData.description, // Use AI description as meta
        h1: title,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Company scrape error:', error);
    return NextResponse.json(
      { error: 'Failed to scrape website. Please enter your company details manually.' },
      { status: 500 }
    );
  }
}
