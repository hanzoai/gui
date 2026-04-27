import { memo } from 'react'
import { type SwitchProps, Switch as HanzoguiSwitch, Theme } from 'hanzogui'

export const Switch = memo((props: SwitchProps) => {
  return (
    <Theme name={props.checked ? 'accent' : 'gray'}>
      <HanzoguiSwitch
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
        <HanzoguiSwitch.Thumb
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
      </HanzoguiSwitch>
    </Theme>
  )
})
