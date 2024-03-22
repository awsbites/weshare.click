'use client'
import { Suspense } from 'react'
import VerificationResult from './components/VerificationResult'

/**
 * Page designed to be a redirect destination for the Device Code authorisation
 * flow. The success or error result is displayed in a friendly way to the user.
 */
const Page = () => {
  return (
    <Suspense>
      <VerificationResult />
    </Suspense>
  )
}

export default Page