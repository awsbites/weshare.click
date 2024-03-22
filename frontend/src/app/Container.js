'use client'

import { Amplify } from 'aws-amplify';
import { AuthProvider } from "@/context/AuthProvider";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID,
      userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID
    }
  }
})

export default function Container({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}