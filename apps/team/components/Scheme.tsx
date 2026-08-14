import { Moon, Sun, SunMoon } from '@hanzogui/lucide-icons-2'
import { useSystemScheme, useUserScheme } from '@vxrn/color-scheme'
import { Appearance } from 'react-native'
import { isWeb, View } from '@hanzo/gui'

const order = ['system', 'light', 'dark'] as const

export const SchemeToggle = () => {
  const userScheme = useUserScheme()
  const systemScheme = useSystemScheme()
  const Icon =
    userScheme.setting === 'system' ? SunMoon : userScheme.setting === 'dark' ? Moon : Sun

  return (
    <View
      p="$2"
      cursor="pointer"
      pressStyle={{ opacity: 0.6 }}
      onPress={() => {
        const next = order[(order.indexOf(userScheme.setting) + 1) % 3]
        if (!isWeb) {
          Appearance.setColorScheme(next === 'system' ? systemScheme : next)
        }
        userScheme.set(next)
      }}
    >
      <Icon size={18} color="$color10" />
    </View>
  )
}
