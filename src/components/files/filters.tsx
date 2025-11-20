'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PROVIDERS } from '@/lib/constants';

interface FiltersProps {
  filterName: string;
  setFilterName: (val: string) => void;
  filterProvider: string;
  setFilterProvider: (val: string) => void;
  filterMimeType?: string;
  setFilterMimeType?: (val: string) => void;
  sortOrder?: string;
  setSortOrder?: (val: string) => void;
  onRefresh: () => void;
  loading: boolean;
}

export function Filters({
  filterName,
  setFilterName,
  filterProvider,
  setFilterProvider,
  filterMimeType,
  setFilterMimeType,
  sortOrder,
  setSortOrder,
  onRefresh,
  loading,
}: FiltersProps) {
  return (
    <div className='flex flex-col sm:flex-row gap-4 p-4 rounded-md border bg-card'>
      <div className='relative max-w-xs w-full'>
        <Search className='absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground' />
        <Input
          type='text'
          placeholder='Filter by name...'
          className='pl-9'
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
      </div>
      <Select value={filterProvider} onValueChange={setFilterProvider}>
        <SelectTrigger className='max-w-40'>
          <SelectValue placeholder='All Providers' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>All Providers</SelectItem>
          {PROVIDERS.map((provider) => (
            <SelectItem key={provider.value} value={provider.value}>
              {provider.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {setFilterMimeType && (
        <Input
          type='text'
          placeholder='Mimetype (e.g. image/jpeg)'
          className='max-w-52'
          value={filterMimeType}
          onChange={(e) => setFilterMimeType(e.target.value)}
        />
      )}

      {setSortOrder && (
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className='max-w-40'>
            <SelectValue placeholder='Sort' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='desc'>Newest First</SelectItem>
            <SelectItem value='asc'>Oldest First</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Button variant='outline' onClick={onRefresh} disabled={loading}>
        <RefreshCw
          className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
        />
        {loading ? 'Refreshing...' : 'Refresh'}
      </Button>
    </div>
  );
}
