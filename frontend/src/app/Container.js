'use client'

import { Amplify } from 'aws-amplify';
import { AuthProvider } from "@/context/AuthProvider";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: '15o4i3d43i2c1odd7tlejoikjf',
      userPoolId: 'eu-west-1_Jn1Hv0kUL'
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