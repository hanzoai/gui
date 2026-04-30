// VersionForm — shared form for create/edit of a single deployment
// version. Build id is immutable on edit.

import { Button, Card, H4, Input, Text, XStack, YStack } from 'hanzogui'

export interface EnvRow {
  name: string
  value: string
}

export interface VersionFormState {
  buildId: string
  description: string
  image: string
  region: string
  computeType: string
  cpu: string
  memory: string
  gpu: string
  env: EnvRow[]
}

export const EMPTY_VERSION_FORM: VersionFormState = {
  buildId: '',
  description: '',
  image: '',
  region: '',
  computeType: 'k8s',
  cpu: '1',
  memory: '1Gi',
  gpu: '0',
  env: [],
}

export interface VersionFormProps {
  value: VersionFormState
  onChange: (next: VersionFormState) => void
  buildIdLocked?: boolean
}

export function VersionForm({ value, onChange, buildIdLocked }: VersionFormProps) {
  const set = <K extends keyof VersionFormState>(k: K, v: VersionFormState[K]) =>
    onChange({ ...value, [k]: v })

  const addEnv = () => set('env', [...value.env, { name: '', value: '' }])
  const removeEnv = (i: number) =>
    set(
      'env',
      value.env.filter((_, idx) => idx !== i),
    )
  const updateEnv = (i: number, patch: Partial<EnvRow>) => {
    const next = value.env.slice()
    next[i] = { ...next[i], ...patch }
    set('env', next)
  }

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$4">
        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Build ID
          </H4>
          <Input
            value={value.buildId}
            onChangeText={(t: string) => set('buildId', t)}
            placeholder="v1.2.3 or sha256:…"
            disabled={buildIdLocked}
            maxLength={200}
          />
          <Text fontSize="$1" color="$placeholderColor">
            Workers report this on connect; must match exactly.{' '}
            {buildIdLocked ? 'Immutable after create.' : null}
          </Text>
        </YStack>

        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Description
          </H4>
          <Input
            value={value.description}
            onChangeText={(t: string) => set('description', t)}
            placeholder="Release notes or change summary"
          />
        </YStack>

        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Image reference
          </H4>
          <Input
            value={value.image}
            onChangeText={(t: string) => set('image', t)}
            placeholder="ghcr.io/hanzoai/worker:1.2.3"
          />
        </YStack>

        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Compute
          </H4>
          <XStack gap="$2" flexWrap="wrap">
            <Field label="Provider">
              <Input
                value={value.computeType}
                onChangeText={(t: string) => set('computeType', t)}
                width={140}
              />
            </Field>
            <Field label="CPU">
              <Input
                value={value.cpu}
                onChangeText={(t: string) => set('cpu', t)}
                width={100}
              />
            </Field>
            <Field label="Memory">
              <Input
                value={value.memory}
                onChangeText={(t: string) => set('memory', t)}
                width={100}
              />
            </Field>
            <Field label="GPU">
              <Input
                value={value.gpu}
                onChangeText={(t: string) => set('gpu', t)}
                width={80}
              />
            </Field>
            <Field label="Region">
              <Input
                value={value.region}
                onChangeText={(t: string) => set('region', t)}
                width={140}
              />
            </Field>
          </XStack>
        </YStack>

        <YStack gap="$2">
          <XStack items="center" justify="space-between">
            <H4 size="$3" color="$color">
              Environment ({value.env.length})
            </H4>
            <Button size="$2" chromeless onPress={addEnv}>
              <Text fontSize="$1" color={'#86efac' as never}>
                + Add
              </Text>
            </Button>
          </XStack>
          {value.env.length === 0 ? (
            <Text fontSize="$1" color="$placeholderColor">
              No environment variables.
            </Text>
          ) : (
            <YStack gap="$1">
              {value.env.map((row, i) => (
                <XStack key={i} gap="$2" items="center">
                  <Input
                    value={row.name}
                    onChangeText={(t: string) => updateEnv(i, { name: t })}
                    placeholder="KEY"
                    flex={1}
                  />
                  <Text fontSize="$1" color="$placeholderColor">
                    =
                  </Text>
                  <Input
                    value={row.value}
                    onChangeText={(t: string) => updateEnv(i, { value: t })}
                    placeholder="value"
                    flex={2}
                  />
                  <Button
                    size="$2"
                    chromeless
                    onPress={() => removeEnv(i)}
                    aria-label={`Remove ${row.name || 'row'}`}
                  >
                    <Text fontSize="$1" color={'#fca5a5' as never}>
                      ✕
                    </Text>
                  </Button>
                </XStack>
              ))}
            </YStack>
          )}
        </YStack>
      </YStack>
    </Card>
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

// Helpers for callers — convert env array to/from the wire-shape map.
export function envRowsToMap(rows: EnvRow[]): Record<string, string> {
  const m: Record<string, string> = {}
  for (const r of rows) {
    if (r.name.trim()) m[r.name.trim()] = r.value
  }
  return m
}

export function envMapToRows(m?: Record<string, string> | null): EnvRow[] {
  if (!m) return []
  return Object.entries(m).map(([name, value]) => ({ name, value }))
}
