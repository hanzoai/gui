// SchedulePolicyEditor — overlap policy, catchup window, pause-on-
// failure flag. Output mirrors the Schedule.policies wire shape.

import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import type { Duration, OverlapPolicy } from '../../lib/types'

export interface SchedulePolicyState {
  overlapPolicy: OverlapPolicy
  catchupWindow: Duration
  pauseOnFailure: boolean
}

export const OVERLAP_POLICIES: ReadonlyArray<{ key: OverlapPolicy; label: string; help: string }> = [
  { key: 'Skip', label: 'Skip', help: 'Skip new actions while one is running.' },
  { key: 'BufferOne', label: 'Buffer one', help: 'Buffer at most one action.' },
  { key: 'BufferAll', label: 'Buffer all', help: 'Queue every overlapping action.' },
  { key: 'CancelOther', label: 'Cancel other', help: 'Cancel the running action and start new.' },
  { key: 'TerminateOther', label: 'Terminate other', help: 'Terminate the running action and start new.' },
  { key: 'AllowAll', label: 'Allow all', help: 'Run concurrently with no buffering.' },
]

export interface SchedulePolicyEditorProps {
  value: SchedulePolicyState
  onChange: (next: SchedulePolicyState) => void
}

export function SchedulePolicyEditor({ value, onChange }: SchedulePolicyEditorProps) {
  const set = (patch: Partial<SchedulePolicyState>) => onChange({ ...value, ...patch })
  return (
    <YStack gap="$3">
      <YStack gap="$2">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Overlap policy
        </Text>
        <XStack gap="$1.5" flexWrap="wrap">
          {OVERLAP_POLICIES.map((p) => (
            <Button
              key={p.key}
              size="$2"
              onPress={() => set({ overlapPolicy: p.key })}
              bg={value.overlapPolicy === p.key ? ('#f2f2f2' as never) : 'transparent'}
              borderWidth={1}
              borderColor={value.overlapPolicy === p.key ? ('#f2f2f2' as never) : '$borderColor'}
            >
              <Text fontSize="$1" color={value.overlapPolicy === p.key ? ('#070b13' as never) : '$color'}>
                {p.label}
              </Text>
            </Button>
          ))}
        </XStack>
        <Text fontSize="$1" color="$placeholderColor">
          {OVERLAP_POLICIES.find((p) => p.key === value.overlapPolicy)?.help}
        </Text>
      </YStack>

      <YStack gap="$1">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Catchup window
        </Text>
        <Input
          value={value.catchupWindow ?? ''}
          onChangeText={(v) => set({ catchupWindow: v })}
          placeholder="60s"
          width={140}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        />
        <Text fontSize="$1" color="$placeholderColor">
          How far back to fire missed actions on restart.
        </Text>
      </YStack>

      <XStack
        gap="$2"
        items="center"
        cursor="pointer"
        onPress={() => set({ pauseOnFailure: !value.pauseOnFailure })}
      >
        <Button
          size="$2"
          onPress={() => set({ pauseOnFailure: !value.pauseOnFailure })}
          bg={value.pauseOnFailure ? ('#f59e0b' as never) : 'transparent'}
          borderWidth={1}
          borderColor={value.pauseOnFailure ? ('#f59e0b' as never) : '$borderColor'}
        >
          <Text fontSize="$1" color={value.pauseOnFailure ? ('#070b13' as never) : '$color'}>
            {value.pauseOnFailure ? 'on' : 'off'}
          </Text>
        </Button>
        <Text fontSize="$2" color="$color">
          Pause schedule when an action fails
        </Text>
      </XStack>
    </YStack>
  )
}
