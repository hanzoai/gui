// ScheduleActionEditor — workflow type select + task queue + workflow
// id + input. The input is either rendered as a JsonSchemaForm (when
// the caller supplies a schema) or as a raw JSON textarea fallback.
//
// On submit the input is the parsed JS value; SchedulesCreate encodes
// it to base64 via encodeJsonBase64 before sending the create payload.

import { useState } from 'react'
import { Input, Text, TextArea, XStack, YStack } from 'hanzogui'
import type { ScheduleAction } from '../../lib/types'
import { JsonSchemaForm, type JsonSchema, defaultValueFor } from './JsonSchemaForm'

export interface ScheduleActionEditorState {
  workflowType: string
  taskQueue: string
  workflowId: string
  input: unknown
  inputJson: string
  inputMode: 'form' | 'json'
}

export function buildAction(state: ScheduleActionEditorState): ScheduleAction {
  return {
    workflowType: { name: state.workflowType.trim() },
    taskQueue: state.taskQueue.trim(),
    workflowId: state.workflowId.trim() || undefined,
    input: state.inputMode === 'form' ? state.input : safeParse(state.inputJson),
  }
}

function safeParse(s: string): unknown {
  if (!s.trim()) return null
  try {
    return JSON.parse(s)
  } catch {
    return s
  }
}

export interface ScheduleActionEditorProps {
  state: ScheduleActionEditorState
  onChange: (next: ScheduleActionEditorState) => void
  // Optional input schema. When provided the form mode renders a
  // JsonSchemaForm bound to `state.input`. When absent we fall back
  // to the JSON textarea.
  inputSchema?: JsonSchema
  workflowTypes?: string[]
  taskQueues?: string[]
}

export function ScheduleActionEditor({
  state,
  onChange,
  inputSchema,
  workflowTypes,
  taskQueues,
}: ScheduleActionEditorProps) {
  const [error, setError] = useState<string | null>(null)
  const set = (patch: Partial<ScheduleActionEditorState>) => onChange({ ...state, ...patch })
  return (
    <YStack gap="$3">
      <YStack gap="$1.5">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Workflow type
        </Text>
        <Input
          value={state.workflowType}
          onChangeText={(v) => set({ workflowType: v })}
          placeholder="MyWorkflow"
        />
        {workflowTypes && workflowTypes.length ? (
          <XStack gap="$1.5" flexWrap="wrap">
            {workflowTypes.slice(0, 8).map((t) => (
              <SuggestChip key={t} label={t} onPress={() => set({ workflowType: t })} />
            ))}
          </XStack>
        ) : null}
      </YStack>

      <YStack gap="$1.5">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Task queue
        </Text>
        <Input
          value={state.taskQueue}
          onChangeText={(v) => set({ taskQueue: v })}
          placeholder="default"
        />
        {taskQueues && taskQueues.length ? (
          <XStack gap="$1.5" flexWrap="wrap">
            {taskQueues.slice(0, 8).map((t) => (
              <SuggestChip key={t} label={t} onPress={() => set({ taskQueue: t })} />
            ))}
          </XStack>
        ) : null}
      </YStack>

      <YStack gap="$1.5">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Workflow ID prefix
        </Text>
        <Input
          value={state.workflowId}
          onChangeText={(v) => set({ workflowId: v })}
          placeholder="optional · {scheduleId}-{ts} when blank"
        />
      </YStack>

      <YStack gap="$2">
        <XStack items="center" gap="$2" justify="space-between">
          <Text fontSize="$2" fontWeight="500" color="$color">
            Input
          </Text>
          <XStack gap="$1">
            <ModeToggle
              active={state.inputMode === 'form'}
              disabled={!inputSchema}
              label="Form"
              onPress={() => {
                const next =
                  state.input === undefined && inputSchema
                    ? defaultValueFor(inputSchema)
                    : state.input
                set({ inputMode: 'form', input: next })
              }}
            />
            <ModeToggle
              active={state.inputMode === 'json'}
              label="JSON"
              onPress={() =>
                set({
                  inputMode: 'json',
                  inputJson:
                    state.inputJson || (state.input != null ? JSON.stringify(state.input, null, 2) : ''),
                })
              }
            />
          </XStack>
        </XStack>

        {state.inputMode === 'form' && inputSchema ? (
          <JsonSchemaForm
            schema={inputSchema}
            value={state.input}
            onChange={(v) => set({ input: v })}
          />
        ) : (
          <YStack gap="$1">
            <TextArea
              value={state.inputJson}
              onChangeText={(v) => {
                set({ inputJson: v })
                if (!v.trim()) {
                  setError(null)
                  return
                }
                try {
                  JSON.parse(v)
                  setError(null)
                } catch (e) {
                  setError(e instanceof Error ? e.message : String(e))
                }
              }}
              minH={120}
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              placeholder='{"key": "value"}'
            />
            {error ? (
              <Text fontSize="$1" color={'#ef4444' as never}>
                {error}
              </Text>
            ) : null}
          </YStack>
        )}
      </YStack>
    </YStack>
  )
}

function ModeToggle({
  active,
  label,
  onPress,
  disabled,
}: {
  active: boolean
  label: string
  onPress: () => void
  disabled?: boolean
}) {
  return (
    <Text
      fontSize="$1"
      px="$2"
      py="$1"
      rounded="$1"
      borderWidth={1}
      borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
      bg={active ? ('#f2f2f2' as never) : 'transparent'}
      color={active ? ('#070b13' as never) : disabled ? '$placeholderColor' : '$color'}
      opacity={disabled ? 0.5 : 1}
      onPress={disabled ? undefined : onPress}
      cursor={disabled ? 'not-allowed' : 'pointer'}
    >
      {label}
    </Text>
  )
}

function SuggestChip({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Text
      fontSize="$1"
      px="$2"
      py="$1"
      rounded="$1"
      borderWidth={1}
      borderColor="$borderColor"
      color="$color"
      cursor="pointer"
      onPress={onPress}
      hoverStyle={{ borderColor: '#f2f2f2' as never }}
    >
      {label}
    </Text>
  )
}
