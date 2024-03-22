'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser, confirmResetPassword, signOut, signIn } from 'aws-amplify/auth';
import { redirect } from 'next/navigation';
import Spinner from '@/app/_components/Spinner';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);


  const checkUser = async () => {
    try {
      setLoading(true);
      const userData = await getCurrentUser();
      setUser(userData);
    } catch (error) {
      setUser(null);
    }
    setLoading(false)
  };

  const logOut = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Error signing out: ', error);
    }
  };

  /**
   * Confirmation for reset password or invitation flows
   * 
   * @param {*} email 
   * @param {*} password 
   * @param {*} code 
   */
  const confirmResetCode = async (email, password, code) => {
    if (user) {
      await logOut();
    }
    await confirmResetPassword({ username: email, confirmationCode: code, newPassword: password });
    await signIn({ username: email, password });
    await checkUser()
    redirect('/');
  };

  return (
    <AuthContext.Provider value={{ loading, user, checkUser, confirmResetCode, logOut }}>
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);