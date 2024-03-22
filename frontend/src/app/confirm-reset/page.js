'use client'

import { Suspense } from 'react'

import InvitationReset from '@/app/_components/InvitationReset'

const Page = () => {
  return (
    <Suspense>
      <InvitationReset
        title="Reset Password"
        description="Set a new password to complete your password reset"
        showTos={true}
        confirmButtonText="Confirm Reset"
      />
    </Suspense>
  )
}

export default Page