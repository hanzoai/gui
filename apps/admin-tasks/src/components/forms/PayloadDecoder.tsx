// PayloadDecoder — display-side inverse of PayloadInputWithEncoding.
// Decodes a Payload (`{ metadata: { encoding }, data }`) back to a
// human-readable preview. Used by event-detail panels, summary
// payload viewers, and anywhere the UI needs to show what the worker
// SDK would receive.
//
// Encodings handled:
//   * json/plain   — base64 → utf-8 → JSON.parse → pretty-printed
//   * json/protobuf, binary — base64 → utf-8 (best effort), shown raw
//   * none, unknown — opaque "Encoded payload" placeholder
//
// Falls back gracefully on bad base64 / non-utf8 — we never throw
// out of a render path.

import { Card, Text, YStack } from 'hanzogui'
import { base64ToUtf8 } from './PayloadInputWithEncoding'

export interface PayloadShape {
  metadata?: Record<string, string>
  data?: string
}

export interface PayloadDecoderProps {
  payload: PayloadShape | null | undefined
  // Render compact (no card chrome) so the decoder can sit inside
  // a wider grid without an extra border.
  inline?: boolean
}

export function PayloadDecoder({ payload, inline }: PayloadDecoderProps) {
  if (!payload || !payload.data) {
    return (
      <Inner inline={inline}>
        <Text fontSize="$2" color="$placeholderColor">
          (no payload)
        </Text>
      </Inner>
    )
  }
  const encoding = payload.metadata?.encoding ?? 'unknown'
  const decoded = decode(payload.data, encoding)
  return (
    <Inner inline={inline}>
      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor">
          encoding{' '}
          <Text
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            color="$color"
          >
            {encoding}
          </Text>
        </Text>
        <Text
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$1"
          color="$color"
          whiteSpace={'pre-wrap' as never}
        >
          {decoded}
        </Text>
      </YStack>
    </Inner>
  )
}

function Inner({
  inline,
  children,
}: {
  inline?: boolean
  children: React.ReactNode
}) {
  if (inline) return <YStack>{children}</YStack>
  return (
    <Card
      p="$3"
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      rounded="$2"
    >
      {children}
    </Card>
  )
}

// decode — pure helper. Exported for tests; the component uses it
// inline. Never throws — bad input falls through to the raw base64.
export function decode(b64: string, encoding: string): string {
  let utf8: string
  try {
    utf8 = base64ToUtf8(b64)
  } catch {
    return b64
  }
  if (encoding === 'json/plain') {
    try {
      return JSON.stringify(JSON.parse(utf8), null, 2)
    } catch {
      return utf8
    }
  }
  return utf8
}
