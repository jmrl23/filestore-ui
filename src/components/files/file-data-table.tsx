'use client';

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { FileData } from './types';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  MoreHorizontal,
  ExternalLink,
  Download,
  Trash,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File as FileIcon,
} from 'lucide-react';

interface FileDataTableProps {
  files: FileData[];
  loading: boolean;
  selectedFiles: Set<string>;
  onToggleSelectAll: () => void;
  onToggleSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FileDataTable({
  files,
  loading,
  selectedFiles,
  onToggleSelectAll,
  onToggleSelect,
  onDelete,
}: FileDataTableProps) {
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return <FileImage className='h-4 w-4' />;
    if (mimetype.startsWith('video/')) return <FileVideo className='h-4 w-4' />;
    if (mimetype.startsWith('audio/')) return <FileAudio className='h-4 w-4' />;
    if (mimetype.startsWith('text/') || mimetype.includes('pdf'))
      return <FileText className='h-4 w-4' />;
    return <FileIcon className='h-4 w-4' />;
  };

  const allSelected = files.length > 0 && selectedFiles.size === files.length;

  if (loading) {
    return (
      <div className='rounded-md border bg-card'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Checkbox disabled />
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className='h-4 w-4' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[200px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-20' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[100px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[120px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[100px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-8 w-[60px]' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className='rounded-md border bg-card'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[50px]'>
              <Checkbox
                checked={allSelected}
                onCheckedChange={onToggleSelectAll}
              />
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className='h-24 text-center'>
                No files found.
              </TableCell>
            </TableRow>
          ) : (
            files.map((file) => (
              <TableRow
                key={file.id}
                data-state={selectedFiles.has(file.id) && 'selected'}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedFiles.has(file.id)}
                    onCheckedChange={() => onToggleSelect(file.id)}
                  />
                </TableCell>
                <TableCell className='font-medium'>
                  <div className='flex items-center gap-2 max-w-[300px]'>
                    <div className='flex items-center justify-center w-8 h-8 rounded bg-muted shrink-0'>
                      {getFileIcon(file.mimetype)}
                    </div>
                    <a
                      href={file.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='truncate hover:underline'
                      title={file.name}
                    >
                      {file.name}
                    </a>
                  </div>
                </TableCell>
                <TableCell>{formatBytes(file.size)}</TableCell>
                <TableCell>{file.mimetype}</TableCell>
                <TableCell>
                  <Badge variant='secondary'>{file.provider}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(file.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant='ghost' className='h-8 w-8 p-0'>
                        <span className='sr-only'>Open menu</span>
                        <MoreHorizontal className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end'>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => window.open(file.url, '_blank')}
                      >
                        <ExternalLink className='mr-2 h-4 w-4' />
                        Open
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <a href={file.url} download>
                          <Download className='mr-2 h-4 w-4' />
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setFileToDelete(file.id)}
                        className='text-red-600 focus:text-red-600 focus:bg-red-50'
                      >
                        <Trash className='mr-2 h-4 w-4' />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Dialog
        open={!!fileToDelete}
        onOpenChange={(open) => !open && setFileToDelete(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              file.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant='outline' onClick={() => setFileToDelete(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (fileToDelete) {
                  onDelete(fileToDelete);
                  setFileToDelete(null);
                }
              }}
              className='bg-red-600 hover:bg-red-700'
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
