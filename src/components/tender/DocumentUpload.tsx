'use client';

import { useState, useCallback, useEffect } from 'react';
import {
  DocumentArrowUpIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface UploadedDocument {
  id: string;
  fileName: string;
  fileType: string;
  fileSizeBytes: number | null;
  analysisStatus: 'pending' | 'processing' | 'completed' | 'failed';
  wordCount?: number;
  pages?: number;
  uploadedAt: string;
}

interface Props {
  ocid: string;
  onDocumentAnalyzed?: (documentId: string) => void;
}

export function DocumentUpload({ ocid, onDocumentAnalyzed }: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Load existing documents on mount
  useEffect(() => {
    loadExistingDocuments();
  }, [ocid]);

  const loadExistingDocuments = async () => {
    setIsLoadingExisting(true);
    try {
      const response = await fetch(`/api/tender-documents?ocid=${ocid}`);
      if (response.ok) {
        const data = await response.json();
        const docs: UploadedDocument[] = data.documents.map((doc: {
          id: string;
          fileName: string;
          fileType: string;
          fileSizeBytes: number | null;
          analysisStatus: string;
          uploadedAt: string;
        }) => ({
          id: doc.id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          fileSizeBytes: doc.fileSizeBytes,
          analysisStatus: doc.analysisStatus as UploadedDocument['analysisStatus'],
          uploadedAt: doc.uploadedAt,
        }));
        setDocuments(docs);

        // Notify parent of any completed documents
        const completedDoc = docs.find(d => d.analysisStatus === 'completed');
        if (completedDoc && onDocumentAnalyzed) {
          onDocumentAnalyzed(completedDoc.id);
        }
      }
    } catch (err) {
      console.error('Error loading existing documents:', err);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      uploadFile(files[0]);
    }
  }, [ocid]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      uploadFile(files[0]);
    }
  }, [ocid]);

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);

    try {
      // Validate file type
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('Only PDF and DOCX files are supported');
      }

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('ocid', ocid);

      // Upload the file
      const response = await fetch('/api/tender-documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      const newDoc: UploadedDocument = {
        id: data.document.id,
        fileName: data.document.fileName,
        fileType: data.document.fileType,
        fileSizeBytes: data.document.fileSizeBytes,
        analysisStatus: data.document.analysisStatus,
        wordCount: data.document.wordCount,
        pages: data.document.pages,
        uploadedAt: data.document.uploadedAt,
      };

      setDocuments((prev) => [...prev, newDoc]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
    }
  };

  const analyzeDocument = async (documentId: string) => {
    // Update status to processing
    setDocuments((prev) =>
      prev.map((d) => (d.id === documentId ? { ...d, analysisStatus: 'processing' as const } : d))
    );

    try {
      const response = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentId }),
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      // Update document status
      setDocuments((prev) =>
        prev.map((d) => (d.id === documentId ? { ...d, analysisStatus: 'completed' as const } : d))
      );

      // Notify parent component
      if (onDocumentAnalyzed) {
        onDocumentAnalyzed(documentId);
      }
    } catch {
      setDocuments((prev) =>
        prev.map((d) => (d.id === documentId ? { ...d, analysisStatus: 'failed' as const } : d))
      );
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusIcon = (status: UploadedDocument['analysisStatus']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
      case 'processing':
        return <ArrowPathIcon className="w-5 h-5 text-teal-400 animate-spin" />;
      case 'failed':
        return <XCircleIcon className="w-5 h-5 text-red-400" />;
      default:
        return <DocumentTextIcon className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <DocumentArrowUpIcon className="w-5 h-5 text-teal-400" />
        Tender Documents
      </h3>

      {/* Loading existing documents */}
      {isLoadingExisting ? (
        <div className="flex items-center justify-center py-8">
          <ArrowPathIcon className="w-6 h-6 text-teal-400 animate-spin mr-2" />
          <span className="text-slate-400">Loading documents...</span>
        </div>
      ) : (
        /* Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging
              ? 'border-teal-500 bg-teal-500/10'
              : 'border-slate-700 hover:border-slate-600'
            }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
          `}
        >
          <input
            type="file"
            accept=".pdf,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <ArrowPathIcon className="w-10 h-10 text-teal-400 animate-spin" />
              <p className="text-slate-300">Uploading and extracting text...</p>
            </div>
          ) : (
            <>
              <DocumentArrowUpIcon className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <p className="text-slate-300 mb-1">
                Drop your ITT/RFP document here
              </p>
              <p className="text-sm text-slate-500">
                or click to browse (PDF, DOCX)
              </p>
            </>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* Uploaded Documents */}
      {documents.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="text-sm font-medium text-slate-400">Uploaded Documents</h4>
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700"
            >
              {getStatusIcon(doc.analysisStatus)}

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{doc.fileName}</p>
                <p className="text-sm text-slate-400">
                  {formatFileSize(doc.fileSizeBytes)}
                  {doc.pages && ` • ${doc.pages} pages`}
                  {doc.wordCount && ` • ${doc.wordCount.toLocaleString()} words`}
                </p>
              </div>

              <div className="flex items-center gap-2">
                {doc.analysisStatus === 'pending' && (
                  <button
                    onClick={() => analyzeDocument(doc.id)}
                    className="px-3 py-1.5 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors"
                  >
                    Analyze
                  </button>
                )}
                {doc.analysisStatus === 'failed' && (
                  <button
                    onClick={() => analyzeDocument(doc.id)}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Retry
                  </button>
                )}
                {doc.analysisStatus === 'completed' && (
                  <span className="text-sm text-green-400">Analyzed</span>
                )}
                {doc.analysisStatus === 'processing' && (
                  <span className="text-sm text-teal-400">Analyzing...</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      <p className="mt-4 text-xs text-slate-500">
        Upload your ITT (Invitation to Tender), RFP, or tender specification document.
        We&apos;ll extract requirements, scoring criteria, and key dates automatically.
      </p>
    </div>
  );
}
