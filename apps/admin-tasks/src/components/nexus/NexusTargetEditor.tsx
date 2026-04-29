// NexusTargetEditor — discriminated union editor for endpoint target.
// Worker target routes to a task queue in another namespace via the
// internal task-server scheme. External target is a plain HTTPS URL
// with optional auth headers.
//
// Wire format on `NexusEndpointSpec.target` (string):
//   worker:   tasksrv://<namespace>/<taskQueue>/<service>
//   external: https://...   (or http:// in dev)
//
// Headers are not part of the spec.target string; they are emitted on
// the spec body as `target_headers` when external. The backend ignores
// unknown fields today; once it lands they are picked up natively.

import { useEffect, useMemo } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'

export type NexusTarget =
  | {
      kind: 'worker'
      namespace: string
      taskQueue: string
      service: string
    }
  | {
      kind: 'external'
      url: string
      headers: Array<{ key: string; value: string }>
    }

export const EMPTY_WORKER: NexusTarget = {
  kind: 'worker',
  namespace: '',
  taskQueue: '',
  service: '',
}

export const EMPTY_EXTERNAL: NexusTarget = {
  kind: 'external',
  url: '',
  headers: [],
}

export interface NexusTargetEditorProps {
  value: NexusTarget
  namespaces: string[]
  onChange: (next: NexusTarget) => void
}

export function parseTarget(target: string): NexusTarget {
  if (target.startsWith('tasksrv://')) {
    const parts = target.slice('tasksrv://'.length).split('/')
    return {
      kind: 'worker',
      namespace: decodeURIComponent(parts[0] ?? ''),
      taskQueue: decodeURIComponent(parts[1] ?? ''),
      service: decodeURIComponent(parts.slice(2).join('/') ?? ''),
    }
  }
  if (target.startsWith('http://') || target.startsWith('https://')) {
    return { kind: 'external', url: target, headers: [] }
  }
  return { ...EMPTY_WORKER }
}

export function serializeTarget(t: NexusTarget): string {
  if (t.kind === 'worker') {
    const ns = encodeURIComponent(t.namespace)
    const q = encodeURIComponent(t.taskQueue)
    const svc = encodeURIComponent(t.service)
    return `tasksrv://${ns}/${q}/${svc}`
  }
  return t.url
}

export function targetIsValid(t: NexusTarget): boolean {
  if (t.kind === 'worker') {
    return Boolean(t.namespace && t.taskQueue && t.service)
  }
  return /^https?:\/\/.+/.test(t.url)
}

export function NexusTargetEditor({ value, namespaces, onChange }: NexusTargetEditorProps) {
  const nsOptions = useMemo(() => Array.from(new Set(namespaces.filter(Boolean))).sort(), [namespaces])

  // If the worker namespace is empty but options exist, seed the first.
  useEffect(() => {
    if (value.kind === 'worker' && !value.namespace && nsOptions.length > 0) {
      onChange({ ...value, namespace: nsOptions[0] })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.kind, nsOptions.length])

  return (
    <YStack gap="$3">
      <XStack gap="$2">
        <Tab
          active={value.kind === 'worker'}
          onPress={() =>
            onChange({
              kind: 'worker',
              namespace: nsOptions[0] ?? '',
              taskQueue: '',
              service: '',
            })
          }
        >
          Worker
        </Tab>
        <Tab
          active={value.kind === 'external'}
          onPress={() => onChange({ ...EMPTY_EXTERNAL })}
        >
          External
        </Tab>
      </XStack>

      {value.kind === 'worker' ? (
        <YStack gap="$2">
          <Field label="Target namespace">
            {nsOptions.length > 0 ? (
              <XStack gap="$1.5" flexWrap="wrap">
                {nsOptions.map((n) => (
                  <Button
                    key={n}
                    size="$2"
                    onPress={() => onChange({ ...value, namespace: n })}
                    bg={value.namespace === n ? ('#f2f2f2' as never) : 'transparent'}
                    borderWidth={1}
                    borderColor={value.namespace === n ? ('#f2f2f2' as never) : '$borderColor'}
                  >
                    <Text fontSize="$1" color={value.namespace === n ? ('#070b13' as never) : '$color'}>
                      {n}
                    </Text>
                  </Button>
                ))}
              </XStack>
            ) : (
              <Input
                value={value.namespace}
                onChangeText={(t: string) => onChange({ ...value, namespace: t })}
                placeholder="namespace"
              />
            )}
          </Field>
          <Field label="Task queue">
            <Input
              value={value.taskQueue}
              onChangeText={(t: string) => onChange({ ...value, taskQueue: t })}
              placeholder="task-queue-name"
            />
          </Field>
          <Field label="Service">
            <Input
              value={value.service}
              onChangeText={(t: string) => onChange({ ...value, service: t })}
              placeholder="service.name"
            />
          </Field>
        </YStack>
      ) : (
        <YStack gap="$2">
          <Field label="URL">
            <Input
              value={value.url}
              onChangeText={(t: string) => onChange({ ...value, url: t })}
              placeholder="https://example.com/nexus"
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            />
          </Field>
          <YStack gap="$1.5">
            <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
              Auth headers
            </Text>
            {value.headers.map((h, i) => (
              <XStack key={i} gap="$2" items="center">
                <Input
                  value={h.key}
                  onChangeText={(t: string) => {
                    const next = value.headers.slice()
                    next[i] = { ...h, key: t }
                    onChange({ ...value, headers: next })
                  }}
                  placeholder="Authorization"
                  flex={1}
                />
                <Input
                  value={h.value}
                  onChangeText={(t: string) => {
                    const next = value.headers.slice()
                    next[i] = { ...h, value: t }
                    onChange({ ...value, headers: next })
                  }}
                  placeholder="Bearer ..."
                  flex={2}
                  fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                />
                <Button
                  size="$2"
                  chromeless
                  onPress={() => {
                    const next = value.headers.slice()
                    next.splice(i, 1)
                    onChange({ ...value, headers: next })
                  }}
                >
                  <Trash2 size={12} color="#7e8794" />
                </Button>
              </XStack>
            ))}
            <Button
              size="$2"
              chromeless
              onPress={() => onChange({ ...value, headers: [...value.headers, { key: '', value: '' }] })}
            >
              <XStack items="center" gap="$1.5">
                <Plus size={12} color="#7e8794" />
                <Text fontSize="$1" color="$placeholderColor">
                  Add header
                </Text>
              </XStack>
            </Button>
          </YStack>
        </YStack>
      )}
    </YStack>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$1">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
        {label}
      </Text>
      {children}
    </YStack>
  )
}

function Tab({
  active,
  onPress,
  children,
}: {
  active: boolean
  onPress: () => void
  children: React.ReactNode
}) {
  return (
    <Button
      size="$2"
      onPress={onPress}
      bg={active ? ('#f2f2f2' as never) : 'transparent'}
      borderWidth={1}
      borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
    >
      <Text fontSize="$2" color={active ? ('#070b13' as never) : '$color'}>
        {children}
      </Text>
    </Button>
  )
}
