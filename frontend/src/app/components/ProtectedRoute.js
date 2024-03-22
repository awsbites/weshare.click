import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthProvider';
import Spinner from './Spinner';

const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, router, loading]);

  if (!user) {
    <div className='h-screen w-screen flex justify-center items-center'>
      <h1>ProtectedRoute</h1>
      <Spinner />
    </div>
  } else {
    return children;
  }
}

export default ProtectedRoute