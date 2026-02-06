import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { QueryProvider } from "@/lib/providers/query-provider";

export const metadata: Metadata = {
  title: {
    default: "RFP Platform UK | AI-Powered Bid Management Software",
    template: "%s | RFP Platform Quest",
  },
  description: "RFP platform for UK businesses. AI-powered bid writing, compliance checking, and proposal management. Win more tenders with RFP Platform Quest.",
  keywords: ["RFP platform", "RFP software", "tender software", "bid management", "proposal software", "UK procurement"],
  openGraph: {
    title: "RFP Platform UK | AI-Powered Bid Management Software",
    description: "RFP platform for UK businesses. AI-powered bid writing, compliance checking, and proposal management. Win more tenders with RFP Platform Quest.",
    url: "https://rfp.quest",
    siteName: "RFP Platform Quest",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RFP Platform UK | AI-Powered Bid Management",
    description: "RFP platform for UK businesses. AI-powered bid writing and proposal management.",
  },
  alternates: { canonical: "https://rfp.quest" },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        <QueryProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
