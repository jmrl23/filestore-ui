import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchFilesResponse } from '@/components/files/types';
import { useDebounce } from '@/hooks/use-debounce';
import { api } from '@/lib/api';
import { toast } from 'sonner';

export function useFileManager() {
  const queryClient = useQueryClient();
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const shouldRevalidateRef = useRef(false);

  const [filterName, setFilterName] = useState('');
  const debouncedFilterName = useDebounce(filterName, 500);
  const [filterProvider, setFilterProvider] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterMimeType, setFilterMimeType] = useState('');
  const debouncedMimeType = useDebounce(filterMimeType, 500);

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
    ],
    queryFn: async () => {
      const params: Record<string, string> = { order: sortOrder };
      if (debouncedFilterName) params.name = debouncedFilterName;
      if (filterProvider && filterProvider !== 'all')
        params.provider = filterProvider;
      if (debouncedMimeType) params.mimetype = debouncedMimeType.toLowerCase();

      if (shouldRevalidateRef.current) {
        params.revalidate = 'true';
        shouldRevalidateRef.current = false;
      }

      const { data } = await api.get<FetchFilesResponse>('/files', { params });
      return data.data.files || [];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const params = new URLSearchParams();
      ids.forEach((fileId) => params.append('id', fileId));
      await api.delete(`/files?${params.toString()}`);
    },
    onSuccess: () => {
      shouldRevalidateRef.current = true;
      queryClient.invalidateQueries({ queryKey: ['files'] });
      toast.success('Files deleted successfully');
      setSelectedFiles(new Set());
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Delete failed');
    },
  });

  const handleDelete = (id?: string) => {
    // Logic handled in component or here?
    // The component needs to show dialog.
    // I'll return the mutation and let the component call it.
    return deleteMutation.mutateAsync(id ? [id] : Array.from(selectedFiles));
  };

  const triggerRevalidation = () => {
    shouldRevalidateRef.current = true;
    queryClient.invalidateQueries({ queryKey: ['files'] });
  };

  const toggleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      setSelectedFiles(new Set(files.map((f) => f.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedFiles);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedFiles(newSelected);
  };

  return {
    files,
    isLoading,
    isError,
    error,
    selectedFiles,
    filterName,
    setFilterName,
    filterProvider,
    setFilterProvider,
    sortOrder,
    setSortOrder,
    filterMimeType,
    setFilterMimeType,
    toggleSelectAll,
    toggleSelect,
    deleteFiles: handleDelete,
    triggerRevalidation,
    refresh: refetch,
  };
}
