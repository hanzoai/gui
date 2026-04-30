// Deployments — worker version series. List one row per deployment
// (series) with current build-id, last access, and version count.
// Drill into a row for the per-version table and "Set current" action.
// Hover-reveals a row Delete affordance and the page header hosts a
// "Create deployment" link.

import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, Card, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  ApiError as AdminApiError,
  Badge,
  Empty,
  ErrorState,
  formatTimestamp,
} from '@hanzogui/admin'
import { ApiError, Deployments, type Deployment } from '../lib/api'
import type { NextPageToken } from '../lib/types'
import { useCursorPager, type PageResult } from '../stores/pagination-cursor'
import { DeleteDeploymentModal } from '../components/deployment/DeleteDeploymentModal'
import { useSettings, canWriteNamespace } from '../stores/settings'

// Re-export to silence unused-import on the admin ApiError alias when
// dead-code-eliminated by the bundler. The runtime path uses the lib
// ApiError below.
void AdminApiError

export function DeploymentsPage() {
  const { ns } = useParams()
  const namespace = ns!
  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)

  const fetchPage = useCallback(
    async (_token: NextPageToken): Promise<PageResult<Deployment>> => {
      const res = await fetch(Deployments.listUrl(namespace), {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const body = (await res.json()) as { deployments?: Deployment[]; nextPageToken?: NextPageToken }
      return { items: body.deployments ?? [], nextPageToken: body.nextPageToken ?? null }
    },
    [namespace],
  )

  const pager = useCursorPager<Deployment>(fetchPage, [namespace])

  const [deleteTarget, setDeleteTarget] = useState<Deployment | null>(null)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteErr, setDeleteErr] = useState<string | undefined>(undefined)

  const onDelete = useCallback(
    async (force: boolean) => {
      if (!deleteTarget) return
      setDeleteBusy(true)
      setDeleteErr(undefined)
      try {
        await Deployments.deleteDeployment(namespace, deleteTarget.seriesName, force)
        setDeleteTarget(null)
        await pager.refresh()
      } catch (e) {
        if (e instanceof ApiError) {
          setDeleteErr(
            e.status === 501
              ? 'Backend does not yet implement delete (501).'
              : e.message,
          )
        } else {
          setDeleteErr(e instanceof Error ? e.message : String(e))
        }
      } finally {
        setDeleteBusy(false)
      }
    },
    [deleteTarget, namespace, pager],
  )

  if (pager.error) return <ErrorState error={pager.error} />

  const rows = pager.items
  return (
    <YStack flex={1} bg="$background" minH="100%" gap="$4">
      <XStack px="$6" py="$5" justify="space-between" items="center">
        <XStack items="baseline" gap="$3">
          <H1 size="$8" fontWeight="600" color="$color">
            {rows.length}
            {pager.hasMore ? '+' : ''} Deployment{rows.length === 1 ? '' : 's'}
          </H1>
          <Button
            size="$2"
            chromeless
            onPress={() => void pager.refresh()}
            disabled={pager.loading}
            aria-label="Refresh"
          >
            {pager.loading ? <Spinner size="small" /> : <RefreshCw size={14} color="#7e8794" />}
          </Button>
        </XStack>
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/deployments/create`}
          style={{ textDecoration: 'none' }}
        >
          <Button size="$2" disabled={!writeAllowed}>
            <XStack items="center" gap="$1.5">
              <Plus size={14} color="#070b13" />
              <Text fontSize="$2">Create deployment</Text>
            </XStack>
          </Button>
        </Link>
      </XStack>

      <YStack px="$6" pb="$6" gap="$3">
        {rows.length === 0 ? (
          <Empty
            title={`No worker deployments in ${namespace}`}
            hint="Workers register a series + buildId on connect. Routing rules promote a default and ramp new versions."
          />
        ) : (
          <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <XStack
              bg={'rgba(255,255,255,0.03)' as never}
              px="$4"
              py="$2.5"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
            >
              <HeaderCell flex={3}>Name</HeaderCell>
              <HeaderCell flex={3}>Current build</HeaderCell>
              <HeaderCell flex={1}>Versions</HeaderCell>
              <HeaderCell flex={2}>Last access</HeaderCell>
              <HeaderCell flex={1}>{''}</HeaderCell>
            </XStack>
            {rows.map((d, i) => {
              const lastAccess = d.buildIds.reduce<string | undefined>((acc, b) => {
                if (!b.createTime) return acc
                if (!acc || b.createTime > acc) return b.createTime
                return acc
              }, d.createTime)
              return (
                <XStack
                  key={d.seriesName}
                  px="$4"
                  py="$2.5"
                  borderBottomWidth={i === rows.length - 1 ? 0 : 1}
                  borderBottomColor="$borderColor"
                  hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                  items="center"
                >
                  <YStack flex={3} px="$2">
                    <Link
                      to={`/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(d.seriesName)}`}
                      style={{ textDecoration: 'none' }}
                    >
                      <Text fontSize="$2" fontWeight="500" color={'#86efac' as never}>
                        {d.seriesName}
                      </Text>
                    </Link>
                  </YStack>
                  <YStack flex={3} px="$2">
                    {d.defaultBuildId ? (
                      <XStack items="center" gap="$2">
                        <Text
                          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                          fontSize="$2"
                          color="$color"
                          numberOfLines={1}
                        >
                          {d.defaultBuildId}
                        </Text>
                        <Badge variant="success">current</Badge>
                      </XStack>
                    ) : (
                      <Text fontSize="$2" color="$placeholderColor">—</Text>
                    )}
                  </YStack>
                  <YStack flex={1} px="$2">
                    <Text fontSize="$2" color="$color">{d.buildIds.length}</Text>
                  </YStack>
                  <YStack flex={2} px="$2">
                    <Text fontSize="$2" color="$placeholderColor">
                      {lastAccess ? formatTimestamp(new Date(lastAccess)) : '—'}
                    </Text>
                  </YStack>
                  <YStack flex={1} px="$2">
                    <Button
                      size="$2"
                      chromeless
                      disabled={!writeAllowed}
                      onPress={() => {
                        setDeleteErr(undefined)
                        setDeleteTarget(d)
                      }}
                      aria-label={`Delete ${d.seriesName}`}
                    >
                      <Trash2 size={14} color="#fca5a5" />
                    </Button>
                  </YStack>
                </XStack>
              )
            })}
          </Card>
        )}

        {pager.hasMore ? (
          <XStack justify="center" py="$3">
            <Button size="$2" onPress={() => void pager.loadMore()} disabled={pager.loading}>
              {pager.loading ? <Spinner size="small" /> : <Text fontSize="$2">Load more</Text>}
            </Button>
          </XStack>
        ) : null}
      </YStack>

      <DeleteDeploymentModal
        deploymentName={deleteTarget?.seriesName ?? ''}
        versionCount={deleteTarget?.buildIds.length ?? 0}
        open={deleteTarget !== null}
        busy={deleteBusy}
        error={deleteErr}
        onConfirm={(force) => void onDelete(force)}
        onCancel={() => (deleteBusy ? undefined : setDeleteTarget(null))}
      />
    </YStack>
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
