'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, KeyRound } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  apiKey: z.string().min(1, 'API Key is required'),
});

export function ApiKeyForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      apiKey: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error('Failed to validate API key');
      }

      toast.success('Authenticated successfully');
      router.push('/dashboard');
      router.refresh();
    } catch (error) {
      toast.error('Invalid API Key or server error');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className='w-full shadow-lg border-muted/40'>
      <CardHeader className='space-y-1'>
        <CardTitle className='text-2xl flex items-center gap-2'>
          <KeyRound className='w-5 h-5 text-primary' />
          Authentication
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='apiKey'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>API Key</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder='sk_...' 
                      type='password' 
                      autoComplete='off'
                      disabled={isLoading}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Authenticating...
                </>
              ) : (
                'Access Dashboard'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className='flex justify-center border-t bg-muted/50 p-4'>
        <p className='text-xs text-muted-foreground text-center'>
          Your API key is stored securely in an HTTP-only cookie.
        </p>
      </CardFooter>
    </Card>
  );
}
