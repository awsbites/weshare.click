'use client'

import InvitationReset from '@/app/components/InvitationReset'

const Page = () => {
  return <InvitationReset
    title="Reset Password"
    description="Set a new password to complete your password reset"
    showTos={true}
    confirmButtonText="Confirm Reset"
  />
}

export default Page