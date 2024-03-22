'use client'
import { resetPassword } from 'aws-amplify/auth'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardTitle, CardDescription, CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card'
import { Icons } from '@/components/icons'

const ResetPassword = () => {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [requestSent, setRequestSent] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const { username } = event.target.elements
    try {
      await resetPassword({ username: username.value })
      setRequestSent(true)
    } catch (error) {
      console.error('Error sending reset request', error)
      setError(error.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='h-screen w-screen flex justify-center items-center bg-orange-600'>
      <form onSubmit={handleSubmit}>
        <Card className="mx-auto max-w-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your email to request a password reset</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className='space-y-2'>
                <Label htmlFor="email">Email</Label>
                <Input name="username" type="email" placeholder="u@example.com" required disabled={requestSent} />
              </div>
              <Button className="w-full" type="submit" disabled={loading || requestSent}>
                {loading && <Icons.spinner className="animate-spin" />}{" "}
                Reset Password
              </Button>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
          </CardContent>
          {requestSent && (
          <CardFooter>
            <p className="text-sm">Your password reset request has been received. Please check your email to complete the reset.</p>
          </CardFooter>
          )}
        </Card>
      </form>
    </div>
  );
}

export default ResetPassword