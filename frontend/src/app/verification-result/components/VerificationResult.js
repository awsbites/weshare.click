'use client'
import { CardTitle, CardHeader, CardContent, Card, CardFooter } from '@/components/ui/card'
import { Icons } from '@/components/icons'
import { useSearchParams } from 'next/navigation'

/**
 * A view that can be used as an invitation or a reset password view.
 */
const VerificationResult = () => {
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  let error = searchParams.get('error')
  if (!success && !error) {
    error = 'Something went wrong. You can\'t get there from here! 🤪'
  }

  const className = success ? 'text-green-600 h-16 w-16 animate-bounce' : 'text-red-600 h-16 w-16'
  const resultIcon = error ? <Icons.cross className={className} /> : <Icons.check className={className} />
  return (
    <div className='h-screen w-screen flex justify-center items-center '>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2x1 font-bold">Verification {success ? 'succeeded' : 'failed'}</CardTitle>
        </CardHeader>
        <CardContent>
          {success && (
            <>
              <p>{success}</p>
              <p className='py-4'>
                You can now close this tab.
              </p>
            </>
            )}
          {error && <p>{error}</p>}
        </CardContent>
        <CardFooter className="flex justify-center">
          {resultIcon}
        </CardFooter>
      </Card>
    </div>
  )
}

export default VerificationResult