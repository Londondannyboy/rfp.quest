-- Response Library Schema
-- Stores reusable bid response paragraphs and sections

CREATE TABLE IF NOT EXISTS response_library (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100), -- 'technical', 'commercial', 'sustainability', 'quality', 'experience'
    tags TEXT[], -- Array of tags for searching
    sector_codes TEXT[], -- CPV codes this response is relevant to
    usage_count INTEGER DEFAULT 0,
    win_rate DECIMAL(3,2), -- Percentage of bids won when this response was used
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB -- Additional structured data
);

CREATE INDEX idx_response_library_team ON response_library(team_id);
CREATE INDEX idx_response_library_category ON response_library(category);
CREATE INDEX idx_response_library_tags ON response_library USING GIN(tags);
CREATE INDEX idx_response_library_sectors ON response_library USING GIN(sector_codes);

-- Response Usage Tracking
-- Links responses to specific bids for analytics

CREATE TABLE IF NOT EXISTS response_usage (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES response_library(id) ON DELETE CASCADE,
    tender_id UUID NOT NULL REFERENCES tenders(id),
    bid_id UUID REFERENCES bids(id), -- Link to bid submission
    used_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    outcome VARCHAR(20), -- 'won', 'lost', 'pending', 'withdrawn'
    score DECIMAL(5,2), -- Score received for this section if known
    modifications TEXT -- Track if response was modified from template
);

CREATE INDEX idx_response_usage_response ON response_usage(response_id);
CREATE INDEX idx_response_usage_tender ON response_usage(tender_id);
CREATE INDEX idx_response_usage_outcome ON response_usage(outcome);

-- Bid Submissions
-- Track complete bid submissions

CREATE TABLE IF NOT EXISTS bids (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID NOT NULL REFERENCES tenders(id),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'draft', -- 'draft', 'in_review', 'submitted', 'won', 'lost'
    version INTEGER NOT NULL DEFAULT 1,
    title VARCHAR(255),
    content JSONB NOT NULL, -- Structured bid content with sections
    compliance_score DECIMAL(3,2), -- Percentage compliance with requirements
    predicted_win_probability DECIMAL(3,2), -- ML prediction
    submission_date TIMESTAMP WITH TIME ZONE,
    outcome_date TIMESTAMP WITH TIME ZONE,
    contract_value DECIMAL(12,2),
    feedback TEXT, -- Feedback from buyer if available
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by UUID REFERENCES users(id),
    metadata JSONB
);

CREATE INDEX idx_bids_team ON bids(team_id);
CREATE INDEX idx_bids_tender ON bids(tender_id);
CREATE INDEX idx_bids_status ON bids(status);
CREATE INDEX idx_bids_submission_date ON bids(submission_date);

-- Bid Versions
-- Track version history for bid documents

CREATE TABLE IF NOT EXISTS bid_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bid_id UUID NOT NULL REFERENCES bids(id) ON DELETE CASCADE,
    version_number INTEGER NOT NULL,
    content JSONB NOT NULL,
    changes_summary TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bid_id, version_number)
);

CREATE INDEX idx_bid_versions_bid ON bid_versions(bid_id);

-- Credits System
-- Track enrichment credits for teams

CREATE TABLE IF NOT EXISTS team_credits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    credits_remaining INTEGER NOT NULL DEFAULT 0,
    credits_used_this_period INTEGER NOT NULL DEFAULT 0,
    period_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    period_end TIMESTAMP WITH TIME ZONE NOT NULL,
    subscription_tier VARCHAR(50), -- 'starter', 'professional', 'agency'
    monthly_allowance INTEGER NOT NULL, -- Based on subscription tier
    rollover_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX idx_team_credits_team ON team_credits(team_id);
CREATE INDEX idx_team_credits_period ON team_credits(period_start, period_end);

-- Credit Transactions
-- Log all credit usage

CREATE TABLE IF NOT EXISTS credit_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    transaction_type VARCHAR(50) NOT NULL, -- 'enrichment', 'refund', 'purchase', 'monthly_allocation'
    credits_amount INTEGER NOT NULL, -- Positive for additions, negative for usage
    balance_after INTEGER NOT NULL,
    description TEXT,
    reference_id UUID, -- ID of enriched company/tender
    reference_type VARCHAR(50), -- 'company', 'tender', 'competitor'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE INDEX idx_credit_transactions_team ON credit_transactions(team_id);
