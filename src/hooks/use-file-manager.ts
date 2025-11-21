import { useState, useRef, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DateRange } from 'react-day-picker';
import {
  FetchFilesResponse,
  FileFilterParams,
  Provider,
} from '@/components/files/types';
import { useDebounce } from '@/hooks/use-debounce';
import { api } from '@/lib/api';

/**
 * Custom hook for managing file operations including fetching, filtering, and deletion
 * @returns File manager state and operations
 */
export function useFileManager() {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const shouldRevalidateRef = useRef(false);

  const [filterName, setFilterName] = useState('');
  const debouncedFilterName = useDebounce(filterName, 500);
  const [filterPath, setFilterPath] = useState('');
  const debouncedPath = useDebounce(filterPath, 500);
  const [filterProvider, setFilterProvider] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filterMimeType, setFilterMimeType] = useState('');
  const debouncedMimeType = useDebounce(filterMimeType, 500);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [filterSizeMin, setFilterSizeMin] = useState('');
  const debouncedSizeMin = useDebounce(filterSizeMin, 500);
  const [filterSizeMax, setFilterSizeMax] = useState('');
  const debouncedSizeMax = useDebounce(filterSizeMax, 500);
  const [deleteLoadingState, setDeleteLoadingState] = useState<{
    open: boolean;
    status: 'loading' | 'success' | 'error';
    count: number;
  }>({ open: false, status: 'loading', count: 0 });

  const {
    data: files = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [
      'files',
      debouncedFilterName,
      filterProvider,
      sortOrder,
      debouncedMimeType,
      debouncedPath,
      dateRange,
      debouncedSizeMin,
      debouncedSizeMax,
    ],
    queryFn: async () => {
      const params: FileFilterParams = { order: sortOrder };

      if (debouncedFilterName) params.name = debouncedFilterName;
      if (filterProvider && filterProvider !== 'all')
        params.provider = filterProvider as Provider;
      if (debouncedMimeType) params.mimetype = debouncedMimeType.toLowerCase();
      if (debouncedPath) params.location = debouncedPath;

      // Use new flat date range parameters
      if (dateRange?.from) {
        params.createdAtFrom = dateRange.from.toISOString();
      }
      if (dateRange?.to) {
        // Set time to end of day (23:59:59.999) to include all files from that day
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        params.createdAtTo = endOfDay.toISOString();
      }

      // Use new flat size range parameters
      if (debouncedSizeMin) {
        params.sizeFrom = Number(debouncedSizeMin);
      }
      if (debouncedSizeMax) {
        params.sizeTo = Number(debouncedSizeMax);
      }

      if (shouldRevalidateRef.current) {
        params.revalidate = true;
        shouldRevalidateRef.current = false;
      }

      const { data } = await api.get<FetchFilesResponse>('/files', { params });
      return data.data.files || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      setDeleteLoadingState({ open: true, status: 'loading', count: ids.length });
      const params = new URLSearchParams();
      ids.forEach((fileId) => params.append('id', fileId));
      await api.delete(`/files?${params.toString()}`);
    },
    onSuccess: (_, ids) => {
      setDeleteLoadingState({ open: true, status: 'success', count: ids.length });
      
      // Show success state for 1.5 seconds before closing
      setTimeout(() => {
        setDeleteLoadingState({ open: false, status: 'loading', count: 0 });
        shouldRevalidateRef.current = true;
        queryClient.invalidateQueries({ queryKey: ['files'] });
        setSelectedFiles(new Set());
      }, 1500);
    },
    onError: (err, ids) => {
      setDeleteLoadingState({ open: true, status: 'error', count: ids.length });
      
      // Show error state for 2 seconds before closing
      setTimeout(() => {
        setDeleteLoadingState({ open: false, status: 'loading', count: 0 });
        // Keep console error for debugging
        console.error('Delete error:', err);
      }, 2000);
    },
  });

  const handleDelete = useCallback(
    (id?: string) => {
      return deleteMutation.mutateAsync(id ? [id] : Array.from(selectedFiles));
    },
    [deleteMutation, selectedFiles],
  );

  const triggerRevalidation = useCallback(() => {
    shouldRevalidateRef.current = true;
    queryClient.invalidateQueries({ queryKey: ['files'] });
  }, [queryClient]);

  const toggleSelectAll = useCallback(() => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((f) => f.id)));
    }
  }, [selectedFiles.size, files]);

  const toggleSelect = useCallback((id: string) => {
    setSelectedFiles((prev) => {
      const newSelected = new Set(prev);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return newSelected;
    });
  }, []);

  return {
    files,
    isLoading,
    isError,
    error,
    selectedFiles,
    filterName,
    setFilterName,
    filterPath,
    setFilterPath,
    filterProvider,
    setFilterProvider,
    sortOrder,
    setSortOrder,
    filterMimeType,
    setFilterMimeType,
    dateRange,
    setDateRange,
    filterSizeMin,
    setFilterSizeMin,
    filterSizeMax,
    setFilterSizeMax,
    toggleSelectAll,
    toggleSelect,
    deleteFiles: handleDelete,
    triggerRevalidation,
    refresh: refetch,
    deleteLoadingState,
  };
}
