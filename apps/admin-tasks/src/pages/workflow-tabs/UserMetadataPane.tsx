// User metadata pane — workflow-level summary + details strings the
// caller can supply on Start. The native engine doesn't yet capture
// these (no proto path for it), so we show an honest empty state with
// a forward-pointing hint.

import { Card, Text, YStack } from 'hanzogui'
import { Alert, Empty } from '@hanzogui/admin'
import type { WorkflowExecution } from '../../lib/api'

export function UserMetadataPane({ wf }: { wf: WorkflowExecution }) {
  const md = wf.userMetadata
  const hasSummary = !!md?.summary
  const hasDetails = !!md?.details

  if (!hasSummary && !hasDetails) {
    return (
      <YStack gap="$3">
        <Alert title="User metadata not yet captured">
          The Start opcode will accept a summary and details payload once the
          worker SDK lands UserMetadata support. Until then this surface stays
          empty rather than echoing fabricated text.
        </Alert>
        <Empty
          title="No user metadata"
          hint="Workers can attach a short summary and a longer details blob when starting a workflow. They appear here verbatim once the SDK records them."
        />
      </YStack>
    )
  }

  return (
    <YStack gap="$3">
      {hasSummary ? (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <YStack gap="$1.5">
            <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
              SUMMARY
            </Text>
            <Text fontSize="$3" color="$color">
              {md!.summary}
            </Text>
          </YStack>
        </Card>
      ) : null}
      {hasDetails ? (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <YStack gap="$1.5">
            <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
              DETAILS
            </Text>
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$2"
              color="$color"
            >
              {md!.details}
            </Text>
          </YStack>
        </Card>
      ) : null}
    </YStack>
  )
}
