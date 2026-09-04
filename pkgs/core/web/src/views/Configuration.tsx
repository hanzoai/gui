import { ClientOnly } from '@hanzogui/use-did-finish-ssr'
import React from 'react'
import { ComponentContext } from '../contexts/ComponentContext.tsx'
import type { AnimationDriver } from '../types.tsx'

interface ConfigurationProps {
  animationDriver?: AnimationDriver | null
  disableSSR?: boolean
  children: React.ReactNode
}

export const Configuration = (props: ConfigurationProps) => {
  const current = React.useContext(ComponentContext)

  return (
    <ClientOnly enabled={props.disableSSR ?? current.disableSSR}>
      <ComponentContext.Provider {...current} {...props} />
    </ClientOnly>
  )
}
