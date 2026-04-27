// Activities — namespace-level activity inspector. The native engine
// does not yet record activity rows (worker SDK runtime ships next),
// so the page is a faithful empty state instead of a fabricated table.

import { useParams } from 'react-router-dom'
import { H2, Text, XStack, YStack } from 'hanzogui'
import { Alert, Empty } from '@hanzo/admin'

export function ActivitiesPage() {
  const { ns } = useParams()
  const namespace = ns!

  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Activities{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            (0)
          </Text>
        </H2>
      </XStack>

      <Alert title="Activity inspector not yet wired">
        Activity tracking lands when the worker SDK runtime ships
        (pkg/sdk/worker). Until then, the engine carries no activity rows —
        this surface stays empty rather than echo fake polling data.
      </Alert>

      <Empty
        title={`No activities in ${namespace}`}
        hint="Once workers register and start polling, every activity scheduled by a workflow in this namespace will appear here with type, attempt count, and last failure."
      />
    </YStack>
  )
}
