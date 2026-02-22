'use client';

import { useEffect, useMemo } from 'react';
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon as CheckCircleSolid } from '@heroicons/react/24/solid';
import type { BidSection } from '@/lib/db/types';

interface ComplianceCheckerProps {
  sections: BidSection[];
  requirements: any[]; // Tender requirements
  onScoreUpdate?: (score: number) => void;
}

export function ComplianceChecker({
  sections,
  requirements,
  onScoreUpdate,
}: ComplianceCheckerProps) {
  const complianceStatus = useMemo(() => {
    const status = requirements.map((req) => {
      const section = sections.find(s => s.requirement_ref === req.id);
      const hasContent = section && section.content.length > 50;
      const wordCount = section?.word_count || 0;
      const minWords = req.min_words || 100;
      
      let complianceLevel: 'compliant' | 'partial' | 'non-compliant' = 'non-compliant';
      let issues: string[] = [];
      
      if (!section || !section.content) {
        complianceLevel = 'non-compliant';
        issues.push('No response provided');
      } else if (wordCount < minWords) {
        complianceLevel = 'partial';
        issues.push(`Below minimum word count (${wordCount}/${minWords})`);
      } else if (hasContent) {
        // Check for specific keywords if required
        if (req.required_keywords) {
          const missingKeywords = req.required_keywords.filter(
            (keyword: string) => !section.content.toLowerCase().includes(keyword.toLowerCase())
          );
          if (missingKeywords.length > 0) {
            complianceLevel = 'partial';
            issues.push(`Missing keywords: ${missingKeywords.join(', ')}`);
          } else {
            complianceLevel = 'compliant';
          }
        } else {
          complianceLevel = 'compliant';
        }
      }
      
      return {
        requirement: req,
        section,
        complianceLevel,
        issues,
        mandatory: req.mandatory || false,
      };
    });
    
    // Calculate overall compliance score
    const mandatoryItems = status.filter(s => s.mandatory);
    const mandatoryCompliant = mandatoryItems.filter(s => s.complianceLevel === 'compliant').length;
    const totalCompliant = status.filter(s => s.complianceLevel === 'compliant').length;
    const totalPartial = status.filter(s => s.complianceLevel === 'partial').length;
    
    const score = requirements.length > 0
      ? ((totalCompliant * 1 + totalPartial * 0.5) / requirements.length) * 100
      : 0;
    
    return {
      items: status,
      score,
      mandatoryComplete: mandatoryCompliant === mandatoryItems.length,
      summary: {
        total: requirements.length,
        compliant: totalCompliant,
        partial: totalPartial,
        nonCompliant: requirements.length - totalCompliant - totalPartial,
      },
    };
  }, [sections, requirements]);

  useEffect(() => {
    if (onScoreUpdate) {
      onScoreUpdate(complianceStatus.score / 100);
    }
  }, [complianceStatus.score, onScoreUpdate]);

  const getStatusIcon = (level: string) => {
    switch (level) {
      case 'compliant':
        return <CheckCircleSolid className="w-5 h-5 text-green-500" />;
      case 'partial':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />;
      case 'non-compliant':
        return <XCircleIcon className="w-5 h-5 text-red-500" />;
      default:
        return <InformationCircleIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (level: string) => {
    switch (level) {
      case 'compliant':
        return 'bg-green-50 border-green-200';
      case 'partial':
        return 'bg-yellow-50 border-yellow-200';
      case 'non-compliant':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Overall Score */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-gray-900">Compliance Score</h4>
          <span className={`text-2xl font-bold ${
            complianceStatus.score >= 80 ? 'text-green-600' :
            complianceStatus.score >= 60 ? 'text-yellow-600' :
            'text-red-600'
          }`}>
            {Math.round(complianceStatus.score)}%
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all ${
              complianceStatus.score >= 80 ? 'bg-green-500' :
              complianceStatus.score >= 60 ? 'bg-yellow-500' :
              'bg-red-500'
            }`}
            style={{ width: `${complianceStatus.score}%` }}
          />
        </div>
        
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-green-50 rounded-lg p-2">
            <div className="text-lg font-semibold text-green-700">
              {complianceStatus.summary.compliant}
            </div>
            <div className="text-xs text-green-600">Compliant</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-2">
            <div className="text-lg font-semibold text-yellow-700">
              {complianceStatus.summary.partial}
            </div>
            <div className="text-xs text-yellow-600">Partial</div>
          </div>
          <div className="bg-red-50 rounded-lg p-2">
            <div className="text-lg font-semibold text-red-700">
              {complianceStatus.summary.nonCompliant}
            </div>
            <div className="text-xs text-red-600">Missing</div>
          </div>
        </div>
        
        {!complianceStatus.mandatoryComplete && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ Missing mandatory requirements
            </p>
          </div>
        )}
      </div>
      
      {/* Detailed Requirements */}
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {complianceStatus.items.map((item, index) => (
          <div
            key={item.requirement.id || index}
            className={`rounded-lg border p-3 ${getStatusColor(item.complianceLevel)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 flex-1">
                {getStatusIcon(item.complianceLevel)}
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {item.requirement.title || `Section ${index + 1}`}
                    {item.mandatory && (
                      <span className="ml-2 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-medium">
                        Required
                      </span>
                    )}
                  </p>
                  {item.issues.length > 0 && (
                    <ul className="mt-1 text-xs text-gray-600">
                      {item.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
              {item.section?.word_count !== undefined && (
                <span className="text-xs text-gray-500 ml-2">
                  {item.section.word_count} words
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}