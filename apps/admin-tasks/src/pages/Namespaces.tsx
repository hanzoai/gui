// Namespaces list — card per namespace with state pill, retention,
// archival flags, owner email; clicking opens the detail page.

import { useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Card, H2, Text, XStack, YStack } from 'hanzogui'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Badge, Empty, ErrorState, LoadingState, humanTTL, useFetch } from '@hanzogui/admin'
import type { Namespace } from '../lib/api'
import { Namespaces } from '../lib/api'
import { useTaskEvents } from '../lib/events'

export function NamespacesPage() {
  const url = Namespaces.listUrl(200)
  const { data, error, isLoading, mutate } = useFetch<{ namespaces: Namespace[] }>(url)

  const onEvent = useCallback(() => {
    void mutate()
  }, [mutate])

  useTaskEvents(undefined, onEvent, ['namespace.registered'])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const nss = data?.namespaces ?? []
  if (nss.length === 0) {
    return <Empty title="No namespaces" hint="Create one with the SDK or hanzo-tasks CLI." />
  }

  return (
    <YStack gap="$4">
      <XStack items="baseline" justify="space-between">
        <H2 size="$7" color="$color">
          Namespaces{' '}
          <Text fontSize="$3" color="$placeholderColor" fontWeight="400">
            ({nss.length})
          </Text>
        </H2>
      </XStack>
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        {nss.map((ns, i) => (
          <NamespaceRow key={ns.namespaceInfo.name} ns={ns} first={i === 0} />
        ))}
      </Card>
    </YStack>
  )
}

function NamespaceRow({ ns, first }: { ns: Namespace; first: boolean }) {
  const name = ns.namespaceInfo.name
  const stateRaw = ns.namespaceInfo.state ?? ''
  const active = stateRaw === 'NAMESPACE_STATE_REGISTERED' || stateRaw === 'Registered'
  const state = stateRaw.replace(/^NAMESPACE_STATE_/, '').toLowerCase() || 'unknown'
  const histArch =
    ns.config?.historyArchivalState === 'ARCHIVAL_STATE_ENABLED' ||
    ns.config?.historyArchivalState === 'Enabled'
  const visArch =
    ns.config?.visibilityArchivalState === 'ARCHIVAL_STATE_ENABLED' ||
    ns.config?.visibilityArchivalState === 'Enabled'
  return (
    <Link
      to={`/namespaces/${encodeURIComponent(name)}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <XStack
        items="center"
        gap="$4"
        px="$5"
        py="$3.5"
        borderTopWidth={first ? 0 : 1}
        borderTopColor="$borderColor"
        hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
      >
        <YStack flex={2} gap="$1">
          <XStack items="center" gap="$2">
            <Text fontSize="$3" fontWeight="500" color="$color">
              {name}
            </Text>
            <Badge variant={active ? 'success' : 'muted'}>{state}</Badge>
          </XStack>
          {ns.namespaceInfo.description ? (
            <Text fontSize="$2" color="$placeholderColor" numberOfLines={1}>
              {ns.namespaceInfo.description}
            </Text>
          ) : null}
        </YStack>
        <YStack flex={1} gap="$1" minW={140}>
          <Text fontSize="$1" color="$placeholderColor">
            Retention
          </Text>
          <Text fontSize="$2" color="$color">
            {humanTTL(ns.config?.workflowExecutionRetentionTtl)}
          </Text>
        </YStack>
        <YStack flex={1} gap="$1" minW={140}>
          <Text fontSize="$1" color="$placeholderColor">
            Archival
          </Text>
          <XStack gap="$1">
            <Badge variant={histArch ? 'success' : 'muted'}>hist {histArch ? 'on' : 'off'}</Badge>
            <Badge variant={visArch ? 'success' : 'muted'}>vis {visArch ? 'on' : 'off'}</Badge>
          </XStack>
        </YStack>
        <YStack flex={1} gap="$1" minW={160}>
          <Text fontSize="$1" color="$placeholderColor">
            Owner
          </Text>
          <Text fontSize="$2" color="$color" numberOfLines={1}>
            {ns.namespaceInfo.ownerEmail || '—'}
          </Text>
        </YStack>
        <ChevronRight size={16} color="#7e8794" />
      </XStack>
    </Link>
  )
}
