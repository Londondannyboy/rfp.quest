'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useCopilotAction } from '@copilotkit/react-core';
import {
  TrophyIcon,
  XCircleIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
  PencilIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline';

interface BidOutcome {
  contractName: string;
  buyer: string;
  value?: number;
  year?: number;
  outcome: 'win' | 'loss';
  role?: string;
}

interface BidOutcomeConfirmationProps {
  bidData: BidOutcome;
  userEmail: string;
  onConfirm: (data: BidOutcome) => void;
  onCancel: () => void;
  onEdit: () => void;
}

/**
 * HITL confirmation card for bid outcomes
 */
function BidOutcomeConfirmation({
  bidData,
  userEmail,
  onConfirm,
  onCancel,
  onEdit,
}: BidOutcomeConfirmationProps) {
  const isWin = bidData.outcome === 'win';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl border-2 ${
        isWin ? 'border-blue-500 bg-blue-900/20' : 'border-red-500 bg-red-900/20'
      } p-6 shadow-lg`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isWin ? (
            <div className="p-2 bg-blue-100 rounded-full">
              <TrophyIcon className="w-6 h-6 text-green-600" />
            </div>
          ) : (
            <div className="p-2 bg-red-100 rounded-full">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          )}
          <h3 className="text-lg font-semibold text-slate-100">
            Confirm Bid {isWin ? 'Win' : 'Loss'}
          </h3>
        </div>
        <button
          onClick={onEdit}
          className="p-2 hover:bg-slate-900/40 backdrop-blur-xl rounded-lg transition-colors"
          aria-label="Edit details"
        >
          <PencilIcon className="w-4 h-4 text-slate-500" />
        </button>
      </div>

      {/* Bid Details */}
      <div className="space-y-3 mb-6">
        <div className="flex items-start gap-3">
          <BuildingOfficeIcon className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-200">Contract</p>
            <p className="text-sm text-slate-100">{bidData.contractName}</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <BuildingOfficeIcon className="w-5 h-5 text-slate-400 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-slate-200">Buyer</p>
            <p className="text-sm text-slate-100">{bidData.buyer}</p>
          </div>
        </div>

        {bidData.value && (
          <div className="flex items-start gap-3">
            <CurrencyPoundIcon className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-200">Value</p>
              <p className="text-sm text-slate-100">
                £{bidData.value.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {bidData.year && (
          <div className="flex items-start gap-3">
            <CalendarIcon className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-200">Year</p>
              <p className="text-sm text-slate-100">{bidData.year}</p>
            </div>
          </div>
        )}

        {bidData.role && (
          <div className="flex items-start gap-3">
            <UserIcon className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-slate-200">Your Role</p>
              <p className="text-sm text-slate-100">{bidData.role}</p>
            </div>
          </div>
        )}
      </div>

      {/* Info message */}
      <div className="bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-lg p-3 mb-4">
        <p className="text-xs text-slate-300">
          This will be added to your skills graph to track your bid history and win rate.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => onConfirm(bidData)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isWin
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <CheckCircleIcon className="w-5 h-5" />
          Confirm & Add to Graph
        </button>
        <button
          onClick={onCancel}
          className="px-4 py-2 border-slate-600/50 rounded-lg text-slate-200 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 transition-colors"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
}

/**
 * Bid outcome collection form
 */
function BidOutcomeForm({
  initialData,
  onSubmit,
  onCancel,
}: {
  initialData?: Partial<BidOutcome>;
  onSubmit: (data: BidOutcome) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Partial<BidOutcome>>(
    initialData || {
      outcome: 'win',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.contractName && formData.buyer) {
      onSubmit(formData as BidOutcome);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Outcome
        </label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setFormData({ ...formData, outcome: 'win' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
              formData.outcome === 'win'
                ? 'border-blue-500 bg-blue-600/20 text-green-400 border border-blue-500/30'
                : 'border-slate-600/50 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 text-slate-200'
            }`}
          >
            <TrophyIcon className="w-5 h-5 mx-auto mb-1" />
            Win
          </button>
          <button
            type="button"
            onClick={() => setFormData({ ...formData, outcome: 'loss' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
              formData.outcome === 'loss'
                ? 'border-red-500 bg-red-900/20 text-red-700'
                : 'border-slate-600/50 bg-slate-900/60 backdrop-blur-xl border-slate-700/50 text-slate-200'
            }`}
          >
            <XCircleIcon className="w-5 h-5 mx-auto mb-1" />
            Loss
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Contract Name *
        </label>
        <input
          type="text"
          required
          value={formData.contractName || ''}
          onChange={(e) =>
            setFormData({ ...formData, contractName: e.target.value })
          }
          className="w-full px-3 py-2 border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., NHS Digital Transformation"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Buyer Organization *
        </label>
        <input
          type="text"
          required
          value={formData.buyer || ''}
          onChange={(e) => setFormData({ ...formData, buyer: e.target.value })}
          className="w-full px-3 py-2 border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Department of Health"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Contract Value (£)
        </label>
        <input
          type="number"
          value={formData.value || ''}
          onChange={(e) =>
            setFormData({ ...formData, value: Number(e.target.value) })
          }
          className="w-full px-3 py-2 border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., 500000"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Year
        </label>
        <input
          type="number"
          value={formData.year || ''}
          onChange={(e) =>
            setFormData({ ...formData, year: Number(e.target.value) })
          }
          className="w-full px-3 py-2 border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder={new Date().getFullYear().toString()}
          min="2000"
          max={new Date().getFullYear()}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-200 mb-1">
          Your Role
        </label>
        <input
          type="text"
          value={formData.role || ''}
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          className="w-full px-3 py-2 border-slate-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Bid Manager, Lead Writer"
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Preview & Confirm
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border-slate-600/50 rounded-lg text-slate-200 hover:bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

/**
 * Main component for collecting bid outcomes with HITL
 */
export function BidOutcomeCollector({ userEmail }: { userEmail: string }) {
  const [mode, setMode] = useState<'idle' | 'form' | 'confirm'>('idle');
  const [bidData, setBidData] = useState<BidOutcome | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(
    null
  );

  // Register CopilotKit action for conversational collection
  useCopilotAction({
    name: 'collectBidOutcome',
    description:
      'Collect information about a bid win or loss from the user conversationally',
    parameters: [],
    handler: async () => {
      // This triggers the UI to show the form
      setMode('form');
      return 'I\'ll help you record a bid outcome. Please fill in the details in the form that appears.';
    },
  });

  // Handle bid outcome submission
  const handleConfirm = async (data: BidOutcome) => {
    setIsProcessing(true);
    try {
      // Call the addBidOutcome action via CopilotKit
      const response = await fetch('/api/copilotkit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'addBidOutcome',
          parameters: {
            email: userEmail,
            contract_name: data.contractName,
            buyer: data.buyer,
            value: data.value,
            year: data.year,
            outcome: data.outcome,
            role: data.role,
          },
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setResult({
          success: true,
          message: `${data.outcome === 'win' ? '🏆' : '📊'} ${
            data.outcome === 'win' ? 'Win' : 'Loss'
          } recorded for ${data.contractName}`,
        });
        setMode('idle');
        setBidData(null);
      } else {
        setResult({
          success: false,
          message: 'Failed to record bid outcome. Please try again.',
        });
      }
    } catch (error) {
      setResult({
        success: false,
        message: 'An error occurred. Please try again.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="relative">
      {/* Trigger Button */}
      {mode === 'idle' && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setMode('form')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all"
        >
          <SparklesIcon className="w-5 h-5" />
          Add Bid Outcome
        </motion.button>
      )}

      {/* Form Modal */}
      {mode === 'form' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md bg-slate-900/60 backdrop-blur-xl border-slate-700/50 rounded-xl shadow-xl p-6"
          >
            <h2 className="text-xl font-semibold text-slate-100 mb-4">
              Record Bid Outcome
            </h2>
            <BidOutcomeForm
              initialData={bidData || undefined}
              onSubmit={(data) => {
                setBidData(data);
                setMode('confirm');
              }}
              onCancel={() => {
                setMode('idle');
                setBidData(null);
              }}
            />
          </motion.div>
        </motion.div>
      )}

      {/* Confirmation Modal */}
      {mode === 'confirm' && bidData && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <BidOutcomeConfirmation
              bidData={bidData}
              userEmail={userEmail}
              onConfirm={handleConfirm}
              onCancel={() => {
                setMode('idle');
                setBidData(null);
              }}
              onEdit={() => setMode('form')}
            />
            {isProcessing && (
              <div className="mt-4 text-center text-sm text-slate-300">
                Adding to your skills graph...
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      {/* Result Toast */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className={`fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg ${
            result.success
              ? 'bg-blue-600 text-white'
              : 'bg-red-600 text-white'
          }`}
        >
          {result.message}
        </motion.div>
      )}
    </div>
  );
}