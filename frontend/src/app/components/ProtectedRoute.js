import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthProvider';

const ProtectedRoute = ({ children }) => {
  const { loading, user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, router, loading]);

  if (!user) {
    return <h1>Loading...</h1>
  } else {
    return children;
  }
}

export default ProtectedRoute