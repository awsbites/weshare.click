'use client'
import { signIn } from 'aws-amplify/auth'
import { useAuth } from '../../../context/AuthProvider'
import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

const Invitation = () => {
  const { confirmInvitation } = useAuth()
  const [error, setError] = useState('')
  const searchParams = useSearchParams()
  const code = searchParams.get('code')
  const email = searchParams.get('email')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const { username, password, code } = event.target.elements
    console.log({ username, password, code })
    try {
      await confirmInvitation(username.value, password.value, code.value)
    } catch (error) {
      console.error('Error confirming invitation', error)
      setError(error.message || 'Unknown error')
    }
  }

  return (
    <>
      <h1>Invitation</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="username" type="text" className="input" placeholder="Username" required readOnly value={email} />
        <input name="password" type="password" className="input" placeholder="Password" required />
        <input name="code" type="password" className="input" placeholder="Confirmation Code" required hidden value={code} />
        <button type="submit" className="button">Accept Invitation</button>
      </form>
    </>
  );
}

export default Invitation