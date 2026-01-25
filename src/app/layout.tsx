import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RFP Quest - Streamline Your RFP Process",
  description: "Simplify your Request for Proposal process. Create, manage, and respond to RFPs efficiently with our streamlined platform.",
  keywords: ["RFP", "request for proposal", "RFP management", "proposal software", "RFP process"],
  openGraph: {
    title: "RFP Quest - Streamline Your RFP Process",
    description: "Simplify your Request for Proposal process. Create, manage, and respond to RFPs efficiently with our streamlined platform.",
    url: "https://rfp.quest",
    siteName: "RFP Quest",
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RFP Quest - Streamline Your RFP Process",
    description: "Simplify your Request for Proposal process. Create, manage, and respond to RFPs efficiently with our streamlined platform.",
  },
  alternates: { canonical: "https://rfp.quest" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB">
      <body>{children}</body>
    </html>
  );
}
