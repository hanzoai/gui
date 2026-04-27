import { useEffect, useState } from 'react'
import {
  Button,
  Paragraph,
  Sheet,
  styled,
  Dialog as HanzoguiDialog,
  XStack,
  YStack,
} from 'hanzogui'

const CONTENT_RADIUS = '$6' as const

/**
 * Repro for the "content removes before animation on close" bug.
 *
 * Mirrors the three-punch-convo-app Dialog wrapper as closely as possible:
 * - Sheet.Frame with bg="$backgroundSurface" and *no* inner overlay/blur layer
 *   painted on top of the contents (which is what masks the bug in takeout).
 * - Adapt.Contents nested inside Sheet.ScrollView in Sheet.Frame.
 *
 * Note: 3PC uses `Adapt platform="touch"`, but `isTouchable` is false on
 * desktop chromium (no `ontouchstart`), so we use `when="maxMd"` here so the
 * adapted path activates on a narrow viewport. The bug is not specific to
 * touch detection — it's about Dialog.open vs Sheet.open lifecycle.
 *
 * Hypothesis: when the Dialog is closed, Adapt.Contents (driven by Dialog.open)
 * tears down its subtree before the Sheet has finished its slide-out animation,
 * so the body of the sheet visibly vanishes mid-slide.
 */
function ThreePunchDialog({
  children,
  open,
  onOpenChange,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  return (
    <HanzoguiDialog modal open={open} onOpenChange={onOpenChange}>
      <HanzoguiDialog.Adapt when="maxMd">
        <Sheet
          transition="medium"
          zIndex={250_000}
          modal
          snapPointsMode="fit"
          dismissOnSnapToBottom
        >
          <Sheet.Overlay
            bg="$shadow6"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            onPress={() => onOpenChange?.(false)}
          />
          <Sheet.Handle bg="$color5" />
          <Sheet.Frame
            testID="sheet-frame"
            padding="$4"
            gap="$4"
            borderRadius="$6"
            borderBottomRightRadius={0}
            borderBottomLeftRadius={0}
            bg="$background"
          >
            <Sheet.ScrollView>
              <HanzoguiDialog.Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
        </Sheet>
      </HanzoguiDialog.Adapt>

      <HanzoguiDialog.Portal>
        <DialogOverlay
          key="overlay"
          onPress={(e: any) => {
            onOpenChange?.(false)
            e.stopPropagation?.()
            e.preventDefault?.()
          }}
        />

        <DialogContent
          key="content"
          minHeight={400}
          minWidth={400}
          borderRadius={CONTENT_RADIUS}
          overflow="hidden"
          padding="$4"
        >
          {children}
        </DialogContent>
      </HanzoguiDialog.Portal>
    </HanzoguiDialog>
  )
}

const DialogOverlay = styled(HanzoguiDialog.Overlay, {
  unstyled: true,
  transition: 'quick',
  position: 'absolute',
  inset: 0 as any,
  opacity: 1,
  bg: '$shadow6',
  enterStyle: { opacity: 0 },
  exitStyle: { opacity: 0 },
})

const DialogContent = styled(HanzoguiDialog.Content, {
  unstyled: true,
  transition: 'quick',
  zIndex: 1_000_000,
  bg: '$background',
  borderWidth: 0.5,
  borderColor: '$color5',
  position: 'relative',
  width: '90%',
  maxWidth: 550,
  padding: '$4',
  opacity: 1,
  y: 0,
  enterStyle: { y: -5, opacity: 0, scale: 0.985 },
  exitStyle: { y: 5, opacity: 0 },
})

export function DialogSheetAdaptUnmountCase() {
  const [open, setOpen] = useState(false)

  // expose imperative open/close on window so the playwright test can drive
  // the dialog without depending on synthetic clicks reaching Pressable through
  // a SheetOverlay that covers the entire viewport.
  useEffect(() => {
    ;(window as any).__dialogSetOpen = setOpen
    return () => {
      delete (window as any).__dialogSetOpen
    }
  }, [])

  return (
    <YStack p="$4" gap="$4" items="center">
      <Button testID="open-dialog" onPress={() => setOpen(true)}>
        Open Dialog
      </Button>

      <ThreePunchDialog open={open} onOpenChange={setOpen}>
        <YStack gap="$3">
          <HanzoguiDialog.Title size="$6">Three Punch Dialog</HanzoguiDialog.Title>
          <HanzoguiDialog.Description>
            This body should remain visible while the sheet slides out.
          </HanzoguiDialog.Description>
          <Paragraph testID="dialog-content-marker">unique-content-marker-3pc</Paragraph>
          <XStack gap="$3" justify="flex-end">
            <HanzoguiDialog.Close asChild displayWhenAdapted>
              <Button testID="close-dialog">Close</Button>
            </HanzoguiDialog.Close>
          </XStack>
        </YStack>
      </ThreePunchDialog>
    </YStack>
  )
}
