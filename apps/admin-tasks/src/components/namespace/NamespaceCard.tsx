// NamespaceCard — tile for the SelectNamespace landing page. Big
// click target, name + state, retention + archival summary.

import { Link } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import { Badge, humanTTL } from '@hanzogui/admin'
import type { Namespace } from '../../lib/api'

export interface NamespaceCardProps {
  ns: Namespace
  hrefFor?: (id: string) => string
  onSelect?: (id: string) => void
}

export function NamespaceCard({ ns, hrefFor, onSelect }: NamespaceCardProps) {
  const name = ns.namespaceInfo.name
  const stateRaw = ns.namespaceInfo.state ?? ''
  const active = stateRaw === 'NAMESPACE_STATE_REGISTERED' || stateRaw === 'Registered'
  const state = stateRaw.replace(/^NAMESPACE_STATE_/, '').toLowerCase() || 'unknown'
  const archEnabled =
    ns.config?.historyArchivalState === 'ARCHIVAL_STATE_ENABLED' ||
    ns.config?.historyArchivalState === 'Enabled'
  const href = hrefFor ? hrefFor(name) : `/namespaces/${encodeURIComponent(name)}`

  const body = (
    <Card
      p="$4"
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      hoverStyle={{ borderColor: '$color' as never }}
      cursor="pointer"
      flexBasis={280}
      flexGrow={1}
      maxW={420}
      onPress={() => onSelect?.(name)}
    >
      <YStack gap="$2.5">
        <XStack items="center" gap="$2" justify="space-between">
          <Text fontSize="$5" fontWeight="600" color="$color" numberOfLines={1}>
            {name}
          </Text>
          <ChevronRight size={16} color="#7e8794" />
        </XStack>
        <XStack gap="$2" items="center" flexWrap="wrap">
          <Badge variant={active ? 'success' : 'muted'}>{state}</Badge>
          <Badge variant={archEnabled ? 'success' : 'muted'}>
            archive {archEnabled ? 'on' : 'off'}
          </Badge>
        </XStack>
        {ns.namespaceInfo.description ? (
          <Text fontSize="$2" color="$placeholderColor" numberOfLines={2}>
            {ns.namespaceInfo.description}
          </Text>
        ) : null}
        <XStack gap="$3" items="center">
          <Text fontSize="$1" color="$placeholderColor">
            retention {humanTTL(ns.config?.workflowExecutionRetentionTtl)}
          </Text>
          {ns.namespaceInfo.ownerEmail ? (
            <Text fontSize="$1" color="$placeholderColor" numberOfLines={1}>
              · {ns.namespaceInfo.ownerEmail}
            </Text>
          ) : null}
        </XStack>
      </YStack>
    </Card>
  )

  if (onSelect) return body
  return (
    <Link to={href} style={{ textDecoration: 'none', color: 'inherit' }}>
      {body}
    </Link>
  )
}
