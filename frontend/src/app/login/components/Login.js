'use client'

import { useAuth } from '../../../context/AuthProvider'
import { redirect } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardTitle, CardDescription, CardFooter, CardHeader, CardContent, Card } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import Link from 'next/link'

const Login = () => {
  const { user, logIn } = useAuth()
  const [error, setError] = useState('')
  const [loading, startTransition] = useTransition()

  useEffect(() => {
    if (user) {
      redirect('/')
    }
  }, [user])

  const handleSubmit = (event) => {
    event.preventDefault()
    startTransition(async () => {
      const { username, password } = event.target.elements
      try {
        await logIn(username.value, password.value)
      } catch (error) {
        console.error('Error signing in', error)
        setError(error.message || 'Unknown error')
      }
    })
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-orange-600'>
      <form onSubmit={handleSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
            <CardDescription>Enter your email and password to sign in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className='space-y-2'>
                <Label htmlFor="email">Email</Label>
                <Input name="username" type="email" placeholder="u@example.com" required />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="password">Password</Label>
                <Input name="password" type="password" placeholder="Password" required />
              </div>
              <div className='space-y-2'>
                {error && <p className="text-sm text-red-600">{error}</p>}
              </div>
              <Button className="w-full" type="submit" disabled={loading}>
                {loading && <Icons.spinner className="animate-spin pr-2" />}{" "}
                Sign In
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm to-muted-foreground">Forgot your password? <Link href={"/reset-password"}>Click here to reset it.</Link></p>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export default Login