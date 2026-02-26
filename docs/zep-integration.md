# Zep Integration Documentation

## Overview
Zep provides memory and knowledge graph capabilities for AI applications. The integration is currently **stubbed out** and ready for activation when needed.

## Current Status
- ✅ Code structure in place (`/src/lib/zep-client.ts`)
- ✅ Graph analytics panel component ready (`/src/components/visualization/GraphAnalyticsPanel.tsx`)
- ✅ Stub implementation prevents build errors
- ⏸️ Actual Zep functionality disabled until package installed

## To Activate Zep

### 1. Install the Zep package
```bash
npm install @getzep/zep-cloud
```

### 2. Add environment variable
```env
ZEP_API_KEY=your_zep_api_key_here
```

### 3. Update zep-client.ts
Replace the stub implementation (lines 5-12) with:
```typescript
import { ZepClient } from '@getzep/zep-cloud';

const zepApiKey = process.env.ZEP_API_KEY || '';
const zepClient = new ZepClient({
  apiKey: zepApiKey,
});
```

## Features Available Once Activated

### Knowledge Graph
- Store relationships between tenders, companies, buyers, and decision makers
- Query patterns in procurement data
- Find similar tenders using vector similarity
- Analyze competitive landscape

### Graph Analytics
- Competitive strength analysis
- Market concentration metrics
- Incumbent advantage detection
- Bid success prediction based on historical patterns

### Data Ingestion Functions
- `ingestTenderIntoGraph()` - Add tender data to graph
- `ingestCompanyIntoGraph()` - Add company and decision maker data
- `analyzeCompetitiveLandscape()` - Analyze competition for specific tenders

## Why Zep?
Zep provides:
- Persistent memory for AI applications
- Knowledge graph capabilities
- Vector similarity search
- Session management for multi-user scenarios
- Fast retrieval of contextual information

## Dashboard Integration
The GraphAnalyticsPanel component in UnifiedDashboard is ready to display:
- Network visualizations
- Competitive insights
- Market analysis
- Relationship mapping

No code changes needed - just activate Zep when ready!