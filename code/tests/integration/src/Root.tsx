import '@hanzo/gui-core/reset.css'

import { Text, TamaguiProvider, View } from '@hanzo/gui-core'
import { LinearGradient } from '@hanzo/gui-linear-gradient'

import config from './tamagui.config'

export const Root = () => {
  return (
    <TamaguiProvider config={config} defaultTheme="light">
      <View flexDirection="column" flex={1} alignItems="center" justifyContent="center">
        <Text render="h1">Hello world</Text>
        <LinearGradient zIndex={-1} fullscreen colors={['red', 'blue']} />
      </View>
    </TamaguiProvider>
  )
}
