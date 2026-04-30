// VersionRowDetails — expanded row body for a deployment version. Lazy-loads
// the version describe payload (compute + env + image) and renders
// VersionComputeDetails. Shows a skeleton while loading and a retry button
// on error.

import { Button, Spinner, Text, XStack, YStack } from 'hanzogui'
import { useFetch } from '@hanzogui/admin'
import { Deployments } from '../../lib/api'
import { VersionComputeDetails, type VersionSpec } from './VersionComputeDetails'

export interface VersionDetailResponse {
  buildId: string
  spec?: VersionSpec
  workerDeploymentVersionInfo?: { computeConfig?: VersionSpec; spec?: VersionSpec }
}

export function VersionRowDetails({
  namespace,
  deploymentName,
  buildId,
}: {
  namespace: string
  deploymentName: string
  buildId: string
}) {
  const url = Deployments.versionDescribeUrl(namespace, deploymentName, buildId)
  const { data, error, isLoading, mutate } = useFetch<VersionDetailResponse>(url)

  if (isLoading) {
    return (
      <XStack gap="$2" items="center" py="$2">
        <Spinner size="small" />
        <Text fontSize="$1" color="$placeholderColor">
          loading version details…
        </Text>
      </XStack>
    )
  }

  if (error) {
    const msg = error instanceof Error ? error.message : String(error)
    return (
      <XStack gap="$2" items="center" py="$2">
        <Text fontSize="$1" color={'#fca5a5' as never}>
          {msg}
        </Text>
        <Button size="$1" chromeless onPress={() => void mutate()}>
          <Text fontSize="$1" color={'#86efac' as never}>
            retry
          </Text>
        </Button>
      </XStack>
    )
  }

  const spec =
    data?.spec ??
    data?.workerDeploymentVersionInfo?.spec ??
    data?.workerDeploymentVersionInfo?.computeConfig
  if (!spec) {
    return (
      <YStack py="$2">
        <Text fontSize="$1" color="$placeholderColor">
          No spec recorded for this version.
        </Text>
      </YStack>
    )
  }
  return <VersionComputeDetails spec={spec} />
}
