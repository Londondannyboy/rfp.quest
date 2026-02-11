'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpenIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserIcon,
  ShieldCheckIcon,
  BeakerIcon,
  DocumentDuplicateIcon,
  SparklesIcon,
  TrashIcon,
  PencilIcon,
  TagIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

interface ContentItem {
  id: string;
  type: string;
  title: string;
  content: string;
  tags: string[];
  usageCount: number;
  lastUsedAt: string | null;
  createdAt: string;
}

const CONTENT_TYPES = [
  { id: 'boilerplate', label: 'Boilerplate', icon: DocumentTextIcon, color: 'teal' },
  { id: 'case_study', label: 'Case Studies', icon: BookOpenIcon, color: 'cyan' },
  { id: 'cv', label: 'CVs / Bios', icon: UserIcon, color: 'purple' },
  { id: 'certification', label: 'Certifications', icon: ShieldCheckIcon, color: 'green' },
  { id: 'methodology', label: 'Methodologies', icon: BeakerIcon, color: 'amber' },
  { id: 'policy', label: 'Policies', icon: DocumentDuplicateIcon, color: 'blue' },
  { id: 'capability_statement', label: 'Capabilities', icon: SparklesIcon, color: 'pink' },
  { id: 'social_value', label: 'Social Value', icon: UserIcon, color: 'emerald' },
  { id: 'sustainability', label: 'Sustainability', icon: BeakerIcon, color: 'lime' },
];

export default function LibraryPage() {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);

  useEffect(() => {
    fetchItems();
  }, [selectedType]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedType) params.set('type', selectedType);
      if (searchQuery) params.set('search', searchQuery);

      const response = await fetch(`/api/content-library?${params}`);
      if (response.ok) {
        const data = await response.json();
        setItems(data.items);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`/api/content-library/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const getTypeInfo = (type: string) => {
    return CONTENT_TYPES.find((t) => t.id === type) || CONTENT_TYPES[0];
  };

  const filteredItems = items.filter((item) => {
    if (searchQuery && !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !item.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const itemsByType = CONTENT_TYPES.reduce((acc, type) => {
    acc[type.id] = items.filter((item) => item.type === type.id).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="text-slate-400 hover:text-white transition-colors"
              >
                Dashboard
              </Link>
              <span className="text-slate-600">/</span>
              <h1 className="text-xl font-semibold text-white flex items-center gap-2">
                <BookOpenIcon className="w-6 h-6 text-teal-400" />
                Content Library
              </h1>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              <PlusIcon className="w-5 h-5" />
              Add Content
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Content Types */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 sticky top-24">
              <h2 className="text-sm font-medium text-slate-400 mb-3">Content Types</h2>
              <nav className="space-y-1">
                <button
                  onClick={() => setSelectedType(null)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    selectedType === null
                      ? 'bg-teal-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>All Items</span>
                  <span className="text-sm">{items.length}</span>
                </button>

                {CONTENT_TYPES.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                        selectedType === type.id
                          ? 'bg-teal-600 text-white'
                          : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {type.label}
                      </span>
                      <span className="text-sm">{itemsByType[type.id] || 0}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Search Bar */}
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
              >
                Search
              </button>
            </div>

            {/* Content Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <ArrowPathIcon className="w-8 h-8 text-teal-400 animate-spin" />
              </div>
            ) : filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                  const typeInfo = getTypeInfo(item.type);
                  const Icon = typeInfo.icon;

                  return (
                    <div
                      key={item.id}
                      className="bg-slate-900 rounded-xl border border-slate-800 p-4 hover:border-slate-700 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className={`p-2 rounded-lg bg-${typeInfo.color}-900/30`}>
                            <Icon className={`w-4 h-4 text-${typeInfo.color}-400`} />
                          </div>
                          <span className="text-xs text-slate-400">{typeInfo.label}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1.5 text-slate-400 hover:text-white transition-colors"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 transition-colors"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-white font-medium mb-2">{item.title}</h3>
                      <p className="text-slate-400 text-sm line-clamp-3 mb-3">
                        {item.content}
                      </p>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {item.tags.slice(0, 3).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-800 text-slate-300 text-xs rounded"
                            >
                              <TagIcon className="w-3 h-3" />
                              {tag}
                            </span>
                          ))}
                          {item.tags.length > 3 && (
                            <span className="text-xs text-slate-500">
                              +{item.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Used {item.usageCount} times</span>
                        <span>
                          {new Date(item.createdAt).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center">
                <BookOpenIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No Content Yet</h3>
                <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
                  Add boilerplate text, case studies, CVs, and other reusable content
                  to speed up your bid writing.
                </p>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Add Your First Item
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingItem) && (
        <ContentModal
          item={editingItem}
          onClose={() => {
            setShowAddModal(false);
            setEditingItem(null);
          }}
          onSave={() => {
            setShowAddModal(false);
            setEditingItem(null);
            fetchItems();
          }}
        />
      )}
    </div>
  );
}

interface ContentModalProps {
  item: ContentItem | null;
  onClose: () => void;
  onSave: () => void;
}

function ContentModal({ item, onClose, onSave }: ContentModalProps) {
  const [type, setType] = useState(item?.type || 'boilerplate');
  const [title, setTitle] = useState(item?.title || '');
  const [content, setContent] = useState(item?.content || '');
  const [tags, setTags] = useState(item?.tags.join(', ') || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const tagsArray = tags.split(',').map((t) => t.trim()).filter(Boolean);

      const response = await fetch(
        item ? `/api/content-library/${item.id}` : '/api/content-library',
        {
          method: item ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type,
            title: title.trim(),
            content: content.trim(),
            tags: tagsArray,
          }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save');
      }

      onSave();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-700 w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <h2 className="text-lg font-semibold text-white">
            {item ? 'Edit Content' : 'Add Content'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              disabled={!!item}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {CONTENT_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Company Overview, ISO 27001 Certification"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter the content that can be reused in bid responses..."
              rows={10}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <p className="mt-1 text-xs text-slate-500">
              {content.split(/\s+/).filter(Boolean).length} words
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., security, compliance, ISO"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-700">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50 transition-colors"
          >
            {isSaving ? 'Saving...' : item ? 'Update' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
