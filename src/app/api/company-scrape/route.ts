import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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

// Extract text content from HTML
function extractTextContent(html: string): string {
  // Remove script and style tags
  let text = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  text = text.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, ' ');
  // Clean up whitespace
  text = text.replace(/\s+/g, ' ').trim();
  return text.substring(0, 8000); // Limit for API
}

// Extract meta information from HTML
function extractMeta(html: string): ScrapedCompanyData['meta'] {
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const metaDescMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']+)["']/i);
  const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/i);

  return {
    title: titleMatch?.[1]?.trim() || null,
    metaDescription: metaDescMatch?.[1]?.trim() || null,
    h1: h1Match?.[1]?.trim() || null,
  };
}

// Extract social links from HTML
function extractSocialLinks(html: string): ScrapedCompanyData['socialLinks'] {
  const links: ScrapedCompanyData['socialLinks'] = {};

  const linkedinMatch = html.match(/href=["'](https?:\/\/(?:www\.)?linkedin\.com\/company\/[^"']+)["']/i);
  if (linkedinMatch) links.linkedin = linkedinMatch[1];

  const twitterMatch = html.match(/href=["'](https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^"']+)["']/i);
  if (twitterMatch) links.twitter = twitterMatch[1];

  const facebookMatch = html.match(/href=["'](https?:\/\/(?:www\.)?facebook\.com\/[^"']+)["']/i);
  if (facebookMatch) links.facebook = facebookMatch[1];

  return links;
}

// Use AI to extract structured data from content
async function extractWithAI(
  content: string,
  meta: ScrapedCompanyData['meta'],
  url: string
): Promise<{
  companyName: string | null;
  description: string | null;
  services: string[];
  certifications: string[];
}> {
  try {
    const response = await openai.chat.completions.create({
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
Page Title: ${meta.title || 'N/A'}
Meta Description: ${meta.metaDescription || 'N/A'}
H1: ${meta.h1 || 'N/A'}

Page Content:
${content.substring(0, 4000)}

Return JSON with these fields:
- companyName: The company's official name (string or null)
- description: A 2-3 sentence description of what the company does (string or null)
- services: Array of products/services they offer (max 8 items, short phrases)
- certifications: Array of certifications mentioned (ISO 9001, ISO 27001, Cyber Essentials, etc.)

Return ONLY valid JSON, no markdown.`,
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
    // Fallback: use meta data
    return {
      companyName: meta.title?.split(/[-|–]/)[0]?.trim() || null,
      description: meta.metaDescription,
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

    // Fetch the website
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    let html: string;
    try {
      const response = await fetch(parsedUrl.toString(), {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; RFPQuestBot/1.0; +https://rfp.quest)',
          'Accept': 'text/html,application/xhtml+xml',
          'Accept-Language': 'en-GB,en;q=0.9',
        },
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      html = await response.text();
    } catch (fetchError) {
      const errorMessage = fetchError instanceof Error ? fetchError.message : 'Unknown error';
      return NextResponse.json(
        { error: `Could not fetch website: ${errorMessage}. Please enter your company details manually.` },
        { status: 422 }
      );
    }

    // Extract data
    const meta = extractMeta(html);
    const socialLinks = extractSocialLinks(html);
    const textContent = extractTextContent(html);

    // Use AI to extract structured data
    const aiData = await extractWithAI(textContent, meta, parsedUrl.toString());

    const result: ScrapedCompanyData = {
      companyName: aiData.companyName,
      description: aiData.description,
      services: aiData.services || [],
      socialLinks,
      certifications: aiData.certifications || [],
      website: parsedUrl.origin,
      meta,
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
