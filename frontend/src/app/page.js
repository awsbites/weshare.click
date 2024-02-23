'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthProvider';

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()
  React.useEffect(() => {
    if (!user) {
      console.log('No user, redirecting to /login')
      router.push('/login');
    } else {
      router.push('/home')
    }
  }, [user])

  return (
    <h1>Loading...</h1>
  );
}
