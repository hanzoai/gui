// AllowedCallersEditor — multi-pick of namespaces that may call this
// endpoint. Supports literal namespace names, glob patterns ('team-*')
// and regex patterns ('/^prod-/'). The wire keeps the raw string list;
// matching happens server-side.

import { useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { XCircle } from '@hanzogui/lucide-icons-2/icons/XCircle'

export interface AllowedCallersEditorProps {
  value: string[]
  options: string[]
  onChange: (next: string[]) => void
}

function classify(s: string): 'literal' | 'glob' | 'regex' {
  if (s.startsWith('/') && s.endsWith('/') && s.length > 1) return 'regex'
  if (s.includes('*') || s.includes('?')) return 'glob'
  return 'literal'
}

export function AllowedCallersEditor({ value, options, onChange }: AllowedCallersEditorProps) {
  const [draft, setDraft] = useState('')
  const set = new Set(value)

  function add(v: string) {
    const trimmed = v.trim()
    if (!trimmed || set.has(trimmed)) return
    onChange([...value, trimmed])
  }

  function remove(v: string) {
    onChange(value.filter((x) => x !== v))
  }

  return (
    <YStack gap="$2">
      {value.length > 0 ? (
        <XStack gap="$1.5" flexWrap="wrap">
          {value.map((v) => {
            const kind = classify(v)
            return (
              <XStack
                key={v}
                items="center"
                gap="$1.5"
                px="$2"
                py="$1"
                borderWidth={1}
                borderColor="$borderColor"
                rounded="$2"
              >
                <Text
                  fontSize="$1"
                  color={kind === 'literal' ? '$color' : ('#86efac' as never)}
                  fontFamily={
                    kind === 'literal' ? undefined : ('ui-monospace, SFMono-Regular, monospace' as never)
                  }
                >
                  {v}
                </Text>
                <Button size="$1" chromeless onPress={() => remove(v)}>
                  <XCircle size={12} color="#7e8794" />
                </Button>
              </XStack>
            )
          })}
        </XStack>
      ) : (
        <Text fontSize="$1" color={'#fca5a5' as never}>
          At least one caller namespace is required.
        </Text>
      )}

      <XStack gap="$2" items="center">
        <Input
          value={draft}
          onChangeText={setDraft}
          placeholder="namespace, team-*, or /^prod-/"
          flex={1}
          onSubmitEditing={() => {
            add(draft)
            setDraft('')
          }}
        />
        <Button
          size="$2"
          onPress={() => {
            add(draft)
            setDraft('')
          }}
          disabled={!draft.trim()}
        >
          <XStack items="center" gap="$1.5">
            <Plus size={12} color="#7e8794" />
            <Text fontSize="$2">Add</Text>
          </XStack>
        </Button>
      </XStack>

      {options.length > 0 ? (
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            Suggestions
          </Text>
          <XStack gap="$1.5" flexWrap="wrap">
            {options
              .filter((o) => !set.has(o))
              .slice(0, 10)
              .map((o) => (
                <Button key={o} size="$1" chromeless onPress={() => add(o)}>
                  <Text fontSize="$1" color={'#86efac' as never}>
                    + {o}
                  </Text>
                </Button>
              ))}
          </XStack>
        </YStack>
      ) : null}
    </YStack>
  )
}
