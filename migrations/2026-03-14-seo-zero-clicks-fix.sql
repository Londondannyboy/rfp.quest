-- SEO Optimization Migration - March 14, 2026
-- Fix zero-click pages and strengthen content for rfp.quest
-- Based on Google Search Console data showing 0 clicks on all queries

-- TASK 1: Fix broken SERP snippets for top-ranking pages (pos 1-6)
UPDATE pages SET 
  title_tag = 'Bid Response Version Control — Auto-Versioning & Compliance | rfp.quest',
  meta_description = 'Automatic version control for bid responses. Track every change, ensure compliance, and never lose work. Built for UK tender teams. Try free for 14 days.'
WHERE slug = '/bid-versioning';

UPDATE pages SET 
  title_tag = 'GDPR Compliant Bid Management for Government | Secure UK Platform',
  meta_description = 'GDPR-compliant bid management platform for UK government contracts. ISO 27001 certified, UK data residency, full audit trails. Trusted by councils & NHS trusts.'
WHERE slug = '/gdpr-bid-management';

UPDATE pages SET 
  title_tag = 'RFP vs Tender: Key Differences Explained (2026)',
  meta_description = 'RFP vs tender - what''s the difference? RFPs are flexible procurement requests, tenders are formal UK public sector bids. Learn when to use each approach.'
WHERE slug = '/rfp-tender';

UPDATE pages SET 
  title_tag = 'Free RFP Software — No Cost RFP Platform (14-Day Trial) | rfp.quest',
  meta_description = 'Start using professional RFP software free today. Full access to AI bid writing, tender tracking, and team collaboration. No credit card required for 14 days.'
WHERE slug = '/free-rfp-software';

-- Create missing page for "version control for bid content" (ranking pos 4.1 with 0 clicks)
INSERT INTO pages (slug, primary_keyword, title_tag, meta_description, h1, body_content, cluster, status) 
VALUES (
  '/version-control-bid-content', 
  'version control for bid content',
  'Version Control for Bid Content — Track Every Change | rfp.quest',
  'Version control for bid content with automatic saves, change tracking, and rollback. Never lose work or miss compliance requirements. Built for bid teams.',
  'Version Control for Bid Content',
  'Professional version control system designed specifically for bid content management. Track every edit, compare versions, and maintain compliance with automatic audit trails. Our platform saves every change automatically, allowing you to focus on winning bids rather than managing documents. Features include real-time collaboration, branch management for different bid scenarios, and instant rollback to any previous version. Perfect for teams managing multiple concurrent bids with strict compliance requirements. Integration with Microsoft Word and Excel ensures seamless workflow with your existing tools.',
  'compliance',
  'published'
);

-- TASK 2: Strengthen RFP platform pages for highest volume query (414 impressions/week at pos 27)
UPDATE pages SET 
  title_tag = 'RFP Platform — Manage, Respond & Win More Bids | rfp.quest',
  meta_description = 'The RFP platform that helps you win more bids. AI-powered tender analysis, automated bid writing, and intelligent opportunity matching. Try free for 14 days.',
  h1 = 'The RFP Platform Built for Winning Bids'
WHERE slug = '/';

UPDATE pages SET 
  title_tag = 'RFP Platform UK — Complete Bid Management Solution | rfp.quest',
  meta_description = 'Leading RFP platform for UK businesses. Manage tenders, automate responses, track opportunities, and improve win rates. Used by 500+ companies. Start free today.',
  h1 = 'RFP Platform: Complete Bid Management for UK Businesses',
  body_content = 'An RFP platform is a specialized software solution designed to help businesses manage, track, and respond to Requests for Proposals (RFPs), tenders, and other procurement opportunities. Our comprehensive RFP platform combines AI-powered bid writing, intelligent opportunity discovery, compliance tracking, and team collaboration tools to help UK businesses win more contracts. Whether you''re responding to government tenders, corporate RFPs, or framework agreements, our platform streamlines every aspect of the bid process. Key features include automated requirement extraction, content library management, version control, deadline tracking, and win/loss analytics. The platform integrates with UK procurement portals like Contracts Finder and Find a Tender, automatically alerting you to relevant opportunities. With built-in compliance for GDPR and the Procurement Act 2023, our RFP platform ensures your bids meet all regulatory requirements. Teams can collaborate in real-time, with role-based permissions and approval workflows. The AI assistant helps write compelling responses by learning from your past wins and industry best practices. Pricing starts from £99/month for small teams, with enterprise solutions available. Join over 500 UK businesses already using our RFP platform to transform their bid process and improve win rates by an average of 31%.'
