// Database Operations for RFP Quest
import { sql } from '@/lib/db';
import type {
  ResponseLibraryItem,
  Bid,
  TeamCredits,
  CreditTransaction,
  EnrichmentCache,
  NewResponseLibraryItem,
  NewBid,
  NewCreditTransaction,
  EnrichmentRequest,
  EnrichmentResponse,
  BidContent,
  TeamSubscription,
  SubscriptionTier
} from './types';

// Response Library Operations
export async function createResponseLibraryItem(item: NewResponseLibraryItem): Promise<ResponseLibraryItem> {
  const result = await sql`
    INSERT INTO response_library (
      team_id, title, content, category, tags, sector_codes,
      created_by, metadata
    ) VALUES (
      ${item.team_id}, ${item.title}, ${item.content}, 
      ${item.category}, ${item.tags}, ${item.sector_codes},
      ${item.created_by}, ${item.metadata}
    )
    RETURNING *
  `;
  return result[0] as ResponseLibraryItem;
}

export async function searchResponseLibrary(
  teamId: string,
  query?: string,
  category?: string,
  tags?: string[]
): Promise<ResponseLibraryItem[]> {
  let whereClause = `WHERE team_id = ${teamId}`;
  
  if (query) {
    whereClause += ` AND (title ILIKE '%${query}%' OR content ILIKE '%${query}%')`;
  }
  
  if (category) {
    whereClause += ` AND category = '${category}'`;
  }
  
  if (tags && tags.length > 0) {
    whereClause += ` AND tags && ARRAY[${tags.map(t => `'${t}'`).join(',')}]`;
  }
  
  const result = await sql`
    SELECT * FROM response_library
    ${sql.unsafe(whereClause)}
    ORDER BY usage_count DESC, win_rate DESC NULLS LAST
    LIMIT 50
  `;
  
  return result as ResponseLibraryItem[];
}

export async function trackResponseUsage(
  responseId: string,
  tenderId: string,
  bidId?: string
): Promise<void> {
  await sql`
    INSERT INTO response_usage (response_id, tender_id, bid_id)
    VALUES (${responseId}, ${tenderId}, ${bidId})
  `;
  
  // Increment usage count
  await sql`
    UPDATE response_library 
    SET usage_count = usage_count + 1
    WHERE id = ${responseId}
  `;
}

// Bid Management Operations
export async function createBid(bid: NewBid): Promise<Bid> {
  const result = await sql`
    INSERT INTO bids (
      tender_id, team_id, status, title, content,
      compliance_score, predicted_win_probability,
      created_by, metadata
    ) VALUES (
      ${bid.tender_id}, ${bid.team_id}, ${bid.status || 'draft'},
      ${bid.title}, ${JSON.stringify(bid.content)},
      ${bid.compliance_score}, ${bid.predicted_win_probability},
      ${bid.created_by}, ${bid.metadata}
    )
    RETURNING *
  `;
  return result[0] as Bid;
}

export async function updateBid(
  bidId: string,
  updates: Partial<Bid>
): Promise<Bid> {
  const { content, ...otherUpdates } = updates;
  
  // Build update clause
  const setClauses: string[] = [];
  const values: any[] = [bidId];
  let paramCount = 2;
  
  if (content) {
    setClauses.push(`content = $${paramCount}`);
    values.push(JSON.stringify(content));
    paramCount++;
  }
  
  if (otherUpdates.status) {
    setClauses.push(`status = $${paramCount}`);
    values.push(otherUpdates.status);
    paramCount++;
  }
  
  if (otherUpdates.compliance_score !== undefined) {
    setClauses.push(`compliance_score = $${paramCount}`);
    values.push(otherUpdates.compliance_score);
    paramCount++;
  }
  
  if (otherUpdates.predicted_win_probability !== undefined) {
    setClauses.push(`predicted_win_probability = $${paramCount}`);
    values.push(otherUpdates.predicted_win_probability);
    paramCount++;
  }
  
  setClauses.push('updated_at = CURRENT_TIMESTAMP');
  
  const query = `
    UPDATE bids
    SET ${setClauses.join(', ')}
    WHERE id = $1
    RETURNING *
  `;
  
  const result = await sql.unsafe(query) as unknown as any[];
  return result[0] as Bid;
}

export async function saveBidVersion(bidId: string, userId?: string): Promise<void> {
  // Get current bid content
  const currentBid = await sql`
    SELECT version, content FROM bids WHERE id = ${bidId}
  `;
  
  if (currentBid.length === 0) return;
  
  // Save as new version
  await sql`
    INSERT INTO bid_versions (
      bid_id, version_number, content, created_by
    ) VALUES (
      ${bidId}, ${currentBid[0].version}, 
      ${currentBid[0].content}, ${userId}
    )
  `;
  
  // Increment bid version
  await sql`
    UPDATE bids 
    SET version = version + 1
    WHERE id = ${bidId}
  `;
}

