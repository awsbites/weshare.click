"use client"
import { signIn } from 'aws-amplify/auth'
import { useAuth } from '../../../context/AuthProvider'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Login = () => {
  const { user, checkUser } = useAuth()
  const router = useRouter()
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    const { username, password } = event.target.elements
    console.log({ username, password })
    try {
      await signIn({ username: username.value, password: password.value })
    } catch (error) {
      console.error('Error signing in', error)
      setError(error.message || 'Unknown error')
    }
    checkUser()
  }

  return (
    <>
      <h1>Log In</h1>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <input name="username" type="text" className="input" placeholder="Username" required />
        <input name="password" type="password" className="input" placeholder="Password" required />
        <button type="submit" className="button">Log in</button>
      </form>
    </>
  );
}

export default Login