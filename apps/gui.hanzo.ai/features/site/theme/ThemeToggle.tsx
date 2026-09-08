import { Moon, Sun } from '@hanzogui/lucide-icons-2'
import { useUserScheme } from '@vxrn/color-scheme'
import { memo, useEffect, useState } from 'react'
import { Appearance } from 'react-native'
import type { ButtonProps } from '@hanzo/gui'
import { Button, isWeb, TooltipSimple } from '@hanzo/gui'

export const ThemeToggle = memo((props: ButtonProps) => {
  const { onPress, Icon, scheme } = useToggleTheme()

  return (
    <TooltipSimple
      groupId="header-actions-theme"
      label={scheme === 'dark' ? 'Dark' : 'Light'}
    >
      <Button
        size="$3"
        onPress={onPress}
        {...props}
        aria-label="Toggle light/dark color scheme"
        icon={Icon}
        hoverStyle={{
          bg: 'rgba(0,0,0,0.15)',
        }}
      />
    </TooltipSimple>
  )
})

/**
 * Dark or light, and nothing else.
 *
 * A third setting that follows the machine is a second answer to a question the
 * site has already answered — dark — and the two readers of it disagree: the
 * pre-paint script resolves it to the default while the runtime asks the OS, so
 * a page boots dark and turns light a frame later. The toggle names the two
 * schemes it can be in, and the default is what a reader who has named neither
 * gets.
 */
export function useToggleTheme() {
  const userScheme = useUserScheme()

  // for faster re renders on heavy pages
  const [val, setVal] = useState(userScheme.value)

  useEffect(() => {
    if (userScheme.value !== val) {
      setVal(userScheme.value)
    }
  }, [userScheme.value])

  return {
    scheme: val,
    Icon: val === 'dark' ? Moon : Sun,
    onPress: () => {
      const next = val === 'dark' ? 'light' : 'dark'
      setVal(next)

      setTimeout(() => {
        if (!isWeb) {
          Appearance.setColorScheme(next)
        }

        userScheme.set(next)
      }, 20)
    },
  }
}
