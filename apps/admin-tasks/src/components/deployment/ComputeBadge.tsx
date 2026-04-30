// ComputeBadge — pill rendering a compute provider (aws-lambda, gcp-cloud-run,
// k8s, etc.) with optional CPU/memory/GPU summary. Renders an em-dash when the
// compute spec is absent, matching the upstream Svelte component.

import { Text, XStack } from 'hanzogui'

export interface ComputeSpec {
  type?: string
  cpu?: string | number
  memory?: string | number
  gpu?: string | number
  region?: string
}

const PROVIDER_LABEL: Record<string, string> = {
  'aws-lambda': 'Lambda',
  'gcp-cloud-run': 'Cloud Run',
  k8s: 'Kubernetes',
  docker: 'Docker',
  serverless: 'Serverless',
}

export function ComputeBadge({ spec }: { spec?: ComputeSpec | null }) {
  if (!spec || !spec.type) {
    return (
      <Text fontSize="$2" color="$placeholderColor">
        —
      </Text>
    )
  }
  const label = PROVIDER_LABEL[spec.type] ?? spec.type
  return (
    <XStack
      items="center"
      gap="$1"
      px="$2"
      py="$1"
      borderWidth={1}
      borderColor="$borderColor"
      rounded="$2"
      bg={'rgba(255,255,255,0.03)' as never}
    >
      <Text fontSize="$1" color="$color" fontWeight="500">
        {label}
      </Text>
      {spec.cpu !== undefined ? (
        <Text fontSize="$1" color="$placeholderColor">
          · {spec.cpu} CPU
        </Text>
      ) : null}
      {spec.memory !== undefined ? (
        <Text fontSize="$1" color="$placeholderColor">
          · {spec.memory}
        </Text>
      ) : null}
      {spec.gpu !== undefined && Number(spec.gpu) > 0 ? (
        <Text fontSize="$1" color={'#86efac' as never}>
          · {spec.gpu} GPU
        </Text>
      ) : null}
    </XStack>
  )
}
