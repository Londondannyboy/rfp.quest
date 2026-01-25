import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: {
    default: "rfp.quest - AI-Powered RFP & Tender Software",
    template: "%s | rfp.quest",
  },
  description: "AI-powered RFP and tender management software. Write winning bids faster with automated proposal tools. Built for UK procurement teams.",
  keywords: ["RFP software", "tender software", "bid management", "proposal software", "UK procurement"],
  openGraph: {
    title: "rfp.quest - AI-Powered RFP & Tender Software",
    description: "AI-powered RFP and tender management software. Write winning bids faster with automated proposal tools. Built for UK procurement teams.",
    url: "https://rfp.quest",
    siteName: "rfp.quest",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "rfp.quest - AI-Powered RFP & Tender Software",
    description: "AI-powered RFP and tender management software. Write winning bids faster.",
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
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
