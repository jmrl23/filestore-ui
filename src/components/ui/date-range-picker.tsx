'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export function DatePickerWithRange({
  className,
  date,
  setDate,
}: React.HTMLAttributes<HTMLDivElement> & {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatDateRange = () => {
    if (!date?.from) return <span>Pick a date</span>;
    
    const fromDate = isMobile 
      ? format(date.from, 'MMM dd')  // Shorter format for mobile
      : format(date.from, 'LLL dd, y');
    
    if (!date.to) return fromDate;
    
    const toDate = isMobile
      ? format(date.to, 'MMM dd')
      : format(date.to, 'LLL dd, y');
    
    return <>{fromDate} - {toDate}</>;
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'w-full justify-start text-left font-normal text-sm',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4 shrink-0' />
            <span className='truncate'>{formatDateRange()}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className='w-auto p-0' 
          align={isMobile ? 'center' : 'start'}
        >
          <Calendar
            initialFocus
            mode='range'
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isMobile ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
