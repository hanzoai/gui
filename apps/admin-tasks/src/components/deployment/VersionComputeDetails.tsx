// VersionComputeDetails — render the full compute requirement block for a
// deployment version. Shows provider, image reference, env vars, and
// scaler params if present.

import { Text, XStack, YStack } from 'hanzogui'
import type { ComputeSpec } from './ComputeBadge'

export interface VersionSpec {
  compute?: ComputeSpec | null
  image?: string
  env?: Record<string, string> | Array<{ name: string; value: string }>
  region?: string
  scaler?: {
    scaleUpCooloffMs?: number
    scaleUpBacklogThreshold?: number
    maxWorkerLifetimeMs?: number
    metricsPollIntervalMs?: number
  }
  description?: string
}

const MONO = 'ui-monospace, SFMono-Regular, monospace'

function envEntries(
  env?: Record<string, string> | Array<{ name: string; value: string }>,
): Array<[string, string]> {
  if (!env) return []
  if (Array.isArray(env)) return env.map((e) => [e.name, e.value])
  return Object.entries(env)
}

export function VersionComputeDetails({ spec }: { spec?: VersionSpec | null }) {
  if (!spec) return null
  const envs = envEntries(spec.env)
  const hasScaler =
    spec.scaler &&
    (spec.scaler.scaleUpCooloffMs !== undefined ||
      spec.scaler.scaleUpBacklogThreshold !== undefined ||
      spec.scaler.maxWorkerLifetimeMs !== undefined ||
      spec.scaler.metricsPollIntervalMs !== undefined)

  return (
    <YStack
      gap="$2"
      p="$3"
      bg={'rgba(255,255,255,0.02)' as never}
      borderColor="$borderColor"
      borderWidth={1}
      rounded="$2"
    >
      {spec.description ? (
        <Field label="Description" value={spec.description} />
      ) : null}
      {spec.image ? <Field label="Image" value={spec.image} mono /> : null}
      {spec.region ? <Field label="Region" value={spec.region} /> : null}
      {spec.compute?.cpu !== undefined ? (
        <Field label="CPU" value={String(spec.compute.cpu)} />
      ) : null}
      {spec.compute?.memory !== undefined ? (
        <Field label="Memory" value={String(spec.compute.memory)} />
      ) : null}
      {spec.compute?.gpu !== undefined && Number(spec.compute.gpu) > 0 ? (
        <Field label="GPU" value={String(spec.compute.gpu)} />
      ) : null}

      {envs.length > 0 ? (
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
            Environment ({envs.length})
          </Text>
          <YStack gap="$1">
            {envs.map(([k, v]) => (
              <XStack key={k} gap="$2" items="center">
                <Text
                  fontFamily={MONO as never}
                  fontSize="$1"
                  color={'#86efac' as never}
                  numberOfLines={1}
                >
                  {k}
                </Text>
                <Text fontSize="$1" color="$placeholderColor">
                  =
                </Text>
                <Text
                  fontFamily={MONO as never}
                  fontSize="$1"
                  color="$color"
                  numberOfLines={1}
                >
                  {v}
                </Text>
              </XStack>
            ))}
          </YStack>
        </YStack>
      ) : null}

      {hasScaler ? (
        <YStack gap="$1">
          <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
            Scaler
          </Text>
          <XStack gap="$3" flexWrap="wrap">
            {spec.scaler!.scaleUpCooloffMs !== undefined ? (
              <Field label="Scale-up cooloff" value={`${spec.scaler!.scaleUpCooloffMs}ms`} />
            ) : null}
            {spec.scaler!.scaleUpBacklogThreshold !== undefined ? (
              <Field label="Backlog threshold" value={String(spec.scaler!.scaleUpBacklogThreshold)} />
            ) : null}
            {spec.scaler!.maxWorkerLifetimeMs !== undefined ? (
              <Field label="Max worker lifetime" value={`${spec.scaler!.maxWorkerLifetimeMs}ms`} />
            ) : null}
            {spec.scaler!.metricsPollIntervalMs !== undefined ? (
              <Field label="Metrics poll" value={`${spec.scaler!.metricsPollIntervalMs}ms`} />
            ) : null}
          </XStack>
        </YStack>
      ) : null}
    </YStack>
  )
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <XStack gap="$2" items="center">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
        {label}
      </Text>
      <Text
        fontSize="$1"
        color="$color"
        fontFamily={(mono ? MONO : undefined) as never}
        numberOfLines={1}
      >
        {value}
      </Text>
    </XStack>
  )
}
