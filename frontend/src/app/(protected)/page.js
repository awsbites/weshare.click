'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthProvider';

export default function App () {
  const { user, logOut } = useAuth();
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="space-y-1">
        Home - You are {user.userId}
      </CardHeader>
      <CardContent>
        <Button onClick={logOut}>Log out</Button>
      </CardContent>
    </Card>
  );
}
