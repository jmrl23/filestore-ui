import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiKeyForm } from '@/components/auth/api-key-form';

export default async function LandingPage() {
  const cookieStore = await cookies();
  const apiKey = cookieStore.get('filestore_api_key');

  if (apiKey) {
    redirect('/dashboard');
  }

  return (
    <div className='min-h-screen flex items-center justify-center bg-background p-4'>
      <div className='w-full max-w-md space-y-8'>
        <div className='text-center space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>Welcome to Filestore</h1>
          <p className='text-muted-foreground'>
            Enter your API key to access the file management dashboard.
          </p>
        </div>
        
        <ApiKeyForm />
      </div>
    </div>
  );
}