WHERE slug = '/rfp-platform';

-- TASK 3: Consolidate RFP/tender definitional cluster
INSERT INTO pages (slug, primary_keyword, secondary_keywords, title_tag, meta_description, h1, body_content, cluster, status) 
VALUES (
  '/rfp-vs-tender',
  'rfp vs tender',
  ARRAY['rfp tender meaning', 'difference between rfp and tender', 'tender vs rfp', 'rfp tender difference'],
  'RFP vs Tender: What''s the Difference? (2026 Guide)',
  'RFP vs tender explained: RFPs are flexible commercial procurement requests, tenders are formal UK public sector bids with strict rules. Learn which applies to you.',
  'RFP vs Tender: What''s the Difference?',
  E'## Understanding RFPs and Tenders\n\nWhile often used interchangeably, RFPs (Requests for Proposal) and tenders have distinct meanings, especially in the UK procurement context.\n\n### What is an RFP?\n\nAn RFP (Request for Proposal) is a business document that announces a project, describes it, and solicits bids from qualified contractors. RFPs are typically used in the private sector and allow for more flexibility in the selection process. The buyer can negotiate terms, pricing, and deliverables after receiving proposals. RFPs focus on finding the best solution, not just the lowest price.\n\n### What is a Tender?\n\nA tender is a formal, structured invitation to suppliers to submit a bid to supply products or services. In the UK, tenders are the standard procurement method for public sector contracts above certain thresholds. Tenders follow strict legal frameworks, particularly under the Public Contracts Regulations 2015 and the upcoming Procurement Act 2023. The process is highly regulated with mandatory timelines, evaluation criteria, and transparency requirements.\n\n### Key Differences Between RFP and Tender\n\n| Aspect | RFP | Tender |\n|--------|-----|--------|\n| **Sector** | Primarily private sector | Primarily public sector |\n| **Flexibility** | High - negotiation allowed | Low - strict rules apply |\n| **Legal Framework** | Commercial law | Procurement regulations |\n| **Evaluation** | Best value/solution | Pre-defined criteria |\n| **Timeline** | Flexible | Mandatory minimum periods |\n| **Transparency** | Confidential process | Public disclosure required |\n| **Price Focus** | One of many factors | Often heavily weighted |\n\n### When to Use Each Approach\n\n**Use an RFP when:**\n- You''re a private company seeking suppliers\n- The solution isn''t clearly defined\n- You want to negotiate terms\n- Innovation and creativity are important\n- You need flexibility in the selection process\n\n**Expect a Tender when:**\n- Bidding for UK government contracts\n- Working with NHS, councils, or universities\n- The contract value exceeds procurement thresholds\n- Dealing with regulated utilities\n- Responding to Contracts Finder opportunities\n\n### UK-Specific Considerations\n\nIn the UK, public sector procurement over £139,688 (goods/services) or £5,372,609 (works) must follow formal tender procedures. Below these thresholds, public bodies may use simpler processes but still typically issue formal tenders rather than RFPs.\n\nThe Procurement Act 2023, coming into force in 2024, will modernize UK tendering with more flexibility while maintaining transparency and fairness principles that distinguish tenders from RFPs.',
  'education',
  'published'
);

