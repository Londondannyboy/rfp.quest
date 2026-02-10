'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { SavedView, SavedViewFilters } from '@/app/api/saved-views/route';

export type { SavedView, SavedViewFilters };

async function fetchSavedViews(): Promise<{ views: SavedView[] }> {
  const response = await fetch('/api/saved-views');
  if (!response.ok) {
    throw new Error('Failed to fetch saved views');
  }
  return response.json();
}

async function createSavedView(data: {
  name: string;
  filters: SavedViewFilters;
  icon?: string;
  color?: string;
  isPinned?: boolean;
  isDefault?: boolean;
}): Promise<{ view: SavedView }> {
  const response = await fetch('/api/saved-views', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create saved view');
  }

  return response.json();
}

async function updateSavedView(
  id: string,
  data: Partial<{
    name: string;
    filters: SavedViewFilters;
    icon: string;
    color: string;
    isPinned: boolean;
    isDefault: boolean;
  }>
): Promise<{ view: SavedView }> {
  const response = await fetch(`/api/saved-views/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update saved view');
  }

  return response.json();
}

async function deleteSavedView(id: string): Promise<void> {
  const response = await fetch(`/api/saved-views/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete saved view');
  }
}

/**
 * Hook for managing saved views.
 * Provides CRUD operations and query state.
 */
export function useSavedViews() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['saved-views'],
    queryFn: fetchSavedViews,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const createMutation = useMutation({
    mutationFn: createSavedView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-views'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof updateSavedView>[1] }) =>
      updateSavedView(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-views'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSavedView,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-views'] });
    },
  });

  return {
    // Query state
    views: query.data?.views ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    // Mutations
    createView: createMutation.mutate,
    updateView: (id: string, data: Parameters<typeof updateSavedView>[1]) =>
      updateMutation.mutate({ id, data }),
    deleteView: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,

    // Helpers
    getDefaultView: () => query.data?.views.find((v) => v.isDefault),
    getPinnedViews: () => query.data?.views.filter((v) => v.isPinned) ?? [],
  };
}
