import { useQuery } from '@tanstack/react-query';
import { modelsAPI, Model, AllModelsResponse } from '@/api/api-methods';

// Query keys for cache management
export const modelKeys = {
  all: ['models'] as const,
  lists: () => [...modelKeys.all, 'list'] as const,
  list: (params?: { category?: string; pricing?: string; limit?: number }) => 
    [...modelKeys.lists(), params] as const,
  details: () => [...modelKeys.all, 'detail'] as const,
  detail: (id: string) => [...modelKeys.details(), id] as const,
};

// Hook to fetch all models with caching
export const useAllModels = (params?: {
  category?: string;
  pricing?: string;
  limit?: number;
  includePending?: string;
  randomize?: boolean;
}) => {
  return useQuery<AllModelsResponse, Error>({
    queryKey: modelKeys.list(params),
    queryFn: () => modelsAPI.getAllModels(params),
    staleTime: params?.randomize ? 0 : 5 * 60 * 1000, // Don't cache randomized results, cache others for 5 min
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes (previously cacheTime)
    refetchOnWindowFocus: params?.randomize ? true : false, // Refetch randomized on focus for fresh results
    refetchOnMount: params?.randomize ? true : false, // Refetch randomized on mount for fresh results
  });
};

// Hook to fetch a single model by ID with caching
export const useModelById = (id: string | undefined) => {
  return useQuery<{ success: boolean; data: { model: Model } }, Error>({
    queryKey: modelKeys.detail(id || ''),
    queryFn: () => modelsAPI.getModelById(id!),
    enabled: !!id, // Only run query if id exists
    staleTime: 10 * 60 * 1000, // Consider data fresh for 10 minutes
    gcTime: 60 * 60 * 1000, // Keep in cache for 1 hour
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

// Hook to fetch similar models (models from the same category)
export const useSimilarModels = (category: string | undefined, excludeId?: string) => {
  return useQuery<AllModelsResponse, Error>({
    queryKey: [...modelKeys.list({ category, limit: 4 }), 'similar', excludeId],
    queryFn: () => modelsAPI.getAllModels({ category, limit: 4 }),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    select: (data) => ({
      ...data,
      data: {
        ...data.data,
        models: data.data.models.filter(m => m._id !== excludeId).slice(0, 3)
      }
    })
  });
};