CREATE INDEX idx_credit_transactions_user ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_type ON credit_transactions(transaction_type);
CREATE INDEX idx_credit_transactions_date ON credit_transactions(created_at);

-- Enrichment Cache
-- Store enriched data with TTL

CREATE TABLE IF NOT EXISTS enrichment_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key VARCHAR(255) UNIQUE NOT NULL, -- e.g., 'company_07524813'
    data_type VARCHAR(50) NOT NULL, -- 'company', 'linkedin', 'news', 'accounts'
    data JSONB NOT NULL,
    source VARCHAR(50), -- 'companies_house', 'linkedin', 'tavily'
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL, -- TTL, typically 30 days
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    access_count INTEGER DEFAULT 1
);

CREATE INDEX idx_enrichment_cache_key ON enrichment_cache(cache_key);
CREATE INDEX idx_enrichment_cache_type ON enrichment_cache(data_type);
CREATE INDEX idx_enrichment_cache_expires ON enrichment_cache(expires_at);

-- Subscription Tiers Configuration
-- Define features and limits for each tier

CREATE TABLE IF NOT EXISTS subscription_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tier_code VARCHAR(50) UNIQUE NOT NULL, -- 'starter', 'professional', 'agency'
    name VARCHAR(100) NOT NULL,
    monthly_price DECIMAL(6,2) NOT NULL,
    annual_price DECIMAL(7,2),
    credits_per_month INTEGER NOT NULL,
    max_tenders_monitored INTEGER,
    max_team_members INTEGER,
    features JSONB NOT NULL, -- Feature flags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default subscription tiers
INSERT INTO subscription_tiers (tier_code, name, monthly_price, annual_price, credits_per_month, max_tenders_monitored, max_team_members, features) VALUES
('starter', 'Starter', 97.00, 970.00, 10, 25, 1, '{"bid_writing": true, "ai_suggestions": true, "response_library": true, "basic_analytics": true, "email_alerts": true, "api_access": false, "white_label": false, "graph_view": false, "bulk_export": false}'),
('professional', 'Professional', 197.00, 1970.00, 50, 100, 5, '{"bid_writing": true, "ai_suggestions": true, "response_library": true, "advanced_analytics": true, "email_alerts": true, "slack_integration": true, "api_access": true, "white_label": false, "graph_view": false, "bulk_export": true, "win_prediction": true}'),
('agency', 'Agency', 297.00, 2970.00, -1, -1, -1, '{"bid_writing": true, "ai_suggestions": true, "response_library": true, "advanced_analytics": true, "email_alerts": true, "slack_integration": true, "api_access": true, "white_label": true, "graph_view": true, "bulk_export": true, "win_prediction": true, "custom_branding": true, "priority_support": true}')
ON CONFLICT (tier_code) DO NOTHING;

-- Note: -1 represents unlimited

-- Team Subscriptions
-- Link teams to subscription tiers

CREATE TABLE IF NOT EXISTS team_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    tier_id UUID NOT NULL REFERENCES subscription_tiers(id),
    status VARCHAR(50) NOT NULL DEFAULT 'active', -- 'active', 'cancelled', 'past_due', 'trialing'
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    trial_end TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    metadata JSONB
);

CREATE UNIQUE INDEX idx_team_subscriptions_team ON team_subscriptions(team_id);
CREATE INDEX idx_team_subscriptions_status ON team_subscriptions(status);
CREATE INDEX idx_team_subscriptions_stripe ON team_subscriptions(stripe_subscription_id);

-- Win Prediction Training Data
-- Store historical data for ML model training

CREATE TABLE IF NOT EXISTS win_prediction_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tender_id UUID REFERENCES tenders(id),
    team_id UUID REFERENCES teams(id),
    features JSONB NOT NULL, -- All features used for prediction
    outcome BOOLEAN, -- True if won, False if lost
    actual_winner_company_number VARCHAR(50),
    prediction_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_win_prediction_outcome ON win_prediction_data(outcome);
CREATE INDEX idx_win_prediction_date ON win_prediction_data(created_at);