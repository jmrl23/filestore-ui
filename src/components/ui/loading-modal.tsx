'use client';

import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Loader2, Upload, Trash2, CheckCircle2, XCircle } from 'lucide-react';

interface LoadingModalProps {
  open: boolean;
  title: string;
  description?: string;
  type?: 'upload' | 'delete' | 'loading';
  status?: 'loading' | 'success' | 'error';
}

export function LoadingModal({
  open,
  title,
  description,
  type = 'loading',
  status = 'loading',
}: LoadingModalProps) {
  const getIcon = () => {
    if (status === 'success') {
      return (
        <CheckCircle2 className='h-16 w-16 text-green-500 animate-in zoom-in-50 duration-300' />
      );
    }
    
    if (status === 'error') {
      return (
        <XCircle className='h-16 w-16 text-red-500 animate-in zoom-in-50 duration-300' />
      );
    }

    // Loading state
    if (type === 'upload') {
      return (
        <div className='relative'>
          <Upload className='h-16 w-16 text-primary animate-pulse' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='h-20 w-20 text-primary/30 animate-spin' />
          </div>
        </div>
      );
    }

    if (type === 'delete') {
      return (
        <div className='relative'>
          <Trash2 className='h-16 w-16 text-destructive animate-pulse' />
          <div className='absolute inset-0 flex items-center justify-center'>
            <Loader2 className='h-20 w-20 text-destructive/30 animate-spin' />
          </div>
        </div>
      );
    }

    return <Loader2 className='h-16 w-16 text-primary animate-spin' />;
  };

  const getBackgroundAnimation = () => {
    if (status === 'loading') {
      return (
        <div className='absolute inset-0 -z-10 overflow-hidden'>
          <div className='absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 to-transparent rounded-full animate-pulse' />
          <div className='absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-primary/5 to-transparent rounded-full animate-pulse delay-75' />
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent 
        className='sm:max-w-md'
        showCloseButton={status !== 'loading'}
      >
        <div className='relative'>
          {getBackgroundAnimation()}
          <DialogHeader className='space-y-4'>
            <div className='flex justify-center py-4'>
              {getIcon()}
            </div>
            <DialogTitle className='text-center text-xl'>
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className='text-center'>
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
          
          {status === 'loading' && (
            <div className='mt-6 space-y-2'>
              <div className='h-2 w-full bg-muted rounded-full overflow-hidden'>
                <div className='h-full bg-primary rounded-full animate-progress-indeterminate' />
              </div>
              <p className='text-xs text-center text-muted-foreground'>
                Please wait...
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
