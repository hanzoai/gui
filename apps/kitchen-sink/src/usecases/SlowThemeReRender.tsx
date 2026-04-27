import React from 'react'
import { View as HanzoguiView, Theme } from '@hanzogui/core'

import { Button, View as RNView } from 'react-native'

const newArray = Array.from(Array(10).keys())

export function SlowThemeReRender() {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light')

  const [type, setType] = React.useState<'Hanzogui' | 'RN'>('Hanzogui')
  return (
    <Theme name={theme}>
      <Button
        onPress={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        title={`Toggle Theme ${theme}`}
      ></Button>
      <Button
        onPress={() => setType(type === 'Hanzogui' ? 'RN' : 'Hanzogui')}
        title={
          type === 'Hanzogui' ? 'Using View from Hanzogui' : 'Using View with inline styles'
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
        {type === 'Hanzogui'
          ? newArray.map((item) => (
              <HanzoguiView key={item} backgroundColor="$color" height={50} width={50} />
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
