'use client';

import * as React from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthProvider';
import Spinner from './components/Spinner';

export default function App () {
  const { user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  React.useEffect(() => {
    console.log('Routing - user', user, pathname)
    if (pathname === '/') {
      if (!user) {
        router.push('/login')
      } else {
        router.push('/home')
      }
    }
  }, [user, router, pathname])

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <h1>Loading root path</h1>
      <Spinner />
    </div>
  );
}
