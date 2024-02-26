'use client'
import InvitationReset from '@/app/components/InvitationReset'

const Page = () => {
  return <InvitationReset
    title="Invitation"
    description="You have been invited. Set your password to continue."
    showTos={true}
    confirmButtonText="Confirm Invitation"
  />
}

export default Page