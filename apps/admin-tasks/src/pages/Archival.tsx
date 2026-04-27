// Archival — explains the retention model for closed workflows. The
// engine retains workflow history for the namespace's
// workflowExecutionRetentionTtl window, then drops it. There is no
// separate cold store yet; this page keeps that promise honest rather
// than implying a scrollable archive that does not exist.

import { H2, XStack, YStack } from 'hanzogui'
import { Alert, Empty } from '@hanzogui/admin'

export function ArchivalPage() {
  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Archive
        </H2>
      </XStack>

      <Alert title="Long-term archival not yet wired">
        The native engine retains closed workflow history for the namespace's
        workflowExecutionRetentionTtl window (default 720h), then drops it.
        Cold-storage archival to S3 / Postgres is on the roadmap once the
        worker SDK runtime stabilises — until then there is no separate
        archive to browse.
      </Alert>

      <Empty
        title="No archived workflows"
        hint="Workflows still inside their retention window are visible on the namespace's Workflows page. Anything outside that window is gone for good in the embedded build."
      />
    </YStack>
  )
}
