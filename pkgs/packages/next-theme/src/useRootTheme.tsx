import { useState, type Dispatch, type SetStateAction } from 'react'
import { isClient } from '@hanzogui/constants'

import type { ColorScheme } from './types'

export const useRootTheme = ({ fallback = 'light' }: { fallback?: ColorScheme } = {}): [
  ColorScheme,
  Dispatch<SetStateAction<ColorScheme>>,
] => {
  let initialVal = fallback

  if (isClient) {
    const classes = document.documentElement.classList
    initialVal = classes.contains('t_dark')
      ? 'dark'
      : classes.contains('t_light')
        ? 'light'
        : fallback
  }

  return useState<ColorScheme>(initialVal)
}
