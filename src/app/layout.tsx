import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { QueryProvider } from "@/lib/providers/query-provider";

export const metadata: Metadata = {
  title: {
    default: "RFP Platform Quest | RFP Software UK | AI Bid Management",
    template: "%s | RFP Platform Quest",
  },
  description: "RFP Platform Quest — leading RFP software and RFP platform for UK businesses. AI-powered bid writing, compliance checking, and proposal management. Win more tenders.",
  keywords: [
    "RFP platform",
    "RFP platform UK",
    "RFP software",
    "tender software",
    "bid management",
    "proposal software",
    "UK procurement",
    "tender management UK",
    "government tenders UK",
    "bid writing software",
    "proposal management",
    "RFP response software",
  ],
  authors: [{ name: "RFP Platform Quest" }],
  creator: "RFP Platform Quest",
  publisher: "RFP Platform Quest",
  category: "Business Software",
  openGraph: {
    title: "RFP Platform Quest | RFP Software UK | AI Bid Management",
    description: "RFP Platform Quest — leading RFP software and RFP platform for UK businesses. AI-powered bid writing, compliance checking, and proposal management. Win more tenders.",
    url: "https://rfp.quest",
    siteName: "RFP Platform Quest",
    locale: "en_GB",
    type: "website",
    countryName: "United Kingdom",
    images: [{ url: "https://rfp.quest/og-image.png", width: 1200, height: 630, alt: "RFP Platform Quest — RFP Software for AI Tender Writing" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "RFP Platform Quest | RFP Software UK | AI Bid Management",
    description: "RFP Platform Quest — leading RFP software and RFP platform for UK businesses. AI-powered bid writing and proposal management.",
    images: ["https://rfp.quest/og-image.png"],
  },
  alternates: {
    canonical: "https://rfp.quest",
    languages: {
      "en-GB": "https://rfp.quest",
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "geo.region": "GB",
    "geo.placename": "United Kingdom",
    "content-language": "en-GB",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <head>
        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-title" content="RFP Platform Quest" />
        <link rel="manifest" href="/site.webmanifest" />
        {/* Preconnect */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://calendly.com" />
        <meta name="format-detection" content="telephone=no" />
      </head>
      <body className="min-h-screen flex flex-col">
        {/*
          NOTE: QueryProvider wraps all children because:
          - Navbar needs auth context (useSession)
          - App pages (/profile, /dashboard, etc.) use React Query
          - SEO pages use ISR (revalidate=3600) for caching benefits

          For full SSR optimization, consider using route groups:
          - (marketing) group for SEO pages without QueryProvider
          - (app) group for authenticated pages with QueryProvider
        */}
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <CookieConsentBanner />
        </QueryProvider>
      </body>
    </html>
  );
}
