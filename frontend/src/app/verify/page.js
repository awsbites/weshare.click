'use client'

import DeviceVerification from './components/DeviceVerification'
import { Suspense } from 'react'

const Page = () => {
  return (
    <Suspense>
      <DeviceVerification />
    </Suspense>
  )
}

export default Page