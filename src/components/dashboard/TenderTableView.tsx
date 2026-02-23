'use client';

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
  ColumnDef,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  ExpandedState,
} from '@tanstack/react-table';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  FunnelIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowDownTrayIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
  SparklesIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  MinusIcon,
} from '@heroicons/react/24/outline';
import type { Tender } from '@/lib/hooks/use-tenders';
import { EnrichmentButton } from '../enrichment/EnrichmentButton';
import { formatCurrency } from '@/lib/utils';

interface TenderTableViewProps {
  tenders: Tender[];
  teamId: string;
  onEdit?: (tender: Tender) => void;
  onAnalyze?: (tender: Tender) => void;
  onExport?: (tenders: Tender[]) => void;
}

export function TenderTableView({
  tenders,
  teamId,
  onEdit,
  onAnalyze,
  onExport,
}: TenderTableViewProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [editingCell, setEditingCell] = useState<{ row: string; column: string } | null>(null);
  const [editValue, setEditValue] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  // Inline editing handler
  const handleCellEdit = useCallback((rowId: string, columnId: string, value: any) => {
    // Update tender data
    const tender = tenders.find(t => t.id === rowId);
    if (tender && onEdit) {
      onEdit({ ...tender, [columnId]: value });
    }
    setEditingCell(null);
  }, [tenders, onEdit]);

  // Start editing
  const startEditing = (rowId: string, columnId: string, currentValue: any) => {
    setEditingCell({ row: rowId, column: columnId });
    setEditValue(String(currentValue || ''));
  };

  // Column definitions with inline editing
  const columns = useMemo<ColumnDef<Tender>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <input
            type="checkbox"
            checked={table.getIsAllPageRowsSelected()}
            onChange={(e) => {
              table.toggleAllPageRowsSelected(!!e.target.checked);
              if (e.target.checked) {
                table.getRowModel().rows.forEach(row => {
                  selectedRows.add(row.original.id);
                });
                setSelectedRows(new Set(selectedRows));
              } else {
                setSelectedRows(new Set());
              }
            }}
            className="rounded border-gray-300"
            style={{ opacity: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected() ? 0.5 : 1 }}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            checked={row.getIsSelected()}
            onChange={(e) => {
              row.toggleSelected(!!e.target.checked);
              if (e.target.checked) {
                selectedRows.add(row.original.id);
              } else {
                selectedRows.delete(row.original.id);
              }
              setSelectedRows(new Set(selectedRows));
            }}
            className="rounded border-gray-300"
          />
        ),
        size: 40,
      },
      {
        id: 'expander',
        header: () => null,
        cell: ({ row }) => (
          <button
            onClick={() => row.toggleExpanded()}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {row.getIsExpanded() ? (
              <MinusIcon className="w-4 h-4" />
            ) : (
              <PlusIcon className="w-4 h-4" />
            )}
          </button>
        ),
        size: 40,
      },
      {
        accessorKey: 'title',
        header: 'Title',
        cell: ({ row, getValue }) => {
          const value = getValue() as string;
          const isEditing = editingCell?.row === row.original.id && editingCell?.column === 'title';
          
          if (isEditing) {
            return (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCellEdit(row.original.id, 'title', editValue);
                    } else if (e.key === 'Escape') {
                      setEditingCell(null);
                    }
                  }}
                  className="flex-1 px-2 py-1 border border-blue-400 rounded outline-none text-sm"
                  autoFocus
                />
                <button
                  onClick={() => handleCellEdit(row.original.id, 'title', editValue)}
                  className="p-1 text-green-600 hover:bg-green-50 rounded"
                >
                  <CheckIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingCell(null)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>
            );
          }
          
          return (
            <div
              className="cursor-pointer hover:bg-gray-50 px-2 py-1 rounded group flex items-center justify-between"
              onClick={() => startEditing(row.original.id, 'title', value)}
            >
              <span className="truncate">{value}</span>
              <PencilIcon className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          );
        },
        size: 300,
      },
      {
        accessorKey: 'buyer_name',
        header: 'Buyer',
        cell: ({ row, getValue }) => {
          const value = getValue() as string;
          return (
            <div className="flex items-center gap-2">
              <span className="truncate">{value}</span>
              <EnrichmentButton
                referenceId={value}
                referenceType="company"
                teamId={teamId}
                variant="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              />
            </div>
          );
        },
        size: 200,
      },
      {
        accessorKey: 'value',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 font-medium"
          >
            Value
            {column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : null}
          </button>
        ),
        cell: ({ getValue }) => formatCurrency(getValue() as number),
        size: 120,
      },
      {
        accessorKey: 'deadline',
        header: ({ column }) => (
          <button
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="flex items-center gap-1 font-medium"
          >
            Deadline
            {column.getIsSorted() === 'asc' ? (
              <ChevronUpIcon className="w-4 h-4" />
            ) : column.getIsSorted() === 'desc' ? (
              <ChevronDownIcon className="w-4 h-4" />
            ) : null}
          </button>
        ),
        cell: ({ getValue }) => {
          const date = getValue() as string;
          const deadline = new Date(date);
          const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
          
          return (
            <div>
              <div className="text-sm">{deadline.toLocaleDateString('en-GB')}</div>
              <div className={`text-xs ${
                daysLeft < 7 ? 'text-red-600' : 
                daysLeft < 14 ? 'text-yellow-600' : 
                'text-gray-500'
              }`}>
                {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
              </div>
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'match_score',
        header: 'Match',
        cell: ({ getValue }) => {
          const score = getValue() as number | null;
          if (!score) return <span className="text-gray-400">-</span>;
          
          return (
            <div className="flex items-center gap-2">
              <div className="w-16 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    score >= 80 ? 'bg-green-500' :
                    score >= 60 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-sm font-medium">{score}%</span>
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: 'cpv_codes',
        header: 'Sectors',
        cell: ({ getValue }) => {
          const codes = getValue() as string[];
          return (
            <div className="flex flex-wrap gap-1">
              {codes?.slice(0, 2).map((code, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs"
                >
                  {code.substring(0, 2)}
                </span>
              ))}
              {codes?.length > 2 && (
                <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-600 text-xs">
                  +{codes.length - 2}
                </span>
              )}
            </div>
          );
        },
        size: 140,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row, getValue }) => {
          const value = getValue() as string;
          const isEditing = editingCell?.row === row.original.id && editingCell?.column === 'status';
          
          if (isEditing) {
            return (
              <select
                value={editValue}
                onChange={(e) => {
                  handleCellEdit(row.original.id, 'status', e.target.value);
                }}
                onBlur={() => setEditingCell(null)}
                className="px-2 py-1 border border-blue-400 rounded outline-none text-sm"
                autoFocus
              >
                <option value="new">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="writing">Writing</option>
                <option value="submitted">Submitted</option>
                <option value="won">Won</option>
                <option value="lost">Lost</option>
              </select>
            );
          }
          
          const statusColors = {
            new: 'bg-blue-100 text-blue-700',
            reviewing: 'bg-yellow-100 text-yellow-700',
            writing: 'bg-purple-100 text-purple-700',
            submitted: 'bg-gray-100 text-gray-700',
            won: 'bg-green-100 text-green-700',
            lost: 'bg-red-100 text-red-700',
          };
          
          return (
            <span
              onClick={() => startEditing(row.original.id, 'status', value)}
              className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer ${
                statusColors[value as keyof typeof statusColors] || 'bg-gray-100 text-gray-700'
              }`}
            >
              {value}
            </span>
          );
        },
        size: 100,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onAnalyze?.(row.original)}
              className="p-1 hover:bg-blue-50 rounded text-blue-600"
              title="Analyze"
            >
              <SparklesIcon className="w-4 h-4" />
            </button>
            <button
              className="p-1 hover:bg-gray-100 rounded text-gray-600"
              title="Duplicate"
            >
              <DocumentDuplicateIcon className="w-4 h-4" />
            </button>
          </div>
        ),
        size: 80,
      },
    ],
    [editingCell, editValue, selectedRows, teamId, onEdit, onAnalyze]
  );

  const table = useReactTable({
    data: tenders,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    initialState: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  // Export selected rows
  const handleExportSelected = () => {
    const selected = tenders.filter(t => selectedRows.has(t.id));
    if (selected.length > 0 && onExport) {
      onExport(selected);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      {/* Toolbar */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Quick filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter all columns..."
                onChange={(e) => {
                  table.setGlobalFilter(e.target.value);
                }}
                className="pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none"
              />
              <FunnelIcon className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            
            {/* Column visibility */}
            <div className="relative group">
              <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">
                <EyeIcon className="w-4 h-4 inline mr-1" />
                Columns
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 p-2 hidden group-hover:block z-10">
                {table.getAllLeafColumns().map((column) => {
                  if (column.id === 'select' || column.id === 'expander' || column.id === 'actions') return null;
                  return (
                    <label
                      key={column.id}
                      className="flex items-center gap-2 px-2 py-1 hover:bg-gray-50 rounded cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={column.getIsVisible()}
                        onChange={(e) => column.toggleVisibility(!!e.target.checked)}
                        className="rounded border-gray-300"
                      />
                      <span className="text-sm">{column.id}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            
            {selectedRows.size > 0 && (
              <span className="text-sm text-gray-600">
                {selectedRows.size} selected
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {selectedRows.size > 0 && (
              <button
                onClick={handleExportSelected}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
              >
                <ArrowDownTrayIcon className="w-4 h-4 inline mr-1" />
                Export {selectedRows.size}
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-gray-200">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-4 py-3 font-medium text-gray-700 text-sm"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <>
                <tr
                  key={row.id}
                  className={`border-b border-gray-100 hover:bg-gray-50 group ${
                    row.getIsSelected() ? 'bg-blue-50' : ''
                  }`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-4 py-2 text-sm"
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
                {row.getIsExpanded() && (
                  <tr key={`${row.id}-expanded`}>
                    <td colSpan={columns.length} className="p-4 bg-gray-50">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">
                          <strong>Description:</strong> {row.original.description}
                        </p>
                        {(row.original as any).analysis && (
                          <div className="grid grid-cols-3 gap-4 mt-3">
                            <div>
                              <strong className="text-sm">Requirements:</strong>
                              <ul className="mt-1 text-xs text-gray-600">
                                {(row.original as any).analysis.requirements?.slice(0, 3).map((req: any, i: number) => (
                                  <li key={i}>• {req.title}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <strong className="text-sm">Key Dates:</strong>
                              <ul className="mt-1 text-xs text-gray-600">
                                <li>Published: {new Date(row.original.publishedDate).toLocaleDateString()}</li>
                                <li>Deadline: {new Date(row.original.deadline).toLocaleDateString()}</li>
                              </ul>
                            </div>
                            <div>
                              <strong className="text-sm">Quick Actions:</strong>
                              <div className="mt-1 flex gap-2">
                                <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs">
                                  Write Bid
                                </button>
                                <button className="px-3 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border border-gray-200 rounded text-sm disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 border border-gray-200 rounded text-sm"
            >
              {[10, 25, 50, 100].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}