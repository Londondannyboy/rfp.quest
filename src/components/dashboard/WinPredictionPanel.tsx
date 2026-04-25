'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ChartBarIcon,
  SparklesIcon,
  CheckCircleIcon,
  XCircleIcon,
  LightBulbIcon,
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import { predictWinProbability } from '@/lib/win-prediction';
import type { PredictionInput } from '@/lib/win-prediction';

interface WinPredictionPanelProps {
  tender: any;
  company?: any;
  bid?: any;
  onImprove?: () => void;
}

export function WinPredictionPanel({
  tender,
  company,
  bid,
  onImprove,
}: WinPredictionPanelProps) {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    calculatePrediction();
  }, [tender, company, bid]);

  const calculatePrediction = async () => {
    setLoading(true);
    
    try {
      // Build prediction input
      const input: PredictionInput = {
        // Company features
        companyAge: company?.years_established,
        companyTurnover: company?.annual_turnover,
        companyEmployees: company?.employee_count,
        hasSectorExperience: company?.sectors?.includes(tender.primary_cpv),
        locationMatch: company?.region === tender.region,
        
        // Tender features
        tenderValue: tender.value,
        tenderComplexity: tender.requirements?.length > 20 ? 'high' : 
                         tender.requirements?.length > 10 ? 'medium' : 'low',
        daysToDeadline: Math.ceil((new Date(tender.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
        incumbentPresent: tender.has_incumbent,
        competitorCount: tender.competitor_count || 5,
        
        // Historical features
        previousWinsWithBuyer: company?.buyer_history?.[tender.buyer_name]?.wins || 0,
        previousBidsWithBuyer: company?.buyer_history?.[tender.buyer_name]?.total || 0,
        sectorWinRate: company?.sector_performance?.[tender.primary_cpv] || 0.3,
        overallWinRate: company?.overall_win_rate || 0.25,
        
        // Bid quality features
        complianceScore: bid?.compliance_score || 0.7,
        responseCompleteness: bid?.completeness || 0.8,
        priceCompetitiveness: 0.6,
        uniqueValueProps: 3,
        hasReferences: true,
        hasCaseStudies: true,
      };
      
      const result = predictWinProbability(input);
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getProbabilityColor = (probability: number) => {
    if (probability >= 0.7) return 'text-green-600';
    if (probability >= 0.5) return 'text-yellow-600';
    if (probability >= 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getProbabilityBg = (probability: number) => {
    if (probability >= 0.7) return 'bg-green-900/20 border-green-200';
    if (probability >= 0.5) return 'bg-yellow-50 border-yellow-200';
    if (probability >= 0.3) return 'bg-orange-50 border-orange-200';
    return 'bg-red-900/20 border-red-200';
  };

  const getConfidenceIcon = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <CheckCircleIcon className="w-4 h-4 text-green-600" />;
      case 'medium':
        return <InformationCircleIcon className="w-4 h-4 text-yellow-600" />;
      case 'low':
        return <ExclamationTriangleIcon className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-700/50 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-slate-800/60 rounded w-32 mb-4"></div>
          <div className="h-20 bg-slate-900/40 backdrop-blur-xl rounded mb-4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-800/60 rounded w-3/4"></div>
            <div className="h-4 bg-slate-800/60 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!prediction) {
    return null;
  }

  const probability = Math.round(prediction.probability * 100);

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg border-slate-700/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-slate-100 flex items-center gap-2">
            <ChartBarIcon className="w-5 h-5 text-slate-500" />
            Win Prediction Analysis
          </h3>
          <div className="flex items-center gap-2">
            {getConfidenceIcon(prediction.confidence)}
            <span className="text-sm text-slate-300">
              {prediction.confidence} confidence
            </span>
          </div>
        </div>
      </div>

      {/* Main Probability Display */}
      <div className="p-6">
        <div className={`rounded-xl border-2 p-6 ${getProbabilityBg(prediction.probability)}`}>
          <div className="text-center">
            <div className={`text-5xl font-bold ${getProbabilityColor(prediction.probability)}`}>
              {probability}%
            </div>
            <p className="text-slate-300 mt-2">Estimated win probability</p>
          </div>
          
          {/* Visual Bar */}
          <div className="mt-6">
            <div className="w-full bg-slate-800/60 rounded-full h-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${probability}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className={`h-4 rounded-full ${
                  probability >= 70 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                  probability >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                  probability >= 30 ? 'bg-gradient-to-r from-orange-400 to-orange-600' :
                  'bg-gradient-to-r from-red-400 to-red-600'
                }`}
              />
            </div>
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>
        </div>

        {/* Key Factors */}
        <div className="mt-6">
          <h4 className="font-medium text-slate-100 mb-3">Key Factors</h4>
          <div className="space-y-2">
            {prediction.factors.map((factor: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 hover:bg-slate-900/40 backdrop-blur-xl transition-colors"
              >
                <div className="flex items-center gap-2">
                  {factor.positive ? (
                    <ArrowTrendingUpIcon className="w-4 h-4 text-green-600" />
                  ) : (
                    <ArrowTrendingDownIcon className="w-4 h-4 text-red-600" />
                  )}
                  <span className="text-sm text-slate-200">{factor.name}</span>
                </div>
                <span className={`text-sm font-medium ${
                  factor.positive ? 'text-green-600' : 'text-red-600'
                }`}>
                  {factor.positive ? '+' : '-'}{Math.round(factor.impact * 100)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {prediction.recommendations.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-slate-100 mb-3 flex items-center gap-2">
              <LightBulbIcon className="w-5 h-5 text-yellow-500" />
              Recommendations to Improve
            </h4>
            <div className="space-y-2">
              {prediction.recommendations.map((rec: string, index: number) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border-blue-200"
                >
                  <SparklesIcon className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-900">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1 px-4 py-2 border-slate-700/50 rounded-lg hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 text-slate-200 text-sm font-medium transition-colors"
          >
            {showDetails ? 'Hide' : 'Show'} Detailed Analysis
          </button>
          {onImprove && (
            <button
              onClick={onImprove}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Improve Bid
            </button>
          )}
        </div>

        {/* Detailed Analysis */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 pt-6 border-t border-slate-700/50"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h5 className="text-sm font-medium text-slate-200 mb-2">Strengths</h5>
                <ul className="space-y-1">
                  {prediction.factors
                    .filter((f: any) => f.positive)
                    .map((factor: any, index: number) => (
                      <li key={index} className="text-xs text-slate-300 flex items-center gap-1">
                        <CheckCircleIcon className="w-3 h-3 text-green-500" />
                        {factor.name}
                      </li>
                    ))}
                </ul>
              </div>
              <div>
                <h5 className="text-sm font-medium text-slate-200 mb-2">Weaknesses</h5>
                <ul className="space-y-1">
                  {prediction.factors
                    .filter((f: any) => !f.positive)
                    .map((factor: any, index: number) => (
                      <li key={index} className="text-xs text-slate-300 flex items-center gap-1">
                        <XCircleIcon className="w-3 h-3 text-red-500" />
                        {factor.name}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 rounded-lg">
              <p className="text-xs text-slate-300">
                <strong>Note:</strong> This prediction is based on historical data and current bid quality.
                Actual results may vary based on factors not captured in the model.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}