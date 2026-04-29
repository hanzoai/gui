// HistoryJson — pretty-printed JSON view of the entire event history.
// Single textbox + a copy-to-clipboard button. The full structure
// (events array as returned by the engine) is dumped verbatim.

import { useCallback, useMemo, useState } from 'react'
import { Button, Card, Text, XStack, YStack } from 'hanzogui'
import { Check } from '@hanzogui/lucide-icons-2/icons/Check'
import { Copy } from '@hanzogui/lucide-icons-2/icons/Copy'
import { Empty } from '@hanzogui/admin'
import type { HistoryEvent } from '../../lib/types'

export interface HistoryJsonProps {
  events: HistoryEvent[]
}

export function HistoryJson({ events }: HistoryJsonProps) {
  const text = useMemo(() => JSON.stringify({ events }, null, 2), [events])
  const [copied, setCopied] = useState(false)

  const onCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch {
      // best-effort; clipboard may be unavailable in non-secure contexts.
    }
  }, [text])

  if (events.length === 0) {
    return <Empty title="No events to render" hint="History payload is empty." />
  }

  return (
    <YStack gap="$2">
      <XStack justify="flex-end">
        <Button size="$2" chromeless onPress={onCopy} aria-label="Copy JSON">
          <XStack items="center" gap="$1.5">
            {copied ? <Check size={14} color="#86efac" /> : <Copy size={14} color="#cbd5e1" />}
            <Text fontSize="$2">{copied ? 'Copied' : 'Copy JSON'}</Text>
          </XStack>
        </Button>
      </XStack>
      <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <Text
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$1"
          color="$color"
        >
          {text}
        </Text>
      </Card>
    </YStack>
  )
}
