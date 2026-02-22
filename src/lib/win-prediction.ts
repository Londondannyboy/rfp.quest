// Win Prediction Algorithm for RFP Quest
// Uses historical data and company features to predict win probability

import type { WinPredictionFeatures } from './db/types';

interface PredictionInput {
  // Company features
  companyAge?: number;
  companyTurnover?: number;
  companyEmployees?: number;
  hasSectorExperience?: boolean;
  locationMatch?: boolean;
  
  // Tender features
  tenderValue?: number;
  tenderComplexity?: 'low' | 'medium' | 'high';
  daysToDeadline?: number;
  incumbentPresent?: boolean;
  competitorCount?: number;
  
  // Historical features
  previousWinsWithBuyer?: number;
  previousBidsWithBuyer?: number;
  sectorWinRate?: number;
  overallWinRate?: number;
  
  // Bid quality features
  complianceScore?: number;
  responseCompleteness?: number;
  priceCompetitiveness?: number;
  uniqueValueProps?: number;
  hasReferences?: boolean;
  hasCaseStudies?: boolean;
}

interface WeightedFeature {
  value: number;
  weight: number;
  category: 'company' | 'tender' | 'history' | 'quality';
}

export class WinPredictionModel {
  // Feature weights trained from historical data
  // In production, these would be ML-derived weights
  private weights = {
    // Company features (25% of total weight)
    companySize: 0.05,
    sectorMatch: 0.10,
    locationMatch: 0.05,
    companyAge: 0.05,
    
    // Tender features (25% of total weight)
    tenderValueMatch: 0.08,
    competitionLevel: 0.07,
    timeToDeadline: 0.05,
    incumbentFactor: 0.05,
    
    // Historical performance (30% of total weight)
    buyerHistory: 0.10,
    sectorPerformance: 0.10,
    overallWinRate: 0.10,
    
    // Bid quality (20% of total weight)
    compliance: 0.08,
    completeness: 0.06,
    pricing: 0.04,
    differentiators: 0.02,
  };
  
  predict(input: PredictionInput): {
    probability: number;
    confidence: 'low' | 'medium' | 'high';
    factors: Array<{ name: string; impact: number; positive: boolean }>;
    recommendations: string[];
  } {
    const features = this.extractFeatures(input);
    const score = this.calculateScore(features);
    const factors = this.getKeyFactors(features);
    const recommendations = this.generateRecommendations(features, score);
    const confidence = this.calculateConfidence(input);
    
    return {
      probability: Math.min(Math.max(score, 0), 1), // Clamp between 0 and 1
      confidence,
      factors,
      recommendations,
    };
  }
  
  private extractFeatures(input: PredictionInput): WeightedFeature[] {
    const features: WeightedFeature[] = [];
    
    // Company size score (larger companies have advantage on large tenders)
    if (input.companyTurnover !== undefined && input.tenderValue !== undefined) {
      const sizeRatio = input.companyTurnover / input.tenderValue;
      const sizeScore = this.sigmoid(sizeRatio, 10, 0.5); // Optimal at 10x tender value
      features.push({
        value: sizeScore,
        weight: this.weights.companySize,
        category: 'company',
      });
    }
    
    // Sector experience
    if (input.hasSectorExperience !== undefined) {
      features.push({
        value: input.hasSectorExperience ? 0.9 : 0.3,
        weight: this.weights.sectorMatch,
        category: 'company',
      });
    }
    
    // Location advantage
    if (input.locationMatch !== undefined) {
      features.push({
        value: input.locationMatch ? 0.8 : 0.5,
        weight: this.weights.locationMatch,
        category: 'company',
      });
    }
    
    // Company maturity
    if (input.companyAge !== undefined) {
      const ageScore = this.sigmoid(input.companyAge, 5, 0.3); // Optimal at 5+ years
      features.push({
        value: ageScore,
        weight: this.weights.companyAge,
        category: 'company',
      });
    }
    
    // Competition level
    if (input.competitorCount !== undefined) {
      const competitionScore = 1 - this.sigmoid(input.competitorCount, 5, 0.5);
      features.push({
        value: competitionScore,
        weight: this.weights.competitionLevel,
        category: 'tender',
      });
    }
    
    // Incumbent disadvantage
    if (input.incumbentPresent !== undefined) {
      features.push({
        value: input.incumbentPresent ? 0.3 : 0.7,
        weight: this.weights.incumbentFactor,
        category: 'tender',
      });
    }
    
    // Time pressure (less time = lower chance)
    if (input.daysToDeadline !== undefined) {
      const timeScore = this.sigmoid(input.daysToDeadline, 14, 0.3); // Optimal at 14+ days
      features.push({
        value: timeScore,
        weight: this.weights.timeToDeadline,
        category: 'tender',
      });
    }
    
    // Historical performance with buyer
    if (input.previousBidsWithBuyer !== undefined && input.previousWinsWithBuyer !== undefined) {
      const buyerWinRate = input.previousBidsWithBuyer > 0 
        ? input.previousWinsWithBuyer / input.previousBidsWithBuyer
        : 0.5;
      features.push({
        value: buyerWinRate,
        weight: this.weights.buyerHistory,
        category: 'history',
      });
    }
    
    // Sector win rate
    if (input.sectorWinRate !== undefined) {
      features.push({
        value: input.sectorWinRate,
        weight: this.weights.sectorPerformance,
        category: 'history',
      });
    }
    
    // Overall win rate
    if (input.overallWinRate !== undefined) {
      features.push({
        value: input.overallWinRate,
        weight: this.weights.overallWinRate,
        category: 'history',
      });
    }
    
    // Compliance score
    if (input.complianceScore !== undefined) {
      features.push({
        value: input.complianceScore,
        weight: this.weights.compliance,
        category: 'quality',
      });
    }
    
    // Response completeness
    if (input.responseCompleteness !== undefined) {
      features.push({
        value: input.responseCompleteness,
        weight: this.weights.completeness,
        category: 'quality',
      });
    }
    
    // Price competitiveness
    if (input.priceCompetitiveness !== undefined) {
      features.push({
        value: input.priceCompetitiveness,
        weight: this.weights.pricing,
        category: 'quality',
      });
    }
    
    // Unique value propositions
    if (input.uniqueValueProps !== undefined) {
      const uvpScore = this.sigmoid(input.uniqueValueProps, 3, 0.3); // Optimal at 3+ UVPs
      features.push({
        value: uvpScore,
        weight: this.weights.differentiators,
        category: 'quality',
      });
    }
    
    return features;
  }
  
