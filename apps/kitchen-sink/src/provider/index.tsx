import type { GuiProviderProps } from '@hanzo/gui'
import { GuiProvider } from '@hanzo/gui'

import config from '../hanzogui.config'
import { useInsets } from './useInsets'

export function Provider({
  children,
  ...rest
}: Omit<Partial<GuiProviderProps>, 'config'>) {
  const insets = useInsets()

  return (
    // telemetry={false}: this is the test harness. Every Playwright case would
    // otherwise open the run with a pageview beacon to api.hanzo.ai — noise in
    // the warehouse and a network round-trip per test, for zero signal.
    <GuiProvider
      config={config}
      defaultTheme="light"
      insets={insets}
      telemetry={false}
      {...rest}
    >
      {children}
    </GuiProvider>
  )
}
