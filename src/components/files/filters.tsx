'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RefreshCw, Search } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePickerWithRange } from '@/components/ui/date-range-picker';
import { PROVIDERS } from '@/lib/constants';

interface FiltersProps {
  filterName: string;
  setFilterName: (val: string) => void;
  filterProvider: string;
  setFilterProvider: (val: string) => void;
  filterPath?: string;
  setFilterPath?: (val: string) => void;
  filterMimeType?: string;
  setFilterMimeType?: (val: string) => void;
  dateRange?: DateRange;
  setDateRange?: (val: DateRange | undefined) => void;
  filterSizeMin?: string;
  setFilterSizeMin?: (val: string) => void;
  filterSizeMax?: string;
  setFilterSizeMax?: (val: string) => void;
  sortOrder?: 'asc' | 'desc';
  setSortOrder?: (val: 'asc' | 'desc') => void;
  onRefresh: () => void;
  loading: boolean;
}

export function Filters({
  filterName,
  setFilterName,
  filterProvider,
  setFilterProvider,
  filterPath,
  setFilterPath,
  filterMimeType,
  setFilterMimeType,
  dateRange,
  setDateRange,
  filterSizeMin,
  setFilterSizeMin,
  filterSizeMax,
  setFilterSizeMax,
  sortOrder,
  setSortOrder,
  onRefresh,
  loading,
}: FiltersProps) {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 p-3 sm:p-4 rounded-md border bg-card'>
      <div className='relative w-full sm:col-span-2 lg:col-span-1'>
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
        <SelectTrigger className='w-full'>
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

      {setFilterPath && (
        <Input
          type='text'
          placeholder='Path (e.g. /documents)'
          className='w-full'
          value={filterPath}
          onChange={(e) => setFilterPath(e.target.value)}
        />
      )}

      {setFilterMimeType && (
        <Input
          type='text'
          placeholder='Mimetype (e.g. image/jpeg)'
          className='w-full'
          value={filterMimeType}
          onChange={(e) => setFilterMimeType(e.target.value)}
        />
      )}

      {setDateRange && (
        <DatePickerWithRange 
          date={dateRange} 
          setDate={setDateRange} 
          className='sm:col-span-2 lg:col-span-1'
        />
      )}

      {setFilterSizeMin && (
        <Input
          type='number'
          placeholder='Min Size (bytes)'
          className='w-full'
          value={filterSizeMin}
          onChange={(e) => setFilterSizeMin(e.target.value)}
        />
      )}

      {setFilterSizeMax && (
        <Input
          type='number'
          placeholder='Max Size (bytes)'
          className='w-full'
          value={filterSizeMax}
          onChange={(e) => setFilterSizeMax(e.target.value)}
        />
      )}

      {setSortOrder && (
        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Sort' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='desc'>Newest First</SelectItem>
            <SelectItem value='asc'>Oldest First</SelectItem>
          </SelectContent>
        </Select>
      )}
      <Button 
        variant='outline' 
        onClick={onRefresh} 
        disabled={loading}
        className='w-full sm:w-auto'
      >
        <RefreshCw
          className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`}
        />
        {loading ? 'Refreshing...' : 'Refresh'}
      </Button>
    </div>
  );
}
