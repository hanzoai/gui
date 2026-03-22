import { memo } from 'react'
import { type SwitchProps, Switch as GuiSwitch, Theme } from '@hanzo/gui'

export const Switch = memo((props: SwitchProps) => {
  return (
    <Theme name={props.checked ? 'accent' : 'gray'}>
      <GuiSwitch
        transition={[
          'bouncy',
          {
            opacity: {
              overshootClamping: true,
            },
            backgroundColor: {
              overshootClamping: true,
            },
          },
        ]}
        size="$3"
        {...props}
      >
        <GuiSwitch.Thumb
          transition={[
            'quickest',
            {
              opacity: {
                overshootClamping: true,
              },
              backgroundColor: {
                overshootClamping: true,
              },
            },
          ]}
          alignItems="center"
          justifyContent="center"
        />
      </GuiSwitch>
    </Theme>
  )
})