  private calculateScore(features: WeightedFeature[]): number {
    if (features.length === 0) return 0.5; // No data = 50% baseline
    
    // Calculate weighted average
    const totalWeight = features.reduce((sum, f) => sum + f.weight, 0);
    const weightedSum = features.reduce((sum, f) => sum + f.value * f.weight, 0);
    
    // Base probability
    let probability = totalWeight > 0 ? weightedSum / totalWeight : 0.5;
    
    // Apply category bonuses
    const categoryScores = this.getCategoryScores(features);
    
    // Boost if all categories are strong
    if (Object.values(categoryScores).every(score => score > 0.7)) {
      probability = probability * 1.15; // 15% bonus for excellence across all areas
    }
    
    // Penalty if any category is very weak
    if (Object.values(categoryScores).some(score => score < 0.3)) {
      probability = probability * 0.85; // 15% penalty for critical weakness
    }
    
    return probability;
  }
  
  private getCategoryScores(features: WeightedFeature[]): Record<string, number> {
    const categories = ['company', 'tender', 'history', 'quality'];
    const scores: Record<string, number> = {};
    
    for (const category of categories) {
      const categoryFeatures = features.filter(f => f.category === category);
      if (categoryFeatures.length > 0) {
        const catWeight = categoryFeatures.reduce((sum, f) => sum + f.weight, 0);
        const catSum = categoryFeatures.reduce((sum, f) => sum + f.value * f.weight, 0);
        scores[category] = catWeight > 0 ? catSum / catWeight : 0;
      } else {
        scores[category] = 0.5; // No data = neutral
      }
    }
    
    return scores;
  }
  
  private getKeyFactors(
    features: WeightedFeature[]
  ): Array<{ name: string; impact: number; positive: boolean }> {
    const factors = [];
    
    // Map features to human-readable names
    const featureNames: Record<number, string> = {
      [this.weights.companySize]: 'Company size vs tender value',
      [this.weights.sectorMatch]: 'Sector experience',
      [this.weights.locationMatch]: 'Geographic proximity',
      [this.weights.companyAge]: 'Company maturity',
      [this.weights.competitionLevel]: 'Competition level',
      [this.weights.incumbentFactor]: 'Incumbent advantage',
      [this.weights.timeToDeadline]: 'Time to prepare',
      [this.weights.buyerHistory]: 'History with buyer',
      [this.weights.sectorPerformance]: 'Sector win rate',
      [this.weights.overallWinRate]: 'Overall win rate',
      [this.weights.compliance]: 'Compliance score',
      [this.weights.completeness]: 'Response completeness',
      [this.weights.pricing]: 'Price competitiveness',
      [this.weights.differentiators]: 'Unique value propositions',
    };
    
    // Sort features by impact (weight * deviation from 0.5)
    const sortedFeatures = features
      .map(f => ({
        name: featureNames[f.weight] || 'Unknown factor',
        impact: f.weight * Math.abs(f.value - 0.5),
        positive: f.value > 0.5,
        value: f.value,
      }))
      .sort((a, b) => b.impact - a.impact)
      .slice(0, 5); // Top 5 factors
    
    return sortedFeatures;
  }
  