// Credits System Operations
export async function getTeamCredits(teamId: string): Promise<TeamCredits | null> {
  const result = await sql`
    SELECT * FROM team_credits
    WHERE team_id = ${teamId}
    LIMIT 1
  `;
  return (result[0] as TeamCredits) || null;
}

export async function initializeTeamCredits(
  teamId: string,
  tier: 'starter' | 'professional' | 'agency'
): Promise<TeamCredits> {
  const tierConfig = {
    starter: { monthly: 10 },
    professional: { monthly: 50 },
    agency: { monthly: -1 } // Unlimited
  };
  
  const config = tierConfig[tier];
  const periodEnd = new Date();
  periodEnd.setMonth(periodEnd.getMonth() + 1);
  
  const result = await sql`
    INSERT INTO team_credits (
      team_id, credits_remaining, credits_used_this_period,
      period_end, subscription_tier, monthly_allowance
    ) VALUES (
      ${teamId}, ${config.monthly}, 0,
      ${periodEnd.toISOString()}, ${tier}, ${config.monthly}
    )
    ON CONFLICT (team_id) 
    DO UPDATE SET
      subscription_tier = ${tier},
      monthly_allowance = ${config.monthly},
      credits_remaining = ${config.monthly}
    RETURNING *
  `;
  
  return result[0] as TeamCredits;
}

export async function useCredits(
  teamId: string,
  amount: number,
  description: string,
  referenceId?: string,
  referenceType?: 'company' | 'tender' | 'competitor',
  userId?: string
): Promise<{ success: boolean; remaining: number; message?: string }> {
  // Get current credits
  const credits = await getTeamCredits(teamId);
  
  if (!credits) {
    return { success: false, remaining: 0, message: 'No credits found for team' };
  }
  
  // Check if unlimited (-1)
  if (credits.credits_remaining === -1) {
    // Log transaction but don't deduct
    await logCreditTransaction({
      team_id: teamId,
      user_id: userId || null,
      transaction_type: 'enrichment',
      credits_amount: -amount,
      balance_after: -1,
      description,
      reference_id: referenceId || null,
      reference_type: referenceType || null,
      metadata: null
    });
    
    return { success: true, remaining: -1 };
  }
  
  // Check sufficient credits
  if (credits.credits_remaining < amount) {
    return {
      success: false,
      remaining: credits.credits_remaining,
      message: `Insufficient credits. ${amount} required, ${credits.credits_remaining} available`
    };
  }
  
  // Deduct credits
  const newBalance = credits.credits_remaining - amount;
  const newUsed = credits.credits_used_this_period + amount;
  
  await sql`
    UPDATE team_credits
    SET 
      credits_remaining = ${newBalance},
      credits_used_this_period = ${newUsed},
      updated_at = CURRENT_TIMESTAMP
    WHERE team_id = ${teamId}
  `;
  
  // Log transaction
  await logCreditTransaction({
    team_id: teamId,
    user_id: userId ?? null,
    transaction_type: 'enrichment',
    credits_amount: -amount,
    balance_after: newBalance,
    description,
    reference_id: referenceId ?? null,
    reference_type: referenceType ?? null,
    metadata: null
  });
  
  return { success: true, remaining: newBalance };
}

async function logCreditTransaction(transaction: NewCreditTransaction): Promise<void> {
  await sql`
    INSERT INTO credit_transactions (
      team_id, user_id, transaction_type, credits_amount,
      balance_after, description, reference_id, reference_type, metadata
    ) VALUES (
      ${transaction.team_id}, ${transaction.user_id},
      ${transaction.transaction_type}, ${transaction.credits_amount},
      ${transaction.balance_after}, ${transaction.description},
      ${transaction.reference_id}, ${transaction.reference_type},
      ${transaction.metadata}
    )
  `;
}

// Enrichment Cache Operations
export async function checkEnrichmentCache(
  cacheKey: string
): Promise<EnrichmentCache | null> {
  const result = await sql`
    SELECT * FROM enrichment_cache
    WHERE cache_key = ${cacheKey}
    AND expires_at > CURRENT_TIMESTAMP
    LIMIT 1
  `;
  
  if (result.length > 0) {
    // Update access stats
    await sql`
      UPDATE enrichment_cache
      SET 
        last_accessed = CURRENT_TIMESTAMP,
        access_count = access_count + 1
      WHERE id = ${result[0].id}
    `;
    
    return result[0] as EnrichmentCache;
  }
  
  return null;
}

export async function saveEnrichmentCache(
  cacheKey: string,
  dataType: 'company' | 'linkedin' | 'news' | 'accounts',
  data: any,
  source?: string,
  ttlDays: number = 30
): Promise<void> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + ttlDays);
  
  await sql`
    INSERT INTO enrichment_cache (
      cache_key, data_type, data, source, expires_at
    ) VALUES (
      ${cacheKey}, ${dataType}, ${JSON.stringify(data)},
      ${source}, ${expiresAt.toISOString()}
    )
    ON CONFLICT (cache_key)
    DO UPDATE SET
      data = ${JSON.stringify(data)},
      expires_at = ${expiresAt.toISOString()},
      last_accessed = CURRENT_TIMESTAMP
  `;
}

