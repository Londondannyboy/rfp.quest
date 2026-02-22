import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);

async function createIntelligenceTables() {
  console.log('🗄️ Creating intelligence tables...');

  // Company intelligence cache table
  await sql`
    CREATE TABLE IF NOT EXISTS company_intelligence (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- Company identification
      company_number VARCHAR(20) NOT NULL,
      company_name VARCHAR(500) NOT NULL,
      
      -- Account metadata
      accounts_date DATE NOT NULL,
      accounts_type VARCHAR(50) NOT NULL, -- 'abbreviated', 'full', 'group', 'micro', 'dormant'
      company_size VARCHAR(20) NOT NULL, -- 'micro', 'small', 'medium', 'large'
      
      -- Raw extraction data
      jigsawstack_response JSONB NOT NULL,
      jigsawstack_log_id VARCHAR(100),
      
      -- Standardized intelligence data
      intelligence_data JSONB NOT NULL,
      
      -- Calculated scores
      financial_health_score INTEGER, -- 0-100
      risk_score INTEGER, -- 0-100  
      esg_score INTEGER, -- 0-100
      data_completeness_score INTEGER, -- 0-100
      
      -- Extraction metadata
      extraction_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      processing_time_ms INTEGER,
      document_pages INTEGER,
      characters_extracted INTEGER,
      
      -- Cache control
      expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
      
      -- Indexes for performance
      UNIQUE(company_number, accounts_date),
      
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Index for fast lookups
  await sql`
    CREATE INDEX IF NOT EXISTS idx_company_intelligence_number 
    ON company_intelligence(company_number);
  `;
  
  await sql`
    CREATE INDEX IF NOT EXISTS idx_company_intelligence_expires 
    ON company_intelligence(expires_at);
  `;

  // RFP-specific intelligence analysis table  
  await sql`
    CREATE TABLE IF NOT EXISTS rfp_intelligence_analysis (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- Reference to tender
      tender_id UUID REFERENCES tenders(id) ON DELETE CASCADE,
      
      -- Companies analyzed for this RFP
      buyer_company_number VARCHAR(20),
      competitor_companies JSONB DEFAULT '[]'::jsonb, -- Array of company numbers
      
      -- Buyer intelligence
      buyer_intelligence_id UUID REFERENCES company_intelligence(id),
      buyer_analysis JSONB, -- RFP-specific analysis of buyer
      
      -- Competitive landscape
      competitive_analysis JSONB, -- Analysis of all competitors
      market_positioning JSONB, -- Our position vs competitors
      
      -- Bid strategy recommendations
      bid_strategy JSONB, -- Recommended approach based on intelligence
      pricing_insights JSONB, -- Pricing recommendations
      win_probability DECIMAL(5,2), -- 0-100%
      
      -- Key insights
      key_opportunities JSONB DEFAULT '[]'::jsonb,
      key_risks JSONB DEFAULT '[]'::jsonb,
      differentiators JSONB DEFAULT '[]'::jsonb,
      
      -- Analysis metadata
      analysis_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      analyst_type VARCHAR(50) DEFAULT 'ai', -- 'ai', 'human', 'hybrid'
      confidence_score INTEGER, -- 0-100
      
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Intelligence extraction queue for async processing
  await sql`
    CREATE TABLE IF NOT EXISTS intelligence_extraction_queue (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- What to extract
      company_number VARCHAR(20) NOT NULL,
      company_name VARCHAR(500),
      priority INTEGER DEFAULT 5, -- 1-10, lower = higher priority
      
      -- Context for extraction
      extraction_context JSONB, -- RFP requirements, sectors, etc.
      requested_by VARCHAR(100), -- user_id or system process
      
      -- Status tracking
      status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
      attempts INTEGER DEFAULT 0,
      max_attempts INTEGER DEFAULT 3,
      
      -- Processing details
      started_at TIMESTAMP WITH TIME ZONE,
      completed_at TIMESTAMP WITH TIME ZONE,
      error_message TEXT,
      
      -- Results
      intelligence_id UUID REFERENCES company_intelligence(id),
      
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Index for queue processing
  await sql`
    CREATE INDEX IF NOT EXISTS idx_extraction_queue_status_priority 
    ON intelligence_extraction_queue(status, priority, created_at);
  `;

  // Intelligence alerts table
  await sql`
    CREATE TABLE IF NOT EXISTS intelligence_alerts (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      
      -- What to monitor
      company_number VARCHAR(20) NOT NULL,
      alert_type VARCHAR(50) NOT NULL, -- 'new_accounts', 'financial_change', 'risk_increase'
      
      -- Alert configuration
      threshold_config JSONB, -- Thresholds for triggering alerts
      frequency VARCHAR(20) DEFAULT 'monthly', -- 'daily', 'weekly', 'monthly'
      
      -- Alert recipients
      user_id VARCHAR(100),
      notification_channels JSONB DEFAULT '["email"]'::jsonb, -- email, slack, webhook
      
      -- Status
      is_active BOOLEAN DEFAULT true,
      last_checked_at TIMESTAMP WITH TIME ZONE,
      last_triggered_at TIMESTAMP WITH TIME ZONE,
      
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    )
  `;

  // Intelligence search and analytics views
  await sql`
    CREATE OR REPLACE VIEW company_intelligence_summary AS
    SELECT 
      ci.*,
      -- Extract key metrics from JSONB for easy querying
      (intelligence_data->'financial'->'basicMetrics'->>'turnover')::DECIMAL as turnover,
      (intelligence_data->'financial'->'basicMetrics'->>'netProfit')::DECIMAL as net_profit,
      (intelligence_data->'operational'->>'employeeCount')::INTEGER as employee_count,
      (intelligence_data->'sustainability'->>'secrCompliant')::BOOLEAN as secr_compliant,
      (intelligence_data->'risks'->>'goingConcernIssues')::BOOLEAN as going_concern_issues,
      
      -- Age of data
      EXTRACT(DAYS FROM NOW() - extraction_date) as days_since_extraction,
      
      -- Overall health score (average of all scores)
      ROUND((COALESCE(financial_health_score, 0) + 
             COALESCE(risk_score, 0) + 
             COALESCE(esg_score, 0)) / 3.0) as overall_score
      
    FROM company_intelligence ci
    WHERE expires_at > NOW()
  `;

  console.log('✅ Intelligence tables created successfully!');
  
  // Create some test data
  console.log('🧪 Creating test intelligence entry...');
  
  const testIntelligence = {
    companyProfile: {
      name: "Rolls-Royce Holdings PLC",
      number: "07524813",
      sicCodes: ["35300", "35999"],
      accountType: { type: "group", size: "large", hasGroupStructure: true },
      companyStatus: "active"
    },
    financial: {
      basicMetrics: {
        turnover: 15400000000,
        netProfit: 1200000000,
        totalAssets: 25000000000
      },
      performance: {
        revenueGrowth: 8.5,
        profitGrowth: 15.2
      }
    },
    operational: {
      employeeCount: 42000,
      directors: [
        { name: "Tufan Erginbilgic", role: "Chief Executive Officer" }
      ]
    },
    sustainability: {
      secrCompliant: true,
      carbonEmissions: { total: 2500000 }
    },
    risks: {
      goingConcernIssues: false,
      auditOpinion: "unqualified"
    },
    extractionMetadata: {
      extractionDate: new Date().toISOString(),
      accountType: "group",
      confidence: 0.92,
      dataCompleteness: 0.85
    }
  };

  await sql`
    INSERT INTO company_intelligence (
      company_number,
      company_name, 
      accounts_date,
      accounts_type,
      company_size,
      jigsawstack_response,
      intelligence_data,
      financial_health_score,
      risk_score,
      esg_score,
      data_completeness_score,
      processing_time_ms,
      document_pages,
      characters_extracted
    ) VALUES (
      '07524813',
      'Rolls-Royce Holdings PLC',
      '2024-12-31',
      'group',
      'large',
      '{"success": true, "test": true}',
      ${JSON.stringify(testIntelligence)},
      85,
      78,
      72,
      85,
      6497,
      45,
      250000
    )
    ON CONFLICT (company_number, accounts_date) 
    DO UPDATE SET
      intelligence_data = EXCLUDED.intelligence_data,
      updated_at = NOW()
  `;

  console.log('✅ Test data created!');
}

// Add utility functions for intelligence queries
async function createIntelligenceUtilityFunctions() {
  console.log('📊 Creating utility functions...');

  await sql`
    CREATE OR REPLACE FUNCTION get_company_intelligence_summary(comp_number TEXT)
    RETURNS TABLE(
      company_name TEXT,
      turnover DECIMAL,
      profit_margin DECIMAL,
      employee_count INTEGER,
      financial_health INTEGER,
      risk_level TEXT,
      last_updated DATE
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        ci.company_name::TEXT,
        (ci.intelligence_data->'financial'->'basicMetrics'->>'turnover')::DECIMAL,
        CASE 
          WHEN (ci.intelligence_data->'financial'->'basicMetrics'->>'turnover')::DECIMAL > 0 
          THEN ROUND(
            ((ci.intelligence_data->'financial'->'basicMetrics'->>'netProfit')::DECIMAL / 
             (ci.intelligence_data->'financial'->'basicMetrics'->>'turnover')::DECIMAL) * 100, 2
          )
          ELSE NULL
        END as profit_margin,
        (ci.intelligence_data->'operational'->>'employeeCount')::INTEGER,
        ci.financial_health_score,
        CASE 
          WHEN ci.risk_score >= 80 THEN 'Low'
          WHEN ci.risk_score >= 60 THEN 'Medium'
          WHEN ci.risk_score >= 40 THEN 'High'
          ELSE 'Very High'
        END::TEXT as risk_level,
        ci.accounts_date
      FROM company_intelligence ci
      WHERE ci.company_number = comp_number
        AND ci.expires_at > NOW()
      ORDER BY ci.accounts_date DESC
      LIMIT 1;
    END;
    $$ LANGUAGE plpgsql;
  `;

  console.log('✅ Utility functions created!');
}

async function main() {
  try {
    await createIntelligenceTables();
    await createIntelligenceUtilityFunctions();
    
    console.log('\n🎉 Intelligence database schema completed!');
    console.log('📋 Tables created:');
    console.log('   • company_intelligence - Main intelligence data');
    console.log('   • rfp_intelligence_analysis - RFP-specific analysis'); 
    console.log('   • intelligence_extraction_queue - Async processing');
    console.log('   • intelligence_alerts - Monitoring & notifications');
    console.log('   • company_intelligence_summary - Analytics view');
    console.log('\n🔧 Functions created:');
    console.log('   • get_company_intelligence_summary() - Quick summaries');
    
  } catch (error) {
    console.error('❌ Error creating intelligence tables:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}