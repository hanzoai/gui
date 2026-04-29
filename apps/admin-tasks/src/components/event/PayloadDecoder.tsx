// PayloadDecoder — best-effort renderer for proto-style Payload objects.
// A Payload is `{ metadata: { encoding: base64-string }, data: base64-string }`.
// We decode `data` from base64 → utf-8, JSON.parse if it parses, else keep
// as the utf-8 string. Anything else (already-decoded objects, arrays of
// payloads, scalars) round-trips through JSON.stringify.

import { useMemo, useState } from 'react'
import { Button, Text, XStack, YStack } from 'hanzogui'
import { Copy } from '@hanzogui/lucide-icons-2/icons/Copy'
import { Check } from '@hanzogui/lucide-icons-2/icons/Check'
import { decodePayload } from './event-attribute-rows'

export { decodePayload }

export interface PayloadDecoderProps {
  value: unknown
  // When set, prefer the field of the same name on `value` (proto idiom).
  field?: string
  // Compact one-liner mode for tables.
  inline?: boolean
}

export function PayloadDecoder({ value, field, inline = false }: PayloadDecoderProps) {
  const [copied, setCopied] = useState(false)
  const text = useMemo(() => {
    if (field && value && typeof value === 'object' && field in (value as Record<string, unknown>)) {
      return decodePayload((value as Record<string, unknown>)[field])
    }
    return decodePayload(value)
  }, [value, field])

  const onCopy = () => {
    if (typeof navigator === 'undefined' || !navigator.clipboard) return
    navigator.clipboard.writeText(text).then(
      () => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      },
      () => {},
    )
  }

  if (inline) {
    return (
      <Text
        fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        fontSize="$1"
        color="$color"
        numberOfLines={1}
      >
        {text}
      </Text>
    )
  }

  return (
    <YStack gap="$1.5">
      <XStack justify="flex-end">
        <Button size="$1" chromeless onPress={onCopy} aria-label="Copy payload">
          <XStack items="center" gap="$1.5">
            {copied ? <Check size={12} color="#86efac" /> : <Copy size={12} color="#7e8794" />}
            <Text fontSize="$1" color="$placeholderColor">
              {copied ? 'copied' : 'copy'}
            </Text>
          </XStack>
        </Button>
      </XStack>
      <YStack
        bg={'rgba(255,255,255,0.02)' as never}
        p="$3"
        rounded="$2"
        borderWidth={1}
        borderColor="$borderColor"
      >
        <Text
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$1"
          color="$color"
          whiteSpace={'pre-wrap' as never}
        >
          {text}
        </Text>
      </YStack>
    </YStack>
  )
}
