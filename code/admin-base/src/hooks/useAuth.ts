// Thin React adapter over the localStorage-backed auth store in
// lib/api.ts. Subscribes to onAuthChange so UI re-renders when the
// token is set (post-login) or cleared (sign-out from any tab).

import { useEffect, useState } from 'react'
import { clearAuth, getRecord, getToken, onAuthChange } from '../lib/api'

export function useAuth() {
  const [token, setToken] = useState(getToken)
  const [record, setRecord] = useState(getRecord)

  useEffect(() => {
    return onAuthChange(() => {
      setToken(getToken())
      setRecord(getRecord())
    })
  }, [])

  return {
    token,
    record,
    isAuthenticated: Boolean(token && record),
    signOut: clearAuth,
  }
}
