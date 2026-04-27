import { useState, useEffect } from 'react'

/**
 * Retrieves the user's GUI configuration from localStorage as a raw string.
 * SSR-safe implementation that doesn't use client-only guards.
 * @returns {string | null} userHanzoguiConfig - The user's gui configuration
 */
export const useUserHanzoguiConfig = () => {
  const [userHanzoguiConfig, setUserHanzoguiConfig] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('userHanzoguiConfig')
      setUserHanzoguiConfig(stored || null)
    } catch {
      // localStorage not available
    }
  }, [])

  return userHanzoguiConfig
}
