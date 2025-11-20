'use client';

import React from 'react';
import { UploadDialog } from '@/components/files/upload-dialog';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface FileHeaderProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onUploadSuccess: () => void;
}

export function FileHeader({
  selectedCount,
  onDeleteSelected,
  onUploadSuccess,
}: FileHeaderProps) {
  return (
    <header className='flex justify-between items-center'>
      <h1 className='text-3xl font-bold text-foreground'>FileStore</h1>
      <div className='flex items-center gap-4'>
        <ModeToggle />
        <UploadDialog onUploadSuccess={onUploadSuccess} />
        {selectedCount > 0 && (
          <Button variant='destructive' onClick={onDeleteSelected}>
            <Trash2 className='mr-2 h-4 w-4' />
            Delete Selected ({selectedCount})
          </Button>
        )}
      </div>
    </header>
  );
}
