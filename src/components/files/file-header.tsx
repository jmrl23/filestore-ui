'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { UploadDialog } from '@/components/files/upload-dialog';
import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Trash2, LogOut } from 'lucide-react';
import { toast } from 'sonner';

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
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      toast.error('Failed to logout');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
      <h1 className='text-2xl sm:text-3xl font-bold text-foreground'>
        Filestore UI
      </h1>
      <div className='flex items-center gap-2 sm:gap-4 flex-wrap w-full sm:w-auto'>
        <ModeToggle />
        <Button
          variant='outline'
          onClick={handleLogout}
          disabled={isLoggingOut}
          title='Logout'
          className='bg-white dark:bg-neutral-950 shadow-sm'
        >
          <LogOut className='h-4 w-4 sm:mr-2' />
          <span className='hidden sm:inline'>Logout</span>
        </Button>
        <UploadDialog onUploadSuccess={onUploadSuccess} />
        {selectedCount > 0 && (
          <Button
            variant='destructive'
            onClick={onDeleteSelected}
            className='text-sm'
          >
            <Trash2 className='mr-1 sm:mr-2 h-4 w-4' />
            <span className='hidden xs:inline'>Delete Selected </span>({selectedCount})
          </Button>
        )}
      </div>
    </header>
  );
}
