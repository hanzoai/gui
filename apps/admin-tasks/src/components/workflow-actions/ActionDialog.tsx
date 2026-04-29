// Shared overlay shell for workflow mutation dialogs. The chrome
// library does not yet export a Dialog primitive, so we use the same
// fixed-position YStack pattern as SetCurrentDialog. ESC dismisses
// while not busy; outside-click dismisses while not busy.

import { useEffect } from 'react'
import { Card, H3, Text, YStack } from 'hanzogui'

export interface ActionDialogProps {
  title: string
  open: boolean
  busy?: boolean
  error?: string | null
  onClose: () => void
  children: React.ReactNode
  footer: React.ReactNode
  width?: number
}

export function ActionDialog({
  title,
  open,
  busy,
  error,
  onClose,
  children,
  footer,
  width = 520,
}: ActionDialogProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, busy, onClose])

  if (!open) return null

  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      bg={'rgba(0,0,0,0.55)' as never}
      items="center"
      justify="center"
      z={1000}
      style={{ position: 'fixed' as never }}
      onPress={() => (busy ? undefined : onClose())}
    >
      <Card
        width={width}
        maxWidth={'90vw' as never}
        p="$5"
        gap="$4"
        bg="$background"
        borderColor="$borderColor"
        borderWidth={1}
        onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
      >
        <H3 size="$5" color="$color" fontWeight="500">
          {title}
        </H3>
        {children}
        {error ? (
          <Text fontSize="$1" color={'#fca5a5' as never}>
            {error}
          </Text>
        ) : null}
        {footer}
      </Card>
    </YStack>
  )
}

// Encode a JSON value the way upstream's dataConverter does:
//   utf-8 bytes → base64 → Payload{ metadata: { encoding: 'json/plain' }, data }.
// Returns null when input is undefined (caller passes no payload).
export function encodeJsonPayload(value: unknown): { metadata: Record<string, string>; data: string } | null {
  if (value === undefined) return null
  const json = JSON.stringify(value)
  // btoa cannot handle multi-byte chars directly; round-trip via TextEncoder.
  const bytes = new TextEncoder().encode(json)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return {
    metadata: { encoding: 'json/plain' },
    data: btoa(bin),
  }
}
