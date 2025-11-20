'use client';

import React, { useState } from 'react';
import { FileDataTable } from '@/components/files/file-data-table';
import { Filters } from '@/components/files/filters';
import { useFileManager } from '@/hooks/use-file-manager';
import { FileHeader } from '@/components/files/file-header';
import { FileDeleteDialog } from '@/components/files/file-delete-dialog';

export default function FileStore() {
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const {
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
    deleteFiles,
    triggerRevalidation,
    refresh,
  } = useFileManager();

  const handleBulkDelete = async () => {
    await deleteFiles(); // uses selectedFiles
    setShowBulkDelete(false);
  };

  const handleSingleDelete = async (id: string) => {
    await deleteFiles(id);
  };

  return (
    <div className='min-h-screen p-8 relative overflow-hidden'>
      <div className='absolute inset-0 h-full w-full bg-white dark:bg-neutral-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#171717_1px,transparent_1px)] pointer-events-none'></div>
      <div className='max-w-6xl mx-auto space-y-8 relative z-10'>
        <FileHeader
          selectedCount={selectedFiles.size}
          onDeleteSelected={() => setShowBulkDelete(true)}
          onUploadSuccess={triggerRevalidation}
        />

        <div className='space-y-4'>
          <Filters
            filterName={filterName}
            setFilterName={setFilterName}
            filterProvider={filterProvider}
            setFilterProvider={setFilterProvider}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterMimeType={filterMimeType}
            setFilterMimeType={setFilterMimeType}
            onRefresh={refresh}
            loading={isLoading}
          />

          {isError && (
            <div className='p-4 bg-red-100 text-red-700 rounded-md border border-red-200'>
              Error loading files:{' '}
              {error instanceof Error ? error.message : 'Unknown error'}
            </div>
          )}

          <FileDataTable
            files={files}
            loading={isLoading}
            selectedFiles={selectedFiles}
            onToggleSelectAll={toggleSelectAll}
            onToggleSelect={toggleSelect}
            onDelete={handleSingleDelete}
          />
        </div>
      </div>

      <FileDeleteDialog
        open={showBulkDelete}
        onOpenChange={setShowBulkDelete}
        onConfirm={handleBulkDelete}
        count={selectedFiles.size}
      />
    </div>
  );
}
