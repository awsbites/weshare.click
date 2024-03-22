'use client'
import { Suspense } from 'react'
import InvitationReset from '@/app/components/InvitationReset'

const Page = () => {
  return <Suspense>
    <InvitationReset
      title="Invitation"
      description="You have been invited. Set your password to continue."
      showTos={true}
      confirmButtonText="Confirm Invitation"
    />
  </Suspense>
}

export default Page