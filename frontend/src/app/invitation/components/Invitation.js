'use client'
import { signIn } from 'aws-amplify/auth'
import { useAuth } from '../../../context/AuthProvider'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card'

const Invitation = () => {
  const { confirmInvitation } = useAuth()
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const email = searchParams.get('email')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const { username, password, code } = event.target.elements
    try {
      await confirmInvitation(username.value, password.value, code.value)
    } catch (error) {
      console.error('Error confirming invitation', error)
      setError(error.message || 'Unknown error')
    }
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <p className="error-message">{error}</p>}
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2x1 font-bold">Invitation</CardTitle>
            <CardDescription>You have been invited. Set your password to continue.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className='space-y-2'>
                <Label htmlFor="email">Email</Label>
                <Input name="username" type="email" placeholder="u@example.com" required readOnly value={email} />
              </div>
              <div className='space-y-2'>
                <Label htmlFor="password">Password</Label>
                <Input name="password" type="password" placeholder="Password" required />
              </div>
              <input name="code" type="password" className="input" required readOnly hidden value={code} />
              <Button className="w-full" type="submit">
                Accept Invitation
              </Button>
              <p className="text-xs text-muted-foreground">
                By clicking continue, you agree to our {" "}
                <Link href="/terms-of-service" className="underline underline-offset-4 hover:text-primary"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-4 hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

export default Invitation