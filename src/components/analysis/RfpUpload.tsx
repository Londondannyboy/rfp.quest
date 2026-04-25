'use client';

import { useState, useCallback, useRef } from 'react';
import {
  CloudArrowUpIcon,
  DocumentIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface UploadedFile {
  id: string;
  filename: string;
  originalFilename: string;
  url: string;
  size: number;
  status: string;
}

interface Props {
  onUploadComplete?: (upload: UploadedFile) => void;
  onAnalyze?: (uploadId: string) => void;
  userId?: string;
  className?: string;
}

type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

export function RfpUpload({ onUploadComplete, onAnalyze, userId, className = '' }: Props) {
  const [status, setStatus] = useState<UploadStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const uploadFile = useCallback(
    async (file: File) => {
      // Validate file type
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file');
        setStatus('error');
        return;
      }

      // Validate file size (50MB max)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        setStatus('error');
        return;
      }

      setStatus('uploading');
      setProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('file', file);
        if (userId) {
          formData.append('userId', userId);
        }

        // Simulate progress (actual progress would need XMLHttpRequest)
        const progressInterval = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        clearInterval(progressInterval);

        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Upload failed');
        }

        const data = await response.json();
        setProgress(100);
        setStatus('success');
        setUploadedFile(data);
        onUploadComplete?.(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Upload failed');
        setStatus('error');
      }
    },
    [userId, onUploadComplete]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadFile(file);
      }
    },
    [uploadFile]
  );

  const handleReset = useCallback(() => {
    setStatus('idle');
    setProgress(0);
    setError(null);
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleAnalyze = useCallback(() => {
    if (uploadedFile?.id) {
      onAnalyze?.(uploadedFile.id);
    }
  }, [uploadedFile, onAnalyze]);

  return (
    <div className={`w-full ${className}`}>
      {status === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer
            ${
              isDragging
                ? 'border-blue-500/50 bg-blue-950/200/10'
                : 'border-slate-600 hover:border-slate-500 bg-slate-800/30'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileSelect}
            className="hidden"
          />

          <CloudArrowUpIcon
            className={`mx-auto h-12 w-12 mb-4 ${
              isDragging ? 'text-blue-400' : 'text-slate-500'
            }`}
          />

          <p className="text-lg font-medium text-white mb-2">
            {isDragging ? 'Drop your RFP here' : 'Upload RFP Document'}
          </p>
          <p className="text-sm text-slate-400 mb-4">
            Drag and drop a PDF file, or click to browse
          </p>
          <p className="text-xs text-slate-500">Maximum file size: 50MB</p>
        </div>
      )}

      {status === 'uploading' && (
        <div className="border-slate-700 rounded-xl p-6 bg-slate-800/30">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-950/50 flex items-center justify-center">
              <ArrowPathIcon className="h-5 w-5 text-blue-400 animate-spin" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">Uploading...</p>
              <p className="text-sm text-slate-400">{progress}% complete</p>
            </div>
          </div>
          <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-950/200 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {status === 'success' && uploadedFile && (
        <div className="border-blue-700/50 rounded-xl p-6 bg-blue-900/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-blue-900/50 flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium mb-1">Upload Complete</p>
              <div className="flex items-center gap-2 text-sm text-slate-400 mb-3">
                <DocumentIcon className="h-4 w-4" />
                <span className="truncate">{uploadedFile.originalFilename}</span>
                <span className="text-slate-500">
                  ({formatFileSize(uploadedFile.size)})
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleAnalyze}
                  className="px-4 py-2 bg-gradient-to-r from-slate-950 via-blue-950 to-slate-950 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-colors"
                >
                  Analyze This RFP
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
                >
                  Upload Another
                </button>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-400"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="border-red-700/50 rounded-xl p-6 bg-red-900/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-red-900/50 flex items-center justify-center flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium mb-1">Upload Failed</p>
              <p className="text-sm text-red-300 mb-3">{error}</p>
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-slate-700 text-slate-300 text-sm rounded-lg hover:bg-slate-600 transition-colors"
              >
                Try Again
              </button>
            </div>
            <button
              onClick={handleReset}
              className="text-slate-500 hover:text-slate-400"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
