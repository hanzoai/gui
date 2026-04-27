import '@hanzogui/core/reset.css'

import { Text, HanzoguiProvider, View } from '@hanzogui/core'
import { LinearGradient } from '@hanzogui/linear-gradient'

import config from './hanzogui.config'

export const Root = () => {
  return (
    <HanzoguiProvider config={config} defaultTheme="light">
      <View flexDirection="column" flex={1} alignItems="center" justifyContent="center">
        <Text render="h1">Hello world</Text>
        <LinearGradient zIndex={-1} fullscreen colors={['red', 'blue']} />
      </View>
    </HanzoguiProvider>
  )
}
