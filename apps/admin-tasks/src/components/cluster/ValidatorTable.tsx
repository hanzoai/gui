// ValidatorTable — id, addr, role, health pill. Health is derived
// from the wire `health` field plus the node's lag vs leader: a
// reported "healthy" but laggy (>500ms) follower is downgraded to
// the laggy yellow state so the operator sees the warning before
// the node fails out of quorum.

import { Card, H4, Text, XStack, YStack } from 'hanzogui'
import { Badge } from '@hanzogui/admin'
import type { Validator } from '../../lib/api'

export interface ValidatorTableProps {
  validators: Validator[]
  // Worst-case lag against the leader. Used by `effectiveHealth`
  // to downgrade a "healthy" follower that is still catching up.
  lagThresholdMs?: number
}

export type EffectiveHealth = 'healthy' | 'laggy' | 'failed' | 'unknown'

// Predicate exported separately so unit tests can assert without
// rendering the full table component (avoids the hanzogui provider
// chain that would otherwise need a test-mode shim).
export function effectiveHealth(v: Validator, lagThresholdMs = 500): EffectiveHealth {
  if (v.health === 'failed') return 'failed'
  if (v.health === 'laggy') return 'laggy'
  if (v.health === 'healthy') {
    if (typeof v.replicationLagMs === 'number' && v.replicationLagMs > lagThresholdMs) return 'laggy'
    return 'healthy'
  }
  return 'unknown'
}

const VARIANT_FOR: Record<EffectiveHealth, 'success' | 'destructive' | 'warning' | 'muted'> = {
  healthy: 'success',
  laggy: 'warning',
  failed: 'destructive',
  unknown: 'muted',
}

const DOT_COLOR: Record<EffectiveHealth, string> = {
  healthy: '#22c55e',
  laggy: '#eab308',
  failed: '#ef4444',
  unknown: '#7e8794',
}

export function ValidatorTable({ validators, lagThresholdMs = 500 }: ValidatorTableProps) {
  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <H4 flex={2} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Node
        </H4>
        <H4 flex={3} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Address
        </H4>
        <H4 flex={1} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Role
        </H4>
        <H4 flex={1} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Health
        </H4>
        <H4 width={110} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Lag
        </H4>
      </XStack>
      {validators.map((v, i) => {
        const eff = effectiveHealth(v, lagThresholdMs)
        return (
          <XStack
            key={v.id}
            px="$4"
            py="$2.5"
            borderTopWidth={i === 0 ? 0 : 1}
            borderTopColor="$borderColor"
            items="center"
          >
            <YStack flex={2}>
              <XStack items="center" gap="$2">
                <YStack
                  width={8}
                  height={8}
                  rounded="$10"
                  bg={DOT_COLOR[eff] as never}
                  aria-label={`health-${eff}`}
                  data-testid={`validator-dot-${v.id}`}
                />
                <Text fontSize="$2" color="$color" numberOfLines={1}>
                  {v.id}
                </Text>
              </XStack>
            </YStack>
            <Text flex={3} fontSize="$2" color="$placeholderColor" numberOfLines={1}>
              {v.addr}
            </Text>
            <YStack flex={1}>
              <Badge variant={(v.role === 'leader' ? 'accent' : 'muted') as never}>{v.role}</Badge>
            </YStack>
            <YStack flex={1}>
              <Badge variant={VARIANT_FOR[eff] as never}>{eff}</Badge>
            </YStack>
            <Text width={110} fontSize="$2" color="$placeholderColor">
              {typeof v.replicationLagMs === 'number' ? `${Math.round(v.replicationLagMs)}ms` : '—'}
            </Text>
          </XStack>
        )
      })}
    </Card>
  )
}
