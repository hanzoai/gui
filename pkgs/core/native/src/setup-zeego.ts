/**
 * Setup zeego for Hanzogui native menus.
 *
 * Simply import this module at the top of your app entry point:
 *
 * @example
 * ```tsx
 * import '@hanzogui/native/setup-zeego'
 * ```
 *
 * This automatically detects and configures zeego for use with
 * Menu and ContextMenu native mode.
 */

import { getZeego } from './zeegoState'

function setup(): void {
  const g = globalThis as any
  if (g.__hanzogui_native_zeego_setup) return
  g.__hanzogui_native_zeego_setup = true

  try {
    const DropdownMenu = require('zeego/dropdown-menu')
    const ContextMenu = require('zeego/context-menu')

    if (DropdownMenu && ContextMenu) {
      getZeego().set({
        enabled: true,
        DropdownMenu,
        ContextMenu,
      })
    }
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`Error setting up Zeego`, err)
    }
    // zeego not installed
  }
}

// run setup immediately on import
setup()
