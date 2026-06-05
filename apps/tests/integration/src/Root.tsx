import '@hanzogui/core/reset.css'

import { Text, GuiProvider, View } from '@hanzogui/core'
import { LinearGradient } from '@hanzogui/linear-gradient'

import config from './gui.config'

export const Root = () => {
  return (
    <GuiProvider config={config} defaultTheme="light">
      <View flexDirection="column" flex={1} alignItems="center" justifyContent="center">
        <Text render="h1">Hello world</Text>
        <LinearGradient zIndex={-1} fullscreen colors={['red', 'blue']} />
      </View>
    </GuiProvider>
  )
}
