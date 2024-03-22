'use client'
import ProtectedRoute from "@/app/components/ProtectedRoute";

import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
const Home = () => {

  const { logOut, user } = useAuth()

  return (
    <ProtectedRoute>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          Home - You are {user?.username}
        </CardHeader>
        <CardContent>
          <Button onClick={logOut}>Log out</Button>
        </CardContent>
      </Card>
    </ProtectedRoute>
  );
}

export default Home