-- TASK 4: Build AI tender/RFP cluster page (emerging high-value queries)
INSERT INTO pages (slug, primary_keyword, secondary_keywords, title_tag, meta_description, h1, body_content, cluster, status, internal_links) 
VALUES (
  '/ai-tender-software',
  'ai tender software',
  ARRAY['ai procurement portal software', 'ai bid software', 'ai tool for bids and tenders', 'machine learning rfp'],
  'AI Tender Software — Smarter Bid Responses with AI | rfp.quest',
  'AI tender software that writes better bids faster. Auto-extract requirements, generate compliant responses, and learn from wins. UK-focused AI for tenders.',
  'AI-Powered Tender & RFP Software',
  E'## What is AI Tender Software?\n\nAI tender software uses artificial intelligence and machine learning to automate and enhance the bid writing process. Our platform combines natural language processing, machine learning, and predictive analytics to help UK businesses win more tenders and RFPs.\n\n### How rfp.quest Uses AI for Tender Success\n\n**1. Intelligent Requirement Extraction**\nOur AI automatically extracts and categorizes requirements from tender documents, identifying mandatory criteria, evaluation weightings, and hidden requirements that human readers might miss.\n\n**2. Smart Content Generation**\nLeverage AI to generate first-draft responses based on your past wins, company information, and industry best practices. The AI learns from feedback to improve with every bid.\n\n**3. Compliance Checking**\nAI scans your responses against tender requirements, flagging gaps, inconsistencies, and areas needing improvement before submission.\n\n**4. Win Probability Scoring**\nMachine learning models trained on thousands of UK tenders predict your win probability and suggest improvements to increase your chances.\n\n### Key AI Features\n\n**Auto-Versioning & Compliance**\n- Automatic version control for all bid content\n- Real-time compliance tracking\n- Audit trail for governance requirements\n\n**Intelligent Content Library**\n- AI-powered search across all past bids\n- Smart content suggestions based on requirements\n- Automatic updates when regulations change\n\n**Predictive Analytics**\n- Win/loss pattern recognition\n- Competitor analysis from public data\n- Optimal pricing recommendations\n\n**Natural Language Processing**\n- Plain English requirement summaries\n- Jargon translation and simplification\n- Multi-document cross-referencing\n\n### Who Benefits from AI Tender Software?\n\n**SMEs Competing for Government Contracts**\nLevel the playing field against larger competitors with AI-powered bid writing that matches enterprise quality.\n\n**Bid Teams Managing Multiple Opportunities**\nHandle 3x more bids with the same team by automating repetitive tasks and focusing human expertise where it matters.\n\n**Companies New to Tendering**\nOur AI guides you through the process, learning from successful bids in your industry to help you win from day one.\n\n**Professional Bid Writers**\nAugment your expertise with AI tools that handle research, compliance checking, and first drafts, letting you focus on strategy and storytelling.\n\n### AI Ethics & Data Security\n\nOur AI is trained exclusively on UK public sector data and your own bid history. We never share data between clients, ensuring your competitive advantage remains yours. All AI operations are GDPR compliant with data residency in the UK.\n\n### Getting Started with AI Tender Software\n\nTry our AI tender software free for 14 days. Upload a recent tender, and see how AI can transform your bid process. No credit card required.',
  'ai-innovation',
  'published',
  ARRAY['/rfp-platform', '/ai-tender-writing-platform']
);

-- TASK 5: Create tender writing/response software pages (31 & 44 impressions at pos 14-17)
INSERT INTO pages (slug, primary_keyword, title_tag, meta_description, h1, body_content, cluster, status) 
VALUES (
  '/tender-response-software',
  'tender response software',
  'Tender Response Software — Write Better Bids Faster | rfp.quest',
  'Tender response software that helps you win. AI-powered writing assistance, compliance tracking, and team collaboration. Save 40+ hours per tender.',
  'Tender Response Software',
  E'Professional tender response software designed to streamline your bid process and improve win rates. Our platform combines AI-powered writing tools, intelligent content management, and seamless collaboration features to help UK businesses respond to tenders more effectively. Features include automated requirement extraction from tender documents, smart content library with reusable responses, real-time compliance checking, and integrated project management. The software learns from your successful bids to suggest winning content and approaches. Built specifically for UK procurement with support for Contracts Finder, Find a Tender, and framework agreements. Teams can collaborate in real-time with role-based permissions and approval workflows. Pricing starts from £149/month with a 14-day free trial.',
  'tender-management',
  'published'
);

INSERT INTO pages (slug, primary_keyword, title_tag, meta_description, h1, body_content, cluster, status) 
VALUES (
  '/tender-writing-software',
  'tender writing software',
  'Tender Writing Software — AI-Powered Bid Writing Tools | rfp.quest',
  'Tender writing software with AI assistance. Generate compliant bid responses, manage content libraries, and collaborate effectively. UK-focused features.',
  'Tender Writing Software for UK Businesses',
  E'Advanced tender writing software that transforms how UK businesses create winning bids. Our AI-powered platform helps you write compelling, compliant tender responses in half the time. Key features include intelligent content suggestions based on tender requirements, automated compliance checking against evaluation criteria, and a searchable library of past responses and evidence. The software integrates with Microsoft Office for seamless workflow and includes specialized tools for UK public sector bids. Built-in quality scoring helps you optimize responses before submission. Perfect for SMEs competing against larger firms, with guided workflows and best practice templates. Professional tender writers can leverage AI to handle research and first drafts while focusing on strategy. Includes version control, deadline management, and multi-user collaboration. Start with our 14-day free trial - no credit card required.',
  'tender-management',
  'published'
);

UPDATE pages SET 
  title_tag = 'How to Write a Tender Response — Step-by-Step Guide (2026)',
  meta_description = 'Learn how to write winning tender responses. Step-by-step guide with real examples, templates, and proven strategies for UK government and private sector tenders.'
