import { useEffect, useState } from 'react'
import { onAuthStateChanged, getIdTokenResult } from 'firebase/auth'
import { auth } from '../../firebase/firebase'

export default function useProtectedRole(requiredRole: string) {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const token = await getIdTokenResult(user)
        const role = token.claims.role
        setAuthorized(role === requiredRole)
      } else {
        setAuthorized(false)
      }
    })
    return () => unsubscribe()
  }, [])

  return authorized
}