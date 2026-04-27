// Workers tab pane — workers polling this workflow's task queue.
// Engine doesn't yet expose worker heartbeats (worker SDK runtime is
// the next phase), so this pane shows an honest empty state with a
// link to the namespace-level Workers page.

import { Link } from 'react-router-dom'
import { Text, XStack, YStack } from 'hanzogui'
import { ListChecks } from '@hanzogui/lucide-icons-2/icons/ListChecks'
import { Alert, Empty } from '@hanzogui/admin'

export function WorkersPane({
  ns,
  taskQueue,
}: {
  ns: string
  taskQueue?: string
}) {
  return (
    <YStack gap="$3">
      <Alert title="Worker registration not yet wired">
        Worker heartbeats land with the worker SDK runtime (pkg/sdk/worker).
        Until then this surface stays empty rather than inventing fake polling
        data.
      </Alert>

      <Empty
        title={taskQueue ? `No workers polling ${taskQueue}` : 'No workers'}
        hint="Once a worker registers, its identity, build ID, and last-heartbeat will appear here."
        action={
          <Link
            to={`/namespaces/${encodeURIComponent(ns)}/workers`}
            style={{ textDecoration: 'none' }}
          >
            <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
              <ListChecks size={14} color="#86efac" />
              <Text fontSize="$2" color={'#86efac' as never}>
                Open namespace workers
              </Text>
            </XStack>
          </Link>
        }
      />
    </YStack>
  )
}