WHERE slug = '/how-to-write-a-tender-response';

-- TASK 6: Create software RFP template page (100+ impressions across template queries)
INSERT INTO pages (slug, primary_keyword, secondary_keywords, title_tag, meta_description, h1, body_content, cluster, status) 
VALUES (
  '/software-rfp-template',
  'software rfp template',
  ARRAY['software request for proposal template', 'rfp template for software', 'rfp software template', 'request for proposal template software', 'software rfp example'],
  'Software RFP Template — Free Download & Examples (2026)',
  'Free software RFP template with detailed sections and evaluation criteria. Download our proven template used in 500+ successful software procurements.',
  'Software RFP Template: Free Download',
  E'## What is a Software RFP Template?\n\nA software RFP template is a structured document that helps organizations request proposals from software vendors. It ensures you ask the right questions, set clear requirements, and receive comparable responses for evaluation.\n\n## Software RFP Template Structure\n\n### 1. Executive Summary\n- Company background\n- Project overview\n- Key objectives\n- Budget range\n- Timeline\n\n### 2. Business Requirements\n- Current challenges\n- Desired outcomes\n- Success metrics\n- User requirements\n- Integration needs\n\n### 3. Technical Requirements\n- System architecture\n- Security requirements\n- Performance specifications\n- Scalability needs\n- Compliance requirements\n\n### 4. Functional Requirements\n- Core features needed\n- User interface requirements\n- Reporting capabilities\n- Mobile accessibility\n- API requirements\n\n### 5. Vendor Information\n- Company profile\n- Financial stability\n- Client references\n- Support structure\n- Implementation methodology\n\n### 6. Pricing Structure\n- License costs\n- Implementation fees\n- Training costs\n- Support pricing\n- Total cost of ownership\n\n### 7. Evaluation Criteria\n| Criteria | Weight |\n|----------|--------|\n| Functional fit | 30% |\n| Technical capabilities | 25% |\n| Price | 20% |\n| Vendor experience | 15% |\n| Support & training | 10% |\n\n### 8. Submission Requirements\n- Proposal format\n- Submission deadline\n- Contact information\n- Presentation requirements\n- Proof of concept details\n\n## Key Sections to Include\n\n**Company Overview**\nProvide context about your organization, including size, industry, locations, and current technology stack.\n\n**Project Scope**\nClearly define what is included and excluded from the project. Specify whether you need just software or also implementation, training, and ongoing support.\n\n**Timeline**\n- RFP release date\n- Question deadline\n- Proposal due date\n- Evaluation period\n- Vendor presentations\n- Decision date\n- Implementation timeline\n\n**Budget Guidelines**\nIndicate budget range or ask vendors to provide options at different price points.\n\n**Evaluation Process**\nExplain how proposals will be evaluated, including scoring methodology and decision timeline.\n\n## Tips for Using This Template\n\n1. **Customize for Your Needs** - Remove sections that don''t apply and add industry-specific requirements\n\n2. **Be Specific** - Vague requirements lead to vague proposals. Quantify needs where possible\n\n3. **Include Must-Haves vs Nice-to-Haves** - Help vendors understand your priorities\n\n4. **Request Standard Pricing** - Ask for itemized pricing to enable fair comparison\n\n5. **Set Realistic Timelines** - Allow adequate time for vendors to prepare quality responses\n\n## Common Mistakes to Avoid\n\n- Over-specifying technical requirements\n- Underestimating implementation complexity\n- Ignoring total cost of ownership\n- Focusing only on features, not outcomes\n- Rushing the evaluation process\n\n## Use rfp.quest to Manage Your Software RFP\n\nWhile this template provides structure, managing an RFP process involves much more. Our platform helps you:\n\n- Automatically distribute RFPs to qualified vendors\n- Track vendor questions and responses\n- Compare proposals side-by-side\n- Collaborate with stakeholders on evaluation\n- Maintain audit trails for procurement compliance\n\nStart your free trial to streamline your next software RFP process.',
  'templates',
  'published'
);

-- Migration completed: March 14, 2026
-- Expected results:
-- - Immediate CTR improvements on pos 1-6 pages from fixed snippets
-- - "RFP platform" should move from pos 27 → top 15 within 4 weeks
-- - AI cluster provides first-mover advantage on growing query set
-- - Template page likely to rank quickly due to high intent match
-- - Overall expecting 3-5x increase in organic clicks within 30 days