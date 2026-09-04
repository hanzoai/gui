import { useControllableState } from '@hanzogui/use-controllable-state'

import type { SheetProps } from './types.tsx'
import { useSheetController } from './useSheetController.tsx'

export const useSheetOpenState = (props: SheetProps) => {
  const { isHidden, controller } = useSheetController()

  const onOpenChangeInternal = (val: boolean) => {
    controller?.onOpenChange?.(val)
    props.onOpenChange?.(val)
  }

  const propVal = props.preferAdaptParentOpenState
    ? (controller?.open ?? props.open)
    : (props.open ?? controller?.open)

  const [open, setOpen] = useControllableState({
    prop: propVal,
    defaultProp: props.defaultOpen ?? false,
    onChange: onOpenChangeInternal,
    strategy: 'most-recent-wins',
  })

  return {
    open,
    setOpen,
    isHidden,
    controller,
  }
}

export type SheetOpenState = ReturnType<typeof useSheetOpenState>
