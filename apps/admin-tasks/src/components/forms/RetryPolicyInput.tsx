// RetryPolicyInput — collapsible form section that produces a
// RetryPolicy compatible with the Temporal proto. Every Start* dialog
// (StartWorkflow, ActivityStart, BatchCreate signal) takes one of
// these on the request body. The shape is fixed; the UI just gathers
// values.
//
// Defaults match upstream Temporal SDKs:
//   initialInterval     1s
//   backoffCoefficient  2.0
//   maximumInterval     60s    (typically 100× initial)
//   maximumAttempts     0      (unlimited — proto convention)
//   nonRetryable…       []
//
// Collapsed by default so dialogs that don't customise retry don't
// look noisy. Expanding shows the four numeric fields + a free-form
// list editor for non-retryable error type names.

import { useState } from 'react'
import { Button, Card, Input, Text, XStack, YStack } from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { X } from '@hanzogui/lucide-icons-2/icons/X'
import {
  DEFAULT_RETRY_POLICY,
  type RetryPolicy,
} from '../../lib/types'

export { DEFAULT_RETRY_POLICY }

export interface RetryPolicyInputProps {
  value: RetryPolicy
  onChange: (next: RetryPolicy) => void
  // Initial open/closed. Defaults to closed; ignored once the user
  // toggles it themselves.
  defaultOpen?: boolean
  disabled?: boolean
}

export function RetryPolicyInput({
  value,
  onChange,
  defaultOpen = false,
  disabled,
}: RetryPolicyInputProps) {
  const [open, setOpen] = useState(defaultOpen)

  const update = <K extends keyof RetryPolicy>(k: K, v: RetryPolicy[K]) =>
    onChange({ ...value, [k]: v })

  const customised =
    value.initialInterval !== DEFAULT_RETRY_POLICY.initialInterval ||
    value.backoffCoefficient !== DEFAULT_RETRY_POLICY.backoffCoefficient ||
    value.maximumInterval !== DEFAULT_RETRY_POLICY.maximumInterval ||
    value.maximumAttempts !== DEFAULT_RETRY_POLICY.maximumAttempts ||
    value.nonRetryableErrorTypes.length > 0

  return (
    <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <Button
          size="$2"
          chromeless
          self="flex-start"
          onPress={() => setOpen((v) => !v)}
          disabled={disabled}
        >
          <XStack items="center" gap="$1.5">
            {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
            <Text fontSize="$2" color="$color">
              Retry policy
            </Text>
            {customised ? (
              <Text fontSize="$1" color={'#86efac' as never}>
                customised
              </Text>
            ) : (
              <Text fontSize="$1" color="$placeholderColor">
                defaults
              </Text>
            )}
          </XStack>
        </Button>

        {open ? (
          <YStack gap="$3">
            <XStack gap="$3" flexWrap="wrap">
              <NumericField
                label="Initial interval"
                hint="duration (e.g. 1s)"
                value={value.initialInterval}
                onChange={(v) => update('initialInterval', v)}
                disabled={disabled}
              />
              <NumericField
                label="Backoff coefficient"
                hint="multiplier (e.g. 2.0)"
                value={String(value.backoffCoefficient)}
                onChange={(v) => update('backoffCoefficient', Number(v) || 0)}
                disabled={disabled}
              />
              <NumericField
                label="Maximum interval"
                hint="duration (e.g. 60s)"
                value={value.maximumInterval}
                onChange={(v) => update('maximumInterval', v)}
                disabled={disabled}
              />
              <NumericField
                label="Maximum attempts"
                hint="0 = unlimited"
                value={String(value.maximumAttempts)}
                onChange={(v) => update('maximumAttempts', Math.max(0, parseInt(v, 10) || 0))}
                disabled={disabled}
              />
            </XStack>

            <NonRetryableEditor
              types={value.nonRetryableErrorTypes}
              onChange={(t) => update('nonRetryableErrorTypes', t)}
              disabled={disabled}
            />

            <XStack>
              <Button
                size="$2"
                chromeless
                onPress={() => onChange(DEFAULT_RETRY_POLICY)}
                disabled={disabled}
              >
                <Text fontSize="$2" color="$placeholderColor">
                  Reset to defaults
                </Text>
              </Button>
            </XStack>
          </YStack>
        ) : null}
      </YStack>
    </Card>
  )
}

function NumericField({
  label,
  hint,
  value,
  onChange,
  disabled,
}: {
  label: string
  hint: string
  value: string
  onChange: (next: string) => void
  disabled?: boolean
}) {
  return (
    <YStack gap="$1" minW={150} flex={1}>
      <Text fontSize="$1" color="$placeholderColor">
        {label}
      </Text>
      <Input
        size="$2"
        value={value}
        onChangeText={onChange}
        placeholder={hint}
        disabled={disabled}
      />
    </YStack>
  )
}

function NonRetryableEditor({
  types,
  onChange,
  disabled,
}: {
  types: string[]
  onChange: (next: string[]) => void
  disabled?: boolean
}) {
  const [draft, setDraft] = useState('')

  function add() {
    const t = draft.trim()
    if (!t) return
    if (types.includes(t)) {
      setDraft('')
      return
    }
    onChange([...types, t])
    setDraft('')
  }

  function remove(t: string) {
    onChange(types.filter((x) => x !== t))
  }

  return (
    <YStack gap="$1.5">
      <Text fontSize="$1" color="$placeholderColor">
        Non-retryable error types
      </Text>
      <XStack gap="$2">
        <Input
          size="$2"
          flex={1}
          value={draft}
          onChangeText={setDraft}
          placeholder="MyApplicationError"
          disabled={disabled}
          onSubmitEditing={add}
        />
        <Button size="$2" onPress={add} disabled={disabled || !draft.trim()}>
          <XStack items="center" gap="$1">
            <Plus size={12} color="#7e8794" />
            <Text fontSize="$2">Add</Text>
          </XStack>
        </Button>
      </XStack>
      {types.length > 0 ? (
        <XStack gap="$1.5" flexWrap="wrap">
          {types.map((t) => (
            <XStack
              key={t}
              items="center"
              gap="$1"
              px="$2"
              py="$1"
              rounded="$2"
              borderWidth={1}
              borderColor="$borderColor"
              bg={'rgba(255,255,255,0.04)' as never}
            >
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$color"
              >
                {t}
              </Text>
              <Button
                size="$1"
                chromeless
                onPress={() => remove(t)}
                disabled={disabled}
                aria-label={`Remove ${t}`}
              >
                <X size={10} color="#7e8794" />
              </Button>
            </XStack>
          ))}
        </XStack>
      ) : null}
    </YStack>
  )
}
