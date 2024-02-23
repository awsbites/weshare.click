'use client'
import ProtectedRoute from "@/app/components/ProtectedRoute";

import { useAuth } from "@/context/AuthProvider";

const Home = () => {

  const { logOut, user } = useAuth()

  return (
    <ProtectedRoute>
      <div>
        <h1>Home - You are {user?.username}</h1>
        <button onClick={logOut}>Log out</button>
      </div>
    </ProtectedRoute>
  );
}

export default Home