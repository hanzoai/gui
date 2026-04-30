// PayloadInputWithEncoding — reusable form widget for any dialog that
// needs to send a Payload to the backend (StartWorkflow, SignalWorkflow,
// ActivityStart, …). Today the existing dialogs use a plain TextArea
// + encodeJsonPayload; this widget extends that with:
//
//   * an explicit encoding selector (json/plain | json/protobuf | binary | none)
//   * a "Format" button that runs JSON.parse → JSON.stringify(_, null, 2)
//   * an inline parse-error chip so the user sees JSON mistakes
//     without having to submit the form
//   * a stable controlled API: the parent owns the textarea text and
//     the encoding choice; the widget reports back an encoded Payload
//     (or null) via onPayloadChange.
//
// Tier 1A and 1B can swap their existing TextArea blocks for
// <PayloadInputWithEncoding/> by lifting two pieces of state and
// reading payload from onPayloadChange. The existing
// `encodeJsonPayload` helper in ActionDialog stays for back-compat.

import { useEffect, useMemo, useState } from 'react'
import { Button, Text, TextArea, XStack, YStack } from 'hanzogui'
import {
  PAYLOAD_ENCODINGS,
  type PayloadEncoding,
} from '../../lib/types'

export interface EncodedPayload {
  metadata: { encoding: string }
  data: string
}

export interface PayloadInputWithEncodingProps {
  // The textarea text. Controlled by the parent so existing form-state
  // shapes don't have to change.
  value: string
  onChange: (next: string) => void
  // The encoding tag. Controlled by the parent for the same reason.
  encoding: PayloadEncoding
  onEncodingChange: (next: PayloadEncoding) => void
  // Called whenever the encoded payload changes — null when the
  // textarea is empty / encoding is `none` / JSON parse fails.
  onPayloadChange?: (payload: EncodedPayload | null) => void
  label?: string
  placeholder?: string
  disabled?: boolean
  minH?: number
}

export function PayloadInputWithEncoding({
  value,
  onChange,
  encoding,
  onEncodingChange,
  onPayloadChange,
  label = 'Payload',
  placeholder = '{"key": "value"}',
  disabled,
  minH = 120,
}: PayloadInputWithEncodingProps) {
  const [parseError, setParseError] = useState<string | null>(null)

  // Re-encode whenever inputs change. Keeps the parent's payload
  // state in sync without forcing them to call an encoder manually.
  const encoded = useMemo(() => {
    if (encoding === 'none') {
      setParseError(null)
      return null
    }
    if (!value.trim()) {
      setParseError(null)
      return null
    }
    if (encoding === 'json/plain') {
      try {
        // Validate the JSON, then re-encode the original string. We
        // intentionally encode the user's text (not a re-stringify)
        // so trailing whitespace + key order are preserved.
        JSON.parse(value)
        setParseError(null)
      } catch (e) {
        setParseError(e instanceof Error ? e.message : String(e))
        return null
      }
    } else {
      setParseError(null)
    }
    return {
      metadata: { encoding },
      data: utf8ToBase64(value),
    }
  }, [value, encoding])

  useEffect(() => {
    onPayloadChange?.(encoded)
  }, [encoded, onPayloadChange])

  function format() {
    try {
      const parsed = JSON.parse(value)
      onChange(JSON.stringify(parsed, null, 2))
      setParseError(null)
    } catch (e) {
      setParseError(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <YStack gap="$2">
      <XStack items="center" justify="space-between" gap="$2" flexWrap="wrap">
        <Text fontSize="$1" color="$placeholderColor">
          {label}
        </Text>
        <XStack items="center" gap="$2" flexWrap="wrap">
          <EncodingSelect
            value={encoding}
            onChange={onEncodingChange}
            disabled={disabled}
          />
          {encoding === 'json/plain' ? (
            <Button
              size="$2"
              chromeless
              onPress={format}
              disabled={disabled || !value.trim()}
            >
              <Text fontSize="$2" color={'#86efac' as never}>
                Format
              </Text>
            </Button>
          ) : null}
        </XStack>
      </XStack>
      <TextArea
        size="$3"
        minH={minH}
        value={value}
        onChangeText={onChange}
        placeholder={encoding === 'none' ? '(no payload)' : placeholder}
        fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        disabled={disabled || encoding === 'none'}
      />
      {parseError ? (
        <XStack
          items="center"
          gap="$2"
          px="$2"
          py="$1.5"
          bg={'#1f1213' as never}
          borderColor="#7f1d1d"
          borderWidth={1}
          rounded="$2"
        >
          <Text fontSize="$1" color={'#fca5a5' as never}>
            JSON: {parseError}
          </Text>
        </XStack>
      ) : null}
    </YStack>
  )
}

function EncodingSelect({
  value,
  onChange,
  disabled,
}: {
  value: PayloadEncoding
  onChange: (v: PayloadEncoding) => void
  disabled?: boolean
}) {
  // hanzogui has no Select primitive yet (see WorkflowSearchBar etc.);
  // a native <select> nested inside a hanzogui XStack styles cleanly
  // enough and stays a11y-friendly without extra deps.
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as PayloadEncoding)}
      aria-label="Payload encoding"
      style={{
        background: 'transparent',
        color: '#cbd5e1',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 6,
        padding: '4px 8px',
        fontSize: 12,
        fontFamily: 'inherit',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
    >
      {PAYLOAD_ENCODINGS.map((e) => (
        <option key={e} value={e}>
          {e}
        </option>
      ))}
    </select>
  )
}

// utf8ToBase64 — round-trips utf-8 text through bytes so multi-byte
// characters survive btoa. Equivalent to encodeJsonPayload's encoder
// but exposed for callers that want the raw transform.
export function utf8ToBase64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}

// base64ToUtf8 — inverse of utf8ToBase64, used by PayloadDecoder.
export function base64ToUtf8(b64: string): string {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return new TextDecoder().decode(bytes)
}
