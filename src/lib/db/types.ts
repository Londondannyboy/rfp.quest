// Database Types for RFP Quest

export interface ResponseLibraryItem {
  id: string;
  team_id: string;
  title: string;
  content: string;
  category: 'technical' | 'commercial' | 'sustainability' | 'quality' | 'experience' | null;
  tags: string[];
  sector_codes: string[];
  usage_count: number;
  win_rate: number | null;
  created_by: string | null;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, any> | null;
}

export interface ResponseUsage {
  id: string;
  response_id: string;
  tender_id: string;
  bid_id: string | null;
  used_at: Date;
  outcome: 'won' | 'lost' | 'pending' | 'withdrawn' | null;
  score: number | null;
  modifications: string | null;
}

export interface Bid {
  id: string;
  tender_id: string;
  team_id: string;
  status: 'draft' | 'in_review' | 'submitted' | 'won' | 'lost';
  version: number;
  title: string | null;
  content: BidContent;
  compliance_score: number | null;
  predicted_win_probability: number | null;
  submission_date: Date | null;
  outcome_date: Date | null;
  contract_value: number | null;
  feedback: string | null;
  created_at: Date;
  updated_at: Date;
  created_by: string | null;
  metadata: Record<string, any> | null;
}

export interface BidContent {
  sections: BidSection[];
  executive_summary?: string;
  methodology?: string;
  pricing?: BidPricing;
  appendices?: BidAppendix[];
}

export interface BidSection {
  id: string;
  title: string;
  content: string;
  requirement_ref?: string; // Reference to tender requirement
  response_library_ids?: string[]; // Used response templates
  compliance_status?: 'compliant' | 'partial' | 'non-compliant';
  word_count?: number;
}

export interface BidPricing {
  total: number;
  currency: string;
  breakdown: Array<{
    item: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  payment_terms?: string;
  validity_period?: string;
}

export interface BidAppendix {
  title: string;
  type: 'document' | 'certification' | 'case_study' | 'reference';
  url?: string;
  content?: string;
}

export interface BidVersion {
  id: string;
  bid_id: string;
  version_number: number;
  content: BidContent;
  changes_summary: string | null;
  created_by: string | null;
  created_at: Date;
}

export interface TeamCredits {
  id: string;
  team_id: string;
  credits_remaining: number;
  credits_used_this_period: number;
  period_start: Date;
  period_end: Date;
  subscription_tier: 'starter' | 'professional' | 'agency' | null;
  monthly_allowance: number;
  rollover_enabled: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreditTransaction {
  id: string;
  team_id: string;
  user_id: string | null;
  transaction_type: 'enrichment' | 'refund' | 'purchase' | 'monthly_allocation';
  credits_amount: number; // Positive for additions, negative for usage
  balance_after: number;
  description: string | null;
  reference_id: string | null;
  reference_type: 'company' | 'tender' | 'competitor' | null;
  created_at: Date;
  metadata: Record<string, any> | null;
}

export interface EnrichmentCache {
  id: string;
  cache_key: string;
  data_type: 'company' | 'linkedin' | 'news' | 'accounts';
  data: Record<string, any>;
  source: 'companies_house' | 'linkedin' | 'tavily' | null;
  expires_at: Date;
  created_at: Date;
  last_accessed: Date;
  access_count: number;
}

export interface SubscriptionTier {
  id: string;
  tier_code: 'starter' | 'professional' | 'agency';
  name: string;
  monthly_price: number;
  annual_price: number | null;
  credits_per_month: number; // -1 for unlimited
  max_tenders_monitored: number | null; // -1 for unlimited
  max_team_members: number | null; // -1 for unlimited
  features: SubscriptionFeatures;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionFeatures {
  bid_writing: boolean;
  ai_suggestions: boolean;
  response_library: boolean;
  basic_analytics?: boolean;
  advanced_analytics?: boolean;
  email_alerts: boolean;
  slack_integration?: boolean;
  api_access: boolean;
  white_label: boolean;
  graph_view: boolean;
  bulk_export: boolean;
  win_prediction?: boolean;
  custom_branding?: boolean;
  priority_support?: boolean;
}

export interface TeamSubscription {
  id: string;
  team_id: string;
  tier_id: string;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  current_period_start: Date | null;
  current_period_end: Date | null;
  cancel_at_period_end: boolean;
  trial_end: Date | null;
  created_at: Date;
  updated_at: Date;
  metadata: Record<string, any> | null;
}

export interface WinPredictionData {
  id: string;
  tender_id: string | null;
  team_id: string | null;
  features: WinPredictionFeatures;
  outcome: boolean | null;
  actual_winner_company_number: string | null;
  prediction_score: number | null;
  created_at: Date;
}

export interface WinPredictionFeatures {
  // Company features
  company_age_years: number;
  company_turnover: number;
  company_employees: number;
  company_sector_match: boolean;
  company_location_match: boolean;
  
  // Tender features
  tender_value: number;
  tender_complexity_score: number;
  days_to_deadline: number;
  incumbent_bidding: boolean;
  number_of_competitors: number;
  
  // Historical features
  previous_wins_with_buyer: number;
  previous_bids_with_buyer: number;
  sector_win_rate: number;
  similar_value_win_rate: number;
  
  // Bid quality features
  compliance_score: number;
  response_completeness: number;
  price_competitiveness: number;
  unique_value_props: number;
}

// Helper type for creating new records
export type NewResponseLibraryItem = Omit<ResponseLibraryItem, 'id' | 'created_at' | 'updated_at' | 'usage_count'>;
export type NewBid = Omit<Bid, 'id' | 'created_at' | 'updated_at' | 'version'>;
export type NewCreditTransaction = Omit<CreditTransaction, 'id' | 'created_at'>;

// Enrichment request/response types
export interface EnrichmentRequest {
  type: 'company' | 'linkedin' | 'full';
  reference_id: string;
  force_refresh?: boolean; // Bypass cache
}

export interface EnrichmentResponse {
  success: boolean;
  credits_used: number;
  data: any;
  cached: boolean;
  expires_at: Date;
}