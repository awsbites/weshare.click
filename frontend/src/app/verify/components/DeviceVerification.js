'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from '@/components/ui/card'
import { useSearchParams } from 'next/navigation'

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_BASE_URL

/**
 * A view that can be used as an entry point to the device verification flow, triggering the first step
 * of an OAuth 2.0 Device Code Flow
 */
export default function DeviceVerification () {
  const [error, setError] = useState('')
  const searchParams = useSearchParams();
  const providedCode = searchParams.get('user_code')
  const [userCode, setUserCode] = useState(providedCode)
  console.log({ AUTH_BASE_URL })
  const targetUri = `${AUTH_BASE_URL}/verify?user_code=${userCode}`

  console.log({ targetUri, userCode, providedCode })

  return (
    <div className='h-screen w-screen flex justify-center items-center'>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2x1 font-bold">Device Verification Request</CardTitle>
          <CardDescription>An application is requesting access to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className='space-y-2'>
              <Label htmlFor="email">Code</Label>
              <Input name="code" type="text" required readOnly={!!providedCode} value={userCode} onChange={(e) => setUserCode(e.target.value?.trim())} />
            </div>
            <div className='space-y-2'>
              {error && <p className="text-sm text-red-600">{error}</p>}
            </div>
            <Link href={targetUri}>
              <Button className="w-full" type="submit" disabled={!userCode}>Confirm and proceed</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}