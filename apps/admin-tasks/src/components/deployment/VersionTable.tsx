// VersionTable — build IDs registered against one deployment series.
// Each row hosts a VersionActionsMenu when handlers are supplied, or the
// inline "Set current" button when only the legacy callbacks are wired.

import { Button, Card, Text, XStack, YStack } from 'hanzogui'
import { Badge, formatTimestamp } from '@hanzogui/admin'
import type { DeploymentVersion } from '../../lib/types'
import { VersionActionsMenu } from './VersionActionsMenu'

export interface VersionTableProps {
  versions: DeploymentVersion[]
  defaultBuildId: string
  onSetCurrent: (buildId: string) => void
  onUnsetCurrent?: () => void
  onValidate?: (buildId: string) => void
  onDelete?: (buildId: string) => void
  // Path prefix for per-row edit links: "{prefix}/{buildId}/edit". When
  // omitted the actions menu is not rendered.
  editHrefBase?: string
  writeDisabled?: boolean
  busy?: boolean
}

export function VersionTable({
  versions,
  defaultBuildId,
  onSetCurrent,
  onUnsetCurrent,
  onValidate,
  onDelete,
  editHrefBase,
  writeDisabled,
  busy,
}: VersionTableProps) {
  const fullActions = !!editHrefBase && !!onValidate && !!onDelete
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
      {versions.map((b, i) => {
        const isCurrent = b.buildId === defaultBuildId
        const state = String(b.state ?? '').replace(/^DEPLOYMENT_STATE_/, '').toLowerCase() || 'unknown'
        return (
          <XStack
            key={b.buildId}
            px="$4"
            py="$2.5"
            borderBottomWidth={i === versions.length - 1 ? 0 : 1}
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
              {fullActions ? (
                <VersionActionsMenu
                  buildId={b.buildId}
                  editHref={`${editHrefBase}/${encodeURIComponent(b.buildId)}/edit`}
                  isCurrent={isCurrent}
                  writeDisabled={writeDisabled}
                  onSetCurrent={() => onSetCurrent(b.buildId)}
                  onValidate={() => onValidate!(b.buildId)}
                  onDelete={() => onDelete!(b.buildId)}
                />
              ) : isCurrent ? (
                onUnsetCurrent ? (
                  <Button
                    size="$2"
                    chromeless
                    onPress={onUnsetCurrent}
                    disabled={busy}
                    aria-label="Unset current build"
                  >
                    <Text fontSize="$1" color={'#fca5a5' as never}>
                      Unset
                    </Text>
                  </Button>
                ) : (
                  <Text fontSize="$1" color="$placeholderColor">
                    active
                  </Text>
                )
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
