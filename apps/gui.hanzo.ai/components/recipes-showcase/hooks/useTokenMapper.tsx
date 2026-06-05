import { useState, useEffect, useMemo } from 'react'

import type { Tokens } from '@hanzogui/core'
import { getTokens } from '@hanzogui/core'
import { useUserGuiConfig } from './useUserGuiConfig'

type MergedToken = Tokens & { userMatch: Tokens }

const useTokenMapper = () => {
  const userGuiConfig = useUserGuiConfig()
  const [mappedTokens, setMappedTokens] = useState<Tokens | null>(null)
  const recipesTokens = getTokens()

  useEffect(() => {
    if (recipesTokens && userGuiConfig) {
      try {
        const userTokensConfig = JSON.parse(userGuiConfig).guiConfig.tokens
        const mapped = mapRecipesTokensToUserTokens(
          recipesTokens,
          userTokensConfig
        ) as MergedToken
        setMappedTokens(mapped || null)
      } catch (error) {
        console.error('Failed to parse user gui config:', error)
        setMappedTokens(null)
      }
    }
  }, [recipesTokens, userGuiConfig])

  const userTokens = userGuiConfig
    ? (() => {
        try {
          return JSON.parse(userGuiConfig)?.guiConfig?.tokens
        } catch (error) {
          console.error('Failed to parse user gui config for tokens:', userGuiConfig)
          return null
        }
      })()
    : null

  function mapRecipesTokensToUserTokens(recipesTokens, userTokens) {
    function findClosestUserToken(recipesTokenVal, userTokens) {
      let closest = null
      let smallestDifference = Number.POSITIVE_INFINITY
      // userTokens is an object where each key is a category and each value is an object of tokens within that category.
      Object.values(userTokens).forEach((userToken: any) => {
        const difference = Math.abs(userToken.val - recipesTokenVal)
        if (difference < smallestDifference) {
          smallestDifference = difference
          closest = userToken as typeof closest
        }
      })

      return closest
    }

    const mappedTokens = {}

    Object.keys(recipesTokens).forEach((category) => {
      if (!userTokens[category]) {
        console.error(`No user tokens found for category: ${category}`)
        return
      }

      mappedTokens[category] = {}

      Object.entries(recipesTokens[category]).forEach(([key, recipesToken]) => {
        // Ensure we're comparing like with like
        if (userTokens[category] && userTokens[category][key]) {
          const closestUserToken = findClosestUserToken(
            // @ts-expect-error
            recipesToken.val,
            userTokens[category]
          )
          if (closestUserToken) {
            mappedTokens[category][key] = {
              // @ts-expect-error
              ...recipesToken,
              userMatch: closestUserToken, // Adjusted to directly use closestUserToken
            }
          } else {
            // If no closest token is found, keep the original
            mappedTokens[category][key] = recipesToken
          }
        }
      })
    })

    return mappedTokens
  }

  return {
    mappedTokens,
    userTokens,
    recipesTokens,
  }
}

export default useTokenMapper
