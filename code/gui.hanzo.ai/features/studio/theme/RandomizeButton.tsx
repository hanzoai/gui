import { Dices } from '@hanzo/gui-lucide-icons-2'
import { Button, TooltipSimple } from '@hanzo/gui'
import { themeBuilderStore } from './store/ThemeBuilderStore'

export function RandomizeButton() {
  return (
    <TooltipSimple label="Shuffle Display">
      <Button
        aria-label="Variations"
        onPress={() => {
          themeBuilderStore.randomizeDemoOptions()
        }}
        icon={Dices}
        size="$2"
        rounded="$8"
        circular
        scaleIcon={1.3}
      />
    </TooltipSimple>
  )
}
