import { Appearance } from '@hanzo/appearance'
import { LogoIcon } from '@hanzogui/logo'
import { X } from '@hanzogui/lucide-icons-2'
import { useEffect, useRef, useState } from 'react'
import { Button, H4, XStack, YStack } from '@hanzo/gui'

// The reader's own type scale, ratio, density, face, measure and accent, from
// the mark in the bottom-right corner of every page. The panel is
// @hanzo/appearance's, and the knobs it writes land on <html> as the custom
// properties @hanzo/design multiplies into every ramp, so one change reaches
// the whole page, gui's `$n` ladder included. Theme stays with the header
// toggle: a second theme control is two answers to which one is in effect.
export function AppearanceDock() {
  const [open, setOpen] = useState(false)
  const box = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!open) return
    const away = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false)
    }
    const key = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', away)
    document.addEventListener('keydown', key)
    return () => {
      document.removeEventListener('mousedown', away)
      document.removeEventListener('keydown', key)
    }
  }, [open])

  return (
    <YStack
      ref={box as any}
      position="fixed"
      b="$4"
      r="$4"
      z={20000}
      items="flex-end"
      gap="$2"
    >
      {open && (
        <YStack
          role="dialog"
          aria-label="Appearance"
          width={340}
          maxW="calc(100vw - 32px)"
          maxH="calc(100dvh - 96px)"
          overflow="scroll"
          p="$4"
          rounded="$6"
          borderWidth={1}
          borderColor="$borderColor"
          bg="$background"
          elevation="$4"
        >
          <XStack items="center" justify="space-between" mb="$2">
            <H4 size="$3">Appearance</H4>
            <Button
              size="$2"
              circular
              chromeless
              aria-label="Close"
              icon={<X size={14} />}
              onPress={() => setOpen(false)}
            />
          </XStack>
          <Appearance />
        </YStack>
      )}
      <Button
        size="$5"
        circular
        chromeless
        aria-expanded={open}
        aria-label="Appearance"
        onPress={() => setOpen((v) => !v)}
      >
        <LogoIcon downscale={2} />
      </Button>
    </YStack>
  )
}
