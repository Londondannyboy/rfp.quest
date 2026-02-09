import { Metadata } from 'next';
import { AnalyzePageClient } from './client';

export const metadata: Metadata = {
  title: 'Analyze RFP | RFP.quest',
  description:
    'Upload and analyze any RFP or tender document. Get instant compliance checklists, gap analysis, and bid recommendations.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function AnalyzePage() {
  return <AnalyzePageClient />;
}
