// AuthzEditor — Casbin model.conf editor. Upstream wraps two
// pieces: an iframe-hosted "advanced" editor (jcasbin web demo)
// and a "basic" CodeMirror editor. We don't ship either — we use
// a Hanzo GUI TextArea with monospace font and inline regex-based
// validation. That keeps the bundle small, avoids Monaco/CodeMirror,
// and still surfaces actionable line/column errors for typos.
//
// The editor is "dumb": it owns text, runs `validateModelText` on
// every change, and renders an error banner that lists each issue
// with a "Go to" button that scrolls + focuses the offending line.
// Built-in models (e.g. user-default-model) are read-only.
//
// Threat model: a malformed model breaks enforcement silently — the
// user must see typos immediately, not at runtime. Validation runs
// client-side on the editor; the backend remains source of truth
// (server validates again before persistence).

import { useCallback, useMemo, useRef, useState } from 'react'
import { TextArea, Text, XStack, YStack } from 'hanzogui'
import { AlertTriangle } from '@hanzogui/lucide-icons-2/icons/AlertTriangle'
import { CheckCircle2 } from '@hanzogui/lucide-icons-2/icons/CheckCircle2'
import { type ModelValidationError, validateModelText } from './types'

export interface AuthzEditorProps {
  value: string
  onChange: (next: string) => void
  readOnly?: boolean
  // Visible height in px. Defaults to 480 (matches upstream's
  // h-[500px] container with a small breathing room).
  height?: number
}

const MONO_FONT = 'ui-monospace, SFMono-Regular, Menlo, monospace' as never

export function AuthzEditor({
  value,
  onChange,
  readOnly = false,
  height = 480,
}: AuthzEditorProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null)
  const [focusedError, setFocusedError] = useState<number | null>(null)

  const errors = useMemo(() => validateModelText(value), [value])

  // Convert (line, col) to a string offset for setSelectionRange.
  // 1-based input, 0-based output.
  const lineColToOffset = useCallback(
    (line: number, col: number): number => {
      const lines = value.split('\n')
      let offset = 0
      for (let i = 0; i < line - 1 && i < lines.length; i++) {
        offset += lines[i].length + 1 // +1 for the newline
      }
      return offset + Math.max(0, col - 1)
    },
    [value],
  )

  const goTo = useCallback(
    (err: ModelValidationError) => {
      const ta = taRef.current
      if (!ta) return
      const start = lineColToOffset(err.line, err.column)
      ta.focus()
      ta.setSelectionRange(start, start)
      // Scroll the textarea so the line is visible. Crude but
      // works without measuring DOM rects.
      const lineHeight = 18
      ta.scrollTop = Math.max(0, (err.line - 4) * lineHeight)
      setFocusedError(err.line)
    },
    [lineColToOffset],
  )

  const valid = errors.length === 0

  return (
    <YStack gap="$2" flex={1}>
      <XStack
        items="center"
        gap="$2"
        px="$3"
        py="$2"
        rounded="$2"
        borderWidth={1}
        borderColor={valid ? '$borderColor' : ('#7f1d1d' as never)}
        bg={
          valid
            ? ('rgba(34,197,94,0.08)' as never)
            : ('rgba(239,68,68,0.10)' as never)
        }
      >
        {valid ? (
          <CheckCircle2 size={14} color="#86efac" />
        ) : (
          <AlertTriangle size={14} color="#fca5a5" />
        )}
        <Text fontSize="$2" color={valid ? ('#86efac' as never) : ('#fca5a5' as never)}>
          {valid ? 'Model OK' : `${errors.length} issue${errors.length === 1 ? '' : 's'}`}
        </Text>
        {readOnly ? (
          <Text fontSize="$1" color="$placeholderColor" ml="$2">
            (built-in, read-only)
          </Text>
        ) : null}
      </XStack>

      <TextArea
        ref={taRef as never}
        value={value}
        onChangeText={onChange}
        disabled={readOnly}
        spellCheck={false}
        autoComplete={'off' as never}
        autoCorrect={'off' as never}
        autoCapitalize={'none' as never}
        fontFamily={MONO_FONT}
        fontSize="$2"
        height={height}
        p="$3"
        rounded="$2"
        borderWidth={1}
        borderColor="$borderColor"
        bg="rgba(0,0,0,0.25)"
        color="$color"
        // Disable Hanzo GUI's auto-resize so the long .conf doesn't
        // push the page layout. Internal scroll is the upstream
        // behaviour.
        verticalAlign={'top' as never}
        aria-label="Casbin model definition"
        aria-invalid={!valid}
      />

      {errors.length > 0 ? (
        <YStack
          rounded="$2"
          borderWidth={1}
          borderColor={'#7f1d1d' as never}
          bg={'rgba(239,68,68,0.06)' as never}
          maxH={140}
          overflow="hidden"
        >
          {errors.map((err, i) => (
            <XStack
              key={`${err.line}-${err.column}-${i}`}
              px="$3"
              py="$2"
              gap="$3"
              borderBottomWidth={i === errors.length - 1 ? 0 : 1}
              borderBottomColor="$borderColor"
              items="center"
              hoverStyle={{ background: 'rgba(255,255,255,0.04)' }}
              bg={
                focusedError === err.line
                  ? ('rgba(239,68,68,0.12)' as never)
                  : ('transparent' as never)
              }
            >
              <Text
                fontSize="$1"
                color="#fca5a5"
                fontFamily={MONO_FONT}
                width={64}
              >
                {err.line}:{err.column}
              </Text>
              <Text fontSize="$2" color="$color" flex={1}>
                {err.message}
              </Text>
              {!readOnly ? (
                <Text
                  role={'button' as never}
                  cursor={'pointer' as never}
                  fontSize="$1"
                  color="#93c5fd"
                  px="$2"
                  py="$1"
                  rounded="$1"
                  hoverStyle={{ background: 'rgba(59,130,246,0.12)' }}
                  onPress={() => goTo(err)}
                >
                  Go to
                </Text>
              ) : null}
            </XStack>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}
