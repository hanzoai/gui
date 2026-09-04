import { useComposedRefs } from '@hanzogui/compose-refs'
import type { GuiElement } from '@hanzogui/core'
import type { ListItemProps } from '@hanzogui/list-item'
import { ListItem } from '@hanzogui/list-item'
import * as React from 'react'

import { useSelectContext, useSelectItemParentContext } from './context.tsx'
import type { SelectScopedProps } from './types.tsx'

/* -------------------------------------------------------------------------------------------------
 * SelectTrigger
 * -----------------------------------------------------------------------------------------------*/
const TRIGGER_NAME = 'SelectTrigger'

export type SelectTriggerProps = SelectScopedProps<ListItemProps>

// Guarded on matchMedia, not on window. A DOM without one is not hypothetical:
// jsdom defines `window` and does NOT define `window.matchMedia`, so testing
// `window` alone answered "yes, there is a browser here" and then called a
// method that is not there. Because this runs at MODULE SCOPE, the TypeError
// landed on the import — before any test body, and unreachable by a beforeEach
// polyfill — so every jsdom consumer of this package had to shim matchMedia in
// setup just to `import` a Select. This repo's own suites do exactly that
// (pkgs/vite-plugin-internal/src/test-setup.ts installs one), which is why the
// break was invisible here and load-bearing everywhere else.
//
// A DOM that cannot answer the query is treated as coarse, matching the
// no-window branch: assuming touch grows the hit target, and being generous
// with a target is the safe way to be wrong.
const isPointerCoarse =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  process.env.GUI_TARGET === 'web'
    ? window.matchMedia('(pointer:coarse)').matches
    : true

export const SelectTrigger = React.forwardRef<GuiElement, SelectTriggerProps>(
  function SelectTrigger(props: SelectTriggerProps, forwardedRef) {
    const { scope, disabled = false, unstyled = false, ...triggerProps } = props

    const context = useSelectContext(scope)
    const itemParentContext = useSelectItemParentContext(scope)
    const composedRefs = useComposedRefs(
      forwardedRef,
      context.floatingContext?.refs.setReference as any
    )
    // const getItems = useCollection(__scopeSelect)
    // const labelId = useLabelContext(context.trigger)
    // const labelledBy = ariaLabelledby || labelId
    if (itemParentContext.shouldRenderWebNative) {
      return null
    }

    return (
      <ListItem
        componentName={TRIGGER_NAME}
        unstyled={unstyled}
        render="button"
        type="button"
        id={itemParentContext.id}
        {...(!unstyled && {
          focusVisibleStyle: {
            outlineStyle: 'solid',
            outlineWidth: 2,
            outlineColor: '$outlineColor',
          },
          borderWidth: 1,
          size: itemParentContext.size,
        })}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={context.open}
        aria-autocomplete="none"
        dir={context.dir}
        disabled={disabled}
        data-disabled={disabled ? '' : undefined}
        {...triggerProps}
        ref={composedRefs}
        {...(process.env.GUI_TARGET === 'web' && itemParentContext.interactions
          ? {
              ...itemParentContext.interactions.getReferenceProps(),
              ...(isPointerCoarse
                ? {
                    onPress() {
                      itemParentContext.setOpen(!context.open)
                    },
                  }
                : {
                    onMouseDown() {
                      context.floatingContext?.update?.()
                      itemParentContext.setOpen(!context.open)
                    },
                  }),
            }
          : {
              onPress() {
                itemParentContext.setOpen(!context.open)
              },
            })}
      />
    )
  }
)
