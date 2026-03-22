import React from 'react'
import { View as GuiView, Theme } from '@hanzo/gui-core'

import { Button, View as RNView } from 'react-native'

const newArray = Array.from(Array(10).keys())

export function SlowThemeReRender() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  const [type, setType] = React.useState<'Gui' | 'RN'>('Gui')
  return (
    <Theme name={theme}>
      <Button
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title={`Toggle Theme ${theme}`}
      ></Button>
      <Button
        onPress={() => setType(type === 'Gui' ? 'RN' : 'Gui')}
        title={
          type === 'Gui' ? 'Using View from Gui' : 'Using View with inline styles'
        }
      />

      <RNView
        style={{
          rowGap: 4,
          flexDirection: 'row',
          columnGap: 4,
          flexWrap: 'wrap',
        }}
      >
        {type === 'Gui'
          ? newArray.map((item) => (
              <GuiView key={item} backgroundColor="$color" height={50} width={50} />
            ))
          : newArray.map((item) => (
              <RNView
                key={item}
                style={{
                  backgroundColor: theme === 'dark' ? 'red' : 'blue',
                  height: 50,
                  width: 50,
                }}
              />
            ))}
      </RNView>
    </Theme>
  )
}
