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

interface UploadDialogProps {
  onUploadSuccess?: () => void;
}

export function UploadDialog({ onUploadSuccess }: UploadDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await api.post('/files', formData);
    },
    onSuccess: () => {
      if (onUploadSuccess) {
        onUploadSuccess();
      } else {
        queryClient.invalidateQueries({ queryKey: ['files'] });
        toast.success('File uploaded successfully');
      }
      setOpen(false);
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
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
          path: z.string().min(1, 'Path is required'),
          files: z
            .any()
            .refine((val) => val && val.length > 0, 'File is required'),
        });
        const result = schema.safeParse(value);
        if (!result.success) {
          const errors = result.error.flatten().fieldErrors;
          return {
            provider: errors.provider?.[0],
            path: errors.path?.[0],
            files: errors.files?.[0],
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
        path: z.string().min(1, 'Path is required'),
        files: z
          .any()
          .refine((val) => val && val.length > 0, 'File is required'),
      });

      const result = schema.safeParse(value);
      if (!result.success) {
        const errors = result.error.flatten();
        if (errors.fieldErrors.files) toast.error(errors.fieldErrors.files[0]);
        else if (errors.fieldErrors.path)
          toast.error(errors.fieldErrors.path[0]);
        return;
      }

      if (!value.files) return;

      const formData = new FormData();
      for (let i = 0; i < value.files.length; i++) {
        formData.append('files', value.files[i]);
      }
      formData.append('provider', value.provider);
      formData.append('path', value.path);

      await uploadMutation.mutateAsync(formData);
    },
  });

  return (
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
  );
}
