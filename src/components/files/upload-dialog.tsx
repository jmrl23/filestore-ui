'use client';

import React, { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVIDERS, ProviderValue } from '@/lib/constants';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { UploadCloud } from 'lucide-react';
import { LoadingModal } from '@/components/ui/loading-modal';

interface UploadDialogProps {
  onUploadSuccess?: () => void;
}

export function UploadDialog({ onUploadSuccess }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const [loadingState, setLoadingState] = useState<{
    open: boolean;
    status: 'loading' | 'success' | 'error';
  }>({ open: false, status: 'loading' });
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      setLoadingState({ open: true, status: 'loading' });
      setOpen(false); // Close upload dialog immediately to prevent overlap
      await api.post('/files', formData);
    },
    onSuccess: () => {
      setLoadingState({ open: true, status: 'success' });
      
      // Show success state for 1.5 seconds before closing
      setTimeout(() => {
        setLoadingState({ open: false, status: 'loading' });
        if (onUploadSuccess) {
          onUploadSuccess();
        } else {
          queryClient.invalidateQueries({ queryKey: ['files'] });
        }
      }, 1500);
    },
    onError: (err) => {
      setLoadingState({ open: true, status: 'error' });
      
      // Show error state for 2 seconds before closing
      setTimeout(() => {
        setLoadingState({ open: false, status: 'loading' });
        // Keep a minimal toast for debugging purposes
        console.error('Upload error:', err);
      }, 2000);
    },
  });

  const form = useForm({
    defaultValues: {
      provider: PROVIDERS[0].value as ProviderValue,
      path: '/',
      files: undefined as FileList | undefined,
    },
    validators: {
      onChange: ({ value }) => {
        const schema = z.object({
          provider: z.enum(
            PROVIDERS.map((p) => p.value) as [string, ...string[]],
          ),
          path: z.string(),
          files: z
            .any()
            .refine((val) => val && val.length > 0, 'File is required'),
        });
        const result = schema.safeParse(value);
        if (!result.success) {
          const errors = z.treeifyError(result.error);
          return {
            provider: errors.properties?.provider?.errors?.[0],
            path: errors.properties?.path?.errors?.[0],
            files: errors.properties?.files?.errors?.[0],
          };
        }
        return undefined;
      },
    },
    onSubmit: async ({ value }) => {
      const schema = z.object({
        provider: z.enum(
          PROVIDERS.map((p) => p.value) as [string, ...string[]],
        ),
        path: z.string(),
        files: z
          .any()
          .refine((val) => val && val.length > 0, 'File is required'),
      });

      const result = schema.safeParse(value);
      if (!result.success) {
        const errors = z.treeifyError(result.error);
        if (errors.properties?.files?.errors?.[0]) 
          toast.error(errors.properties.files.errors[0]);
        else if (errors.properties?.path?.errors?.[0])
          toast.error(errors.properties.path.errors[0]);
        return;
      }

      if (!value.files) return;

      const formData = new FormData();
      for (let i = 0; i < value.files.length; i++) {
        formData.append('files', value.files[i]);
      }
      formData.append('provider', value.provider);
      formData.append('path', value.path || '/');

      await uploadMutation.mutateAsync(formData);
    },
  });

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button>
            <UploadCloud className='mr-2 h-4 w-4' />
            Upload Files
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>Upload Files</DialogTitle>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className='space-y-4'
          >
            <form.Field name='provider'>
              {(field) => (
                <div className='grid w-full gap-1.5'>
                  <label className='text-sm font-medium'>Provider</label>
                  <Select
                    value={field.state.value}
                    onValueChange={(val: string) =>
                      field.handleChange(val as ProviderValue)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder='Select provider' />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVIDERS.map((provider) => (
                        <SelectItem key={provider.value} value={provider.value}>
                          {provider.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </form.Field>

            <form.Field name='path'>
              {(field) => (
                <div className='grid w-full gap-1.5'>
                  <label className='text-sm font-medium'>Path</label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder='/path/to/folder'
                  />
                  {field.state.meta.errors ? (
                    <span className='text-xs text-red-500'>
                      {field.state.meta.errors.join(', ')}
                    </span>
                  ) : null}
                </div>
              )}
            </form.Field>

            <form.Field name='files'>
              {(field) => (
                <div className='grid w-full gap-1.5'>
                  <label className='text-sm font-medium'>Files</label>
                  <Input
                    type='file'
                    multiple
                    onChange={(e) =>
                      field.handleChange(e.target.files || undefined)
                    }
                  />
                  {field.state.meta.errors ? (
                    <span className='text-xs text-red-500'>
                      {field.state.meta.errors.join(', ')}
                    </span>
                  ) : null}
                </div>
              )}
            </form.Field>

            <div className='flex justify-end pt-4'>
              <Button type='submit' disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? 'Uploading...' : 'Upload'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <LoadingModal
        open={loadingState.open}
        status={loadingState.status}
        type='upload'
        title={
          loadingState.status === 'loading'
            ? 'Uploading Files...'
            : loadingState.status === 'success'
              ? 'Upload Successful!'
              : 'Upload Failed'
        }
        description={
          loadingState.status === 'loading'
            ? 'Please wait while we upload your files'
            : loadingState.status === 'success'
              ? 'Your files have been uploaded successfully'
              : 'There was an error uploading your files'
        }
      />
    </>
  );
}
