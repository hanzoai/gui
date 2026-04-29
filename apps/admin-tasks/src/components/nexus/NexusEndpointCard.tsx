// NexusEndpointCard — one row in the endpoint list. Shows name,
// description, target type/url and the count of allowed callers.
// Click navigates to the endpoint's detail page.

import { Link } from 'react-router-dom'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { Globe } from '@hanzogui/lucide-icons-2/icons/Globe'
import { Network } from '@hanzogui/lucide-icons-2/icons/Network'
import { Badge } from '@hanzogui/admin'
import type { NexusEndpoint } from '../../lib/api'
import { parseTarget } from './NexusTargetEditor'

export interface NexusEndpointCardProps {
  endpoint: NexusEndpoint
  detailHref: string
}

export function NexusEndpointCard({ endpoint, detailHref }: NexusEndpointCardProps) {
  const target = parseTarget(endpoint.target ?? '')
  const callers = endpoint.allowedCallerNamespaces ?? []
  const desc = endpoint.descriptionString ?? endpoint.description ?? ''

  return (
    <Link to={detailHref} style={{ textDecoration: 'none', color: 'inherit' }}>
      <Card
        p="$3"
        bg="$background"
        borderColor="$borderColor"
        borderWidth={1}
        hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
      >
        <XStack items="center" gap="$3">
          {target.kind === 'worker' ? (
            <Network size={16} color="#7e8794" />
          ) : (
            <Globe size={16} color="#7e8794" />
          )}
          <YStack flex={1} minW={0} gap="$0.5">
            <XStack items="center" gap="$2">
              <Text fontSize="$3" fontWeight="500" color="$color" numberOfLines={1}>
                {endpoint.name}
              </Text>
              <Badge variant={target.kind === 'worker' ? 'info' : 'default'}>{target.kind}</Badge>
            </XStack>
            {desc ? (
              <Text fontSize="$1" color="$placeholderColor" numberOfLines={1}>
                {desc}
              </Text>
            ) : null}
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$1"
              color="$placeholderColor"
              numberOfLines={1}
            >
              {target.kind === 'worker'
                ? `${target.namespace}/${target.taskQueue}${target.service ? ` · ${target.service}` : ''}`
                : target.url}
            </Text>
          </YStack>
          <Text fontSize="$1" color="$placeholderColor">
            {callers.length} {callers.length === 1 ? 'caller' : 'callers'}
          </Text>
        </XStack>
      </Card>
    </Link>
  )
}
