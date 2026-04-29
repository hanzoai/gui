// WorkerDetail — sticky header (identity + version) and sections for
// task queues, current pollers, and capabilities. Backend may 501 the
// describe endpoint until the worker SDK runtime ships; in that case
// we render a skeleton header from the URL identity.

import { Link, useParams } from 'react-router-dom'
import { Card, H1, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import {
  Alert,
  Badge,
  Empty,
  ErrorState,
  LoadingState,
  formatTimestamp,
  useFetch,
} from '@hanzogui/admin'
import { Workers, type Worker } from '../lib/api'

interface WorkerDescribeResp {
  worker?: Worker
  taskQueues?: string[]
  polled?: Worker[]
  capabilities?: string[]
}

export function WorkerDetailPage() {
  const { ns, identity } = useParams()
  const namespace = ns!
  const id = decodeURIComponent(identity!)
  const { data, error, isLoading } = useFetch<WorkerDescribeResp>(Workers.describeUrl(namespace, id))

  if (error && (error as { status?: number }).status !== 501) {
    return <ErrorState error={error as Error} />
  }
  if (isLoading) return <LoadingState />

  const worker = data?.worker
  const queues = data?.taskQueues ?? (worker?.taskQueue ? [worker.taskQueue] : [])
  const polled = data?.polled ?? []
  const capabilities = data?.capabilities ?? []
  const stub = !data || (!worker && polled.length === 0)

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/workers`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">workers</Text>
        </XStack>
      </Link>

      <YStack
        gap="$2"
        bg="$background"
        py="$2"
        style={{ position: 'sticky', top: 0, zIndex: 5 }}
      >
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          WORKER
        </Text>
        <XStack items="center" gap="$3" flexWrap="wrap">
          <H1
            size="$7"
            color="$color"
            fontWeight="600"
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          >
            {id}
          </H1>
          {worker?.buildId ? (
            <Badge variant="info">build {worker.buildId}</Badge>
          ) : null}
          {worker?.pollerKind ? <Badge variant="muted">{worker.pollerKind}</Badge> : null}
        </XStack>
        {worker?.lastAccessTime ? (
          <Text fontSize="$1" color="$placeholderColor">
            last poll {formatTimestamp(new Date(worker.lastAccessTime))}
          </Text>
        ) : null}
      </YStack>

      {stub ? (
        <Alert title="Worker describe not yet wired">
          Per-worker describe lands with the worker SDK runtime (pkg/sdk/worker). The
          identity above comes from the URL; live build ID, capabilities, and per-queue
          attachment will populate once heartbeats are recorded.
        </Alert>
      ) : null}

      <Section title={`Task queues (${queues.length})`}>
        {queues.length === 0 ? (
          <Empty title="No task queue attachment" hint="Workers list the queues they poll on connect." />
        ) : (
          <YStack gap="$2">
            {queues.map((q) => (
              <Link
                key={q}
                to={`/namespaces/${encodeURIComponent(namespace)}/task-queues/${encodeURIComponent(q)}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  p="$3"
                  bg="$background"
                  borderColor="$borderColor"
                  borderWidth={1}
                  hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                >
                  <XStack items="center" gap="$2">
                    <Layers size={14} color="#86efac" />
                    <Text fontSize="$2" color={'#86efac' as never}>{q}</Text>
                  </XStack>
                </Card>
              </Link>
            ))}
          </YStack>
        )}
      </Section>

      <Section title={`Polled (${polled.length})`}>
        {polled.length === 0 ? (
          <Empty title="No active poll observed" hint="Heartbeats appear here when the worker is online." />
        ) : (
          <YStack gap="$2">
            {polled.map((p, i) => (
              <Card
                key={`${p.identity}-${i}`}
                p="$3"
                bg="$background"
                borderColor="$borderColor"
                borderWidth={1}
              >
                <XStack items="center" justify="space-between" gap="$2">
                  <Text
                    fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                    fontSize="$2"
                    color="$color"
                    numberOfLines={1}
                  >
                    {p.taskQueue ?? p.identity}
                  </Text>
                  <Text fontSize="$1" color="$placeholderColor">
                    {p.lastAccessTime ? formatTimestamp(new Date(p.lastAccessTime)) : '—'}
                  </Text>
                </XStack>
              </Card>
            ))}
          </YStack>
        )}
      </Section>

      <Section title={`Capabilities (${capabilities.length})`}>
        {capabilities.length === 0 ? (
          <Empty title="No capabilities reported" hint="Capabilities surface SDK features the worker advertised." />
        ) : (
          <XStack flexWrap="wrap" gap="$2">
            {capabilities.map((c) => (
              <Badge key={c} variant="muted">{c}</Badge>
            ))}
          </XStack>
        )}
      </Section>
    </YStack>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2">
      <H3 size="$5" color="$color" fontWeight="500">{title}</H3>
      {children}
    </YStack>
  )
}