// Enrichment with Credits
export async function enrichWithCredits(
  teamId: string,
  request: EnrichmentRequest,
  userId?: string
): Promise<EnrichmentResponse> {
  const cacheKey = `${request.type}_${request.reference_id}`;
  
  // Check cache first unless force refresh
  if (!request.force_refresh) {
    const cached = await checkEnrichmentCache(cacheKey);
    if (cached) {
      return {
        success: true,
        credits_used: 0,
        data: cached.data,
        cached: true,
        expires_at: cached.expires_at
      };
    }
  }
  
  // Determine credit cost
  const creditCost = request.type === 'full' ? 3 : 1;
  
  // Check and use credits
  const creditResult = await useCredits(
    teamId,
    creditCost,
    `${request.type} enrichment for ${request.reference_id}`,
    request.reference_id,
    'company',
    userId
  );
  
  if (!creditResult.success) {
    return {
      success: false,
      credits_used: 0,
      data: null,
      cached: false,
      expires_at: new Date()
    };
  }
  
  // Here you would call the actual enrichment service
  // For now, returning placeholder
  const enrichedData = {
    type: request.type,
    reference_id: request.reference_id,
    enriched_at: new Date(),
    // Add actual enrichment logic here
  };
  
  // Save to cache
  await saveEnrichmentCache(
    cacheKey,
    request.type === 'company' ? 'company' : 'linkedin',
    enrichedData
  );
  
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  
  return {
    success: true,
    credits_used: creditCost,
    data: enrichedData,
    cached: false,
    expires_at: expiresAt
  };
}

// Subscription Operations
export async function getTeamSubscription(teamId: string): Promise<TeamSubscription | null> {
  const result = await sql`
    SELECT ts.*, st.*
    FROM team_subscriptions ts
    JOIN subscription_tiers st ON ts.tier_id = st.id
    WHERE ts.team_id = ${teamId}
    AND ts.status = 'active'
    LIMIT 1
  `;
  return (result[0] as TeamSubscription) || null;
}

export async function getSubscriptionTiers(): Promise<SubscriptionTier[]> {
  const result = await sql`
    SELECT * FROM subscription_tiers
    ORDER BY monthly_price ASC
  `;
  return result as SubscriptionTier[];
}

// Win Prediction Operations
export async function calculateWinProbability(
  tenderId: string,
  teamId: string
): Promise<number> {
  // This would connect to your ML model
  // For now, using a simple heuristic
  
  const features = await sql`
    SELECT 
      t.value as tender_value,
      t.cpv_codes,
      COUNT(DISTINCT c.id) as competitor_count
    FROM tenders t
    LEFT JOIN competitor_enrichments c ON t.ocid = c.tender_ocid
    WHERE t.id = ${tenderId}
    GROUP BY t.id
  `;
  
  if (features.length === 0) return 0.5;
  
  const f = features[0];
  
  // Simple heuristic (replace with ML model)
  let probability = 0.5;
  
  // Fewer competitors = higher chance
  if (f.competitor_count < 3) probability += 0.1;
  if (f.competitor_count > 10) probability -= 0.2;
  
  // Tender value affects probability
  if (f.tender_value < 100000) probability += 0.05;
  if (f.tender_value > 1000000) probability -= 0.1;
  
  return Math.max(0, Math.min(1, probability));
}

// Monthly Credit Refresh (run as cron job)
export async function refreshMonthlyCredits(): Promise<void> {
  const expiredPeriods = await sql`
    SELECT * FROM team_credits
    WHERE period_end < CURRENT_TIMESTAMP
  `;
  
  for (const credits of expiredPeriods) {
    const newPeriodEnd = new Date(credits.period_end);
    newPeriodEnd.setMonth(newPeriodEnd.getMonth() + 1);
    
    const newCredits = credits.rollover_enabled
      ? Math.min(credits.credits_remaining + credits.monthly_allowance, credits.monthly_allowance * 2)
      : credits.monthly_allowance;
    
    await sql`
      UPDATE team_credits
      SET 
        credits_remaining = ${newCredits},
        credits_used_this_period = 0,
        period_start = ${credits.period_end},
        period_end = ${newPeriodEnd.toISOString()},
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ${credits.id}
    `;
    
    // Log allocation
    await logCreditTransaction({
      team_id: credits.team_id,
      user_id: null,
      transaction_type: 'monthly_allocation',
      credits_amount: newCredits - credits.credits_remaining,
      balance_after: newCredits,
      description: 'Monthly credit allocation',
      reference_id: null,
      reference_type: null,
      metadata: { period_start: credits.period_end, period_end: newPeriodEnd }
    });
  }
}