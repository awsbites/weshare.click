'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthProvider';
import Spinner from './components/Spinner';

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/home')
    }
  }, [user, router])

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Spinner />
    </div>
  );
}
