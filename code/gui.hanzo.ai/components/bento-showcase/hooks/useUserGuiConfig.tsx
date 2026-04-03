import { useState, useEffect } from 'react'

/**
 * Retrieves the user's GUI configuration from localStorage as a raw string.
 * SSR-safe implementation that doesn't use client-only guards.
 * @returns {string | null} userGuiConfig - The user's gui configuration
 */
export const useUserGuiConfig = () => {
  const [userGuiConfig, setUserGuiConfig] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userGuiConfig')
      setUserGuiConfig(stored || null)
    } catch {
      // localStorage not available
    }
  }, [])

  return userGuiConfig
}
