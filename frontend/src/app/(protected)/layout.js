'use client';
import { useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useAuth } from '../../context/AuthProvider';
import Spinner from '@/app/_components/Spinner';

export default function ProtectedLayout ({ children }) {
  const { loading, user } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      redirect('/login');
    }
  }, [user, loading]);

  if (!user) {
    <div className='h-screen w-screen flex justify-center items-center'>
      <h1>ProtectedRoute</h1>
      <Spinner />
    </div>
  } else {
    return children;
  }
}
