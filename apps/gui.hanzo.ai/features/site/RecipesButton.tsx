import { Button, type ButtonProps } from 'hanzogui'
import { RecipesIcon } from '../icons/RecipesIcon'
import { Span } from 'hanzogui'

export const RecipesButton = (props: ButtonProps) => {
  return (
    <Button
      theme="green"
      borderColor="$color6"
      elevation="$2"
      size="$3"
      rounded="$10"
      hoverStyle={{
        z: 100,
      }}
      {...props}
    >
      <Button.Text fontFamily="$silkscreen" fontSize={12}>
        <Span $sm={{ display: 'none' }}>Copy-Paste</Span> UI
      </Button.Text>
      <Button.Icon>
        <RecipesIcon scale={0.8} />
      </Button.Icon>
    </Button>
  )
}
