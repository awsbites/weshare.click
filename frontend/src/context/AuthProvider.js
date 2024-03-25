'use client';

import { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { getCurrentUser, confirmResetPassword, signOut, signIn } from 'aws-amplify/auth';
import { redirect } from 'next/navigation';
import Spinner from '@/app/_components/Spinner';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const userRef = useRef(undefined);

  const checkUser = useCallback(async () => {
    try {
      setLoading(true);
      const currentUser = await getCurrentUser();
      // getCurrentUser returns a different object each time
      // so we maintain own own user object reference to avoid rerendering
      if (currentUser?.userId === userRef.current?.userId) {
        Object.assign(userRef.current, currentUser);
      } else {
        userRef.current = currentUser && {...currentUser};
        setUser(userRef.current)
      }
    } catch (error) {
      userRef.current = undefined;
      setUser(null);
      if (error.name !== 'UserUnAuthenticatedException') {
        // TODO: surface this kind of error
        console.error('Error getting current user: ', error);
      }
    }
    setLoading(false);
  }, []);

  const value = useMemo(() => {
    const logOut = async () => {
      try {
        await signOut();
        setUser(null);
      } catch (error) {
        console.error('Error signing out: ', error);
      }
    };

    const logIn = async (username, password) => {
      try {
        setUser(null)
        await signIn({ username, password });
        await checkUser();
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

    return {
      loading,
      user,
      confirmResetCode,
      logIn,
      logOut
    }
  }, [loading, user, checkUser]);
  console.log({ loading, user })

  useEffect(() => {
    checkUser();
  }, [user, checkUser]);

  return (
    <AuthContext.Provider value={value}>
      {loading ? <Spinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);