  private generateRecommendations(features: WeightedFeature[], score: number): string[] {
    const recommendations: string[] = [];
    const categoryScores = this.getCategoryScores(features);
    
    // Company recommendations
    if (categoryScores.company < 0.5) {
      recommendations.push('Strengthen company credentials and experience evidence');
    }
    
    // Tender fit recommendations
    if (categoryScores.tender < 0.5) {
      const competitorFeature = features.find(f => f.weight === this.weights.competitionLevel);
      if (competitorFeature && competitorFeature.value < 0.5) {
        recommendations.push('High competition - emphasize unique differentiators');
      }
      
      const timeFeature = features.find(f => f.weight === this.weights.timeToDeadline);
      if (timeFeature && timeFeature.value < 0.5) {
        recommendations.push('Limited time - consider using response library templates');
      }
    }
    
    // Historical performance
    if (categoryScores.history < 0.5) {
      recommendations.push('First bid with this buyer - research their priorities thoroughly');
    }
    
    // Bid quality
    if (categoryScores.quality < 0.6) {
      const complianceFeature = features.find(f => f.weight === this.weights.compliance);
      if (complianceFeature && complianceFeature.value < 0.8) {
        recommendations.push('Improve compliance - address all mandatory requirements');
      }
      
      recommendations.push('Add case studies and references to strengthen credibility');
    }
    
    // High-level strategic recommendations
    if (score < 0.3) {
      recommendations.push('Consider partnering or subcontracting to strengthen bid');
    } else if (score > 0.7) {
      recommendations.push('Strong position - focus on presentation and pricing strategy');
    }
    
    return recommendations.slice(0, 4); // Max 4 recommendations
  }
  
  private calculateConfidence(input: PredictionInput): 'low' | 'medium' | 'high' {
    // Count how many data points we have
    const dataPoints = Object.values(input).filter(v => v !== undefined).length;
    const totalPossible = 20; // Approximate number of possible inputs
    
    const dataCompleteness = dataPoints / totalPossible;
    
    if (dataCompleteness > 0.7) return 'high';
    if (dataCompleteness > 0.4) return 'medium';
    return 'low';
  }
  
  // Sigmoid function for smooth scoring
  private sigmoid(x: number, midpoint: number, steepness: number): number {
    return 1 / (1 + Math.exp(-steepness * (x - midpoint)));
  }
}

// Factory function to create and use the model
export function predictWinProbability(input: PredictionInput) {
  const model = new WinPredictionModel();
  return model.predict(input);
}

// Training data collection function
export function collectTrainingData(
  tender: any,
  company: any,
  bid: any,
  outcome: boolean
): WinPredictionFeatures {
  return {
    // Company features
    company_age_years: company.age || 0,
    company_turnover: company.turnover || 0,
    company_employees: company.employees || 0,
    company_sector_match: tender.cpv_codes?.some((code: string) => 
      company.sectors?.includes(code)
    ) || false,
    company_location_match: company.region === tender.region,
    
    // Tender features
    tender_value: tender.value || 0,
    tender_complexity_score: calculateComplexity(tender),
    days_to_deadline: getDaysToDeadline(tender.deadline),
    incumbent_bidding: tender.incumbent_present || false,
    number_of_competitors: tender.competitor_count || 0,
    
    // Historical features
    previous_wins_with_buyer: company.buyer_history?.[tender.buyer_name]?.wins || 0,
    previous_bids_with_buyer: company.buyer_history?.[tender.buyer_name]?.bids || 0,
    sector_win_rate: company.sector_performance?.[tender.primary_cpv] || 0,
    similar_value_win_rate: calculateSimilarValueWinRate(company, tender.value),
    
    // Bid quality features
    compliance_score: bid.compliance_score || 0,
    response_completeness: bid.completeness || 0,
    price_competitiveness: calculatePriceCompetitiveness(bid, tender),
    unique_value_props: bid.unique_props?.length || 0,
  };
}

// Helper functions
function calculateComplexity(tender: any): number {
  let score = 0.5; // Base complexity
  
  if (tender.requirements?.length > 20) score += 0.2;
  if (tender.value > 1000000) score += 0.1;
  if (tender.multi_lot) score += 0.1;
  if (tender.framework) score += 0.1;
  
  return Math.min(score, 1);
}

function getDaysToDeadline(deadline: string | Date): number {
  const target = new Date(deadline);
  const now = new Date();
  const diffMs = target.getTime() - now.getTime();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}

function calculateSimilarValueWinRate(company: any, tenderValue: number): number {
  if (!company.bid_history) return 0;
  
  const range = 0.5; // 50% range
  const min = tenderValue * (1 - range);
  const max = tenderValue * (1 + range);
  
  const similarBids = company.bid_history.filter((bid: any) => 
    bid.value >= min && bid.value <= max
  );
  
  if (similarBids.length === 0) return 0;
  
  const wins = similarBids.filter((bid: any) => bid.outcome === 'won').length;
  return wins / similarBids.length;
}

function calculatePriceCompetitiveness(bid: any, tender: any): number {
  if (!bid.price || !tender.estimated_value) return 0.5;
  
  const ratio = bid.price / tender.estimated_value;
  
  if (ratio < 0.7) return 0.9; // Very competitive
  if (ratio < 0.85) return 0.7; // Competitive
  if (ratio < 1) return 0.5; // Average
  if (ratio < 1.15) return 0.3; // Expensive
  return 0.1; // Very expensive
}