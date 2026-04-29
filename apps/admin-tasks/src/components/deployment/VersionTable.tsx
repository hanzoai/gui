// VersionTable — build IDs registered against one deployment series.
// "Set current" button per row when the row is not already current.

import { Button, Card, Text, XStack, YStack } from 'hanzogui'
import { Badge, formatTimestamp } from '@hanzogui/admin'
import type { BuildIdEntry } from '../../lib/types'

export interface VersionTableProps {
  buildIds: BuildIdEntry[]
  defaultBuildId: string
  onSetCurrent: (buildId: string) => void
  busy?: boolean
}

export function VersionTable({ buildIds, defaultBuildId, onSetCurrent, busy }: VersionTableProps) {
  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2.5"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <HeaderCell flex={3}>Build ID</HeaderCell>
        <HeaderCell flex={1}>State</HeaderCell>
        <HeaderCell flex={2}>Created</HeaderCell>
        <HeaderCell flex={1}>Actions</HeaderCell>
      </XStack>
      {buildIds.map((b, i) => {
        const isCurrent = b.buildId === defaultBuildId
        const state = String(b.state ?? '').replace(/^DEPLOYMENT_STATE_/, '').toLowerCase() || 'unknown'
        return (
          <XStack
            key={b.buildId}
            px="$4"
            py="$2.5"
            borderBottomWidth={i === buildIds.length - 1 ? 0 : 1}
            borderBottomColor="$borderColor"
            items="center"
          >
            <YStack flex={3} px="$2">
              <XStack items="center" gap="$2">
                <Text
                  fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                  fontSize="$2"
                  color="$color"
                  numberOfLines={1}
                >
                  {b.buildId}
                </Text>
                {isCurrent ? <Badge variant="success">current</Badge> : null}
              </XStack>
            </YStack>
            <YStack flex={1} px="$2">
              <Badge variant={isCurrent ? 'success' : 'muted'}>{state}</Badge>
            </YStack>
            <YStack flex={2} px="$2">
              <Text fontSize="$2" color="$placeholderColor">
                {b.createTime ? formatTimestamp(new Date(b.createTime)) : '—'}
              </Text>
            </YStack>
            <YStack flex={1} px="$2">
              {isCurrent ? (
                <Text fontSize="$1" color="$placeholderColor">
                  active
                </Text>
              ) : (
                <Button
                  size="$2"
                  chromeless
                  onPress={() => onSetCurrent(b.buildId)}
                  disabled={busy}
                >
                  <Text fontSize="$1" color={'#86efac' as never}>
                    Set current
                  </Text>
                </Button>
              )}
            </YStack>
          </XStack>
        )
      })}
    </Card>
  )
}

function HeaderCell({ children, flex }: { children: React.ReactNode; flex: number }) {
  return (
    <YStack flex={flex} px="$2">
      <Text fontSize="$1" fontWeight="500" color="$placeholderColor">
        {children}
      </Text>
    </YStack>
  )
}
