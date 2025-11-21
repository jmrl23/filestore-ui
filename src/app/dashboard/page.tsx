'use client';

import React, { useState } from 'react';
import { FileDataTable } from '@/components/files/file-data-table';
import { Filters } from '@/components/files/filters';
import { useFileManager } from '@/hooks/use-file-manager';
import { FileHeader } from '@/components/files/file-header';
import { FileDeleteDialog } from '@/components/files/file-delete-dialog';
import { LoadingModal } from '@/components/ui/loading-modal';

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
    deleteFiles,
    triggerRevalidation,
    deleteLoadingState,
  } = useFileManager();

  const handleBulkDelete = async () => {
    setShowBulkDelete(false); // Close confirmation dialog immediately
    setTimeout(() => deleteFiles(), 150); // uses selectedFiles
  };

  const handleSingleDelete = async (id: string) => {
    await deleteFiles(id);
  };

  return (
    <div className='min-h-screen p-4 sm:p-6 lg:p-8 relative overflow-hidden'>
      <div className='absolute inset-0 h-full w-full bg-white dark:bg-neutral-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] dark:bg-[radial-gradient(#171717_1px,transparent_1px)] pointer-events-none'></div>
      <div className='max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 relative z-10'>
        <FileHeader
          selectedCount={selectedFiles.size}
          onDeleteSelected={() => setShowBulkDelete(true)}
          onUploadSuccess={triggerRevalidation}
        />

        <div className='space-y-4'>
          <Filters
            filterName={filterName}
            setFilterName={setFilterName}
            filterPath={filterPath}
            setFilterPath={setFilterPath}
            filterProvider={filterProvider}
            setFilterProvider={setFilterProvider}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            filterMimeType={filterMimeType}
            setFilterMimeType={setFilterMimeType}
            dateRange={dateRange}
            setDateRange={setDateRange}
            filterSizeMin={filterSizeMin}
            setFilterSizeMin={setFilterSizeMin}
            filterSizeMax={filterSizeMax}
            setFilterSizeMax={setFilterSizeMax}
            onRefresh={triggerRevalidation}
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

      <LoadingModal
        open={deleteLoadingState.open}
        status={deleteLoadingState.status}
        type='delete'
        title={
          deleteLoadingState.status === 'loading'
            ? `Deleting ${deleteLoadingState.count} file${deleteLoadingState.count > 1 ? 's' : ''}...`
            : deleteLoadingState.status === 'success'
              ? 'Deleted Successfully!'
              : 'Delete Failed'
        }
        description={
          deleteLoadingState.status === 'loading'
            ? 'Please wait while we delete the selected files'
            : deleteLoadingState.status === 'success'
              ? `${deleteLoadingState.count} file${deleteLoadingState.count > 1 ? 's have' : ' has'} been deleted`
              : 'There was an error deleting the files'
        }
      />
    </div>
  );
}
