// LdapSync — port of upstream LdapSyncPage.
//
// Upstream batched all candidates and POSTed once, then mutated
// state from the resolved promise. We replace that with a streaming
// Server-Sent Events progress UI. The backend pushes one
// `ldap.sync.progress` event per user processed and a final
// `ldap.sync.completed` event with totals. The browser closes the
// EventSource on unmount; partial progress is preserved if the user
// navigates away mid-sync (the backend continues; the user can
// reopen the page and pick up the latest snapshot).

import { useEffect, useMemo, useState } from 'react'
import {
  Button,
  Card,
  Checkbox,
  H3,
  Progress,
  Separator,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { Check } from '@hanzogui/lucide-icons-2/icons/Check'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost } from '../../data/useFetch'
import { useEvents } from '../../data/useEvents'
import type {
  IamItemResponse,
  Ldap,
  LdapSyncEvent,
  LdapUserPreview,
} from './types'

interface PreviewResponse {
  status: 'ok' | 'error'
  msg?: string
  data: { users: LdapUserPreview[]; existUuids: string[] }
}

export interface LdapSyncProps {
  ldapId: string
  organizationName: string
  onOpenEdit?: (orgName: string, ldapId: string) => void
  onExit?: () => void
}

interface ProgressLine {
  cn: string
  status: 'ok' | 'exists' | 'failed'
  reason?: string
}

export function LdapSync({ ldapId, organizationName, onOpenEdit, onExit }: LdapSyncProps) {
  const baseUrl = `/v1/iam/ldap/${encodeURIComponent(organizationName)}/${encodeURIComponent(ldapId)}`
  const ldapResp = useFetch<IamItemResponse<Ldap>>(baseUrl)
  const previewResp = useFetch<PreviewResponse>(`${baseUrl}/users`)

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [running, setRunning] = useState(false)
  const [total, setTotal] = useState(0)
  const [done, setDone] = useState(0)
  const [lines, setLines] = useState<ProgressLine[]>([])
  const [completed, setCompleted] = useState<{ ok: number; existed: number; failed: number } | null>(
    null,
  )
  const [error, setError] = useState<Error | undefined>(undefined)

  // Subscribe to the sync stream once we kick off `running`. The
  // server emits the named events declared in `kinds`. When the
  // run finishes the server closes the channel and `useEvents`
  // tears down on unmount.
  useEvents<LdapSyncEvent>({
    url: running ? `${baseUrl}/sync/events` : '',
    kinds: ['ldap.sync.started', 'ldap.sync.progress', 'ldap.sync.completed'],
    onEvent: (e) => {
      if (e.kind === 'ldap.sync.started') {
        setTotal(e.total)
        setDone(0)
        setLines([])
        setCompleted(null)
      } else if (e.kind === 'ldap.sync.progress') {
        setDone(e.current)
        setLines((prev) => [...prev, { cn: e.cn, status: e.status, reason: e.reason }])
      } else if (e.kind === 'ldap.sync.completed') {
        setCompleted({ ok: e.ok, existed: e.existed, failed: e.failed })
        setRunning(false)
      }
    },
  })

  const ldap = ldapResp.data?.data
  const users = previewResp.data?.data?.users ?? []
  const existUuids = useMemo(
    () => new Set((previewResp.data?.data?.existUuids ?? []).filter((u) => u !== '')),
    [previewResp.data],
  )
  const syncable = useMemo(() => users.filter((u) => !existUuids.has(u.uuid)), [users, existUuids])
  const allSelected = syncable.length > 0 && syncable.every((u) => selected.has(u.uuid))

  if (ldapResp.isLoading || previewResp.isLoading) return <Loading label="Loading LDAP preview" />
  if (ldapResp.error) return <ErrorState error={ldapResp.error} />
  if (previewResp.error) return <ErrorState error={previewResp.error} />
  if (!ldap) return null

  const toggleAll = (checked: boolean) =>
    setSelected(checked ? new Set(syncable.map((u) => u.uuid)) : new Set())
  const toggleOne = (uuid: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(uuid)) next.delete(uuid)
      else next.add(uuid)
      return next
    })
  }

  const startSync = async () => {
    if (selected.size === 0) {
      setError(new Error('Please select at least one user.'))
      return
    }
    setError(undefined)
    setCompleted(null)
    setRunning(true)
    try {
      const picked = users.filter((u) => selected.has(u.uuid))
      await apiPost<{ status: string }>(`${baseUrl}/sync`, { users: picked })
    } catch (e) {
      setRunning(false)
      setError(e instanceof Error ? e : new Error(String(e)))
    }
  }

  const pct = total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$5" color="$color">
          {ldap.serverName}
        </H3>
        <XStack gap="$2">
          <Button
            size="$3"
            disabled={running || selected.size === 0}
            onPress={startSync}
          >
            {running ? 'Syncing…' : `Sync (${selected.size})`}
          </Button>
          <Button size="$3" variant="outlined" onPress={() => onOpenEdit?.(organizationName, ldapId)}>
            Edit LDAP
          </Button>
        </XStack>
      </XStack>

      {(running || completed) && (
        <Card bg="$background" borderColor="$borderColor" borderWidth={1} p="$4">
          <YStack gap="$2">
            <XStack justify="space-between">
              <Text fontSize="$2" color="$placeholderColor">
                {running
                  ? `Syncing ${done} / ${total}`
                  : completed
                    ? `Done — ok ${completed.ok}, existed ${completed.existed}, failed ${completed.failed}`
                    : ''}
              </Text>
              <Text fontSize="$2" color="$placeholderColor">
                {pct}%
              </Text>
            </XStack>
            <Progress value={pct} max={100}>
              <Progress.Indicator animation="quick" />
            </Progress>
            {lines.length > 0 && (
              <YStack mt="$2" gap="$1" maxH={200} overflow="hidden">
                {lines.slice(-50).map((l, i) => (
                  <Text key={`${l.cn}-${i}`} fontSize="$1" color={statusColor(l.status)}>
                    [{l.status}] {l.cn}
                    {l.reason ? ` — ${l.reason}` : ''}
                  </Text>
                ))}
              </YStack>
            )}
          </YStack>
        </Card>
      )}

      {error ? <ErrorState error={error} /> : null}

      <Card bg="$background" borderColor="$borderColor" borderWidth={1} overflow="hidden">
        <XStack px="$4" py="$2.5" borderBottomWidth={1} borderBottomColor="$borderColor">
          <YStack flex={0.4} items="center" justify="center">
            <Checkbox
              size="$2"
              checked={allSelected}
              onCheckedChange={(c: boolean | 'indeterminate') => toggleAll(c === true)}
              aria-label="Select all syncable users"
            >
              <Checkbox.Indicator>
                <Check size={12} />
              </Checkbox.Indicator>
            </Checkbox>
          </YStack>
          {['CN', 'Uid', 'Email', 'Phone'].map((h) => (
            <YStack key={h} flex={1} px="$2">
              <Text fontSize="$1" color="$placeholderColor">
                {h}
              </Text>
            </YStack>
          ))}
        </XStack>
        <Separator />
        {users.length === 0 ? (
          <YStack p="$5" items="center">
            <Text color="$placeholderColor">No LDAP users to preview.</Text>
          </YStack>
        ) : (
          users.map((u, i) => {
            const synced = existUuids.has(u.uuid)
            const isChecked = selected.has(u.uuid)
            return (
              <XStack
                key={u.uuid}
                px="$4"
                py="$2.5"
                borderBottomWidth={i === users.length - 1 ? 0 : 1}
                borderBottomColor="$borderColor"
                items="center"
                opacity={synced ? 0.55 : 1}
              >
                <YStack flex={0.4} items="center" justify="center">
                  <Checkbox
                    size="$2"
                    disabled={synced}
                    checked={isChecked}
                    onCheckedChange={() => toggleOne(u.uuid)}
                    aria-label={`Select ${u.cn}`}
                  >
                    <Checkbox.Indicator>
                      <Check size={12} />
                    </Checkbox.Indicator>
                  </Checkbox>
                </YStack>
                <YStack flex={1} px="$2">
                  <XStack gap="$2" items="center">
                    <Text color="$color">{u.cn}</Text>
                    <Text
                      fontSize="$1"
                      color={synced ? '#4ade80' : '#f87171'}
                    >
                      {synced ? 'synced' : 'unsynced'}
                    </Text>
                  </XStack>
                </YStack>
                <YStack flex={1} px="$2">
                  <Text color="$color">{u.uid}</Text>
                </YStack>
                <YStack flex={1} px="$2">
                  <Text color="$color">{u.email}</Text>
                </YStack>
                <YStack flex={1} px="$2">
                  <Text color="$color">{u.mobile}</Text>
                </YStack>
              </XStack>
            )
          })
        )}
      </Card>

      {onExit ? (
        <XStack>
          <Button size="$3" variant="outlined" onPress={onExit}>
            Close
          </Button>
        </XStack>
      ) : null}
    </YStack>
  )
}

function statusColor(s: 'ok' | 'exists' | 'failed'): string {
  if (s === 'ok') return '#4ade80'
  if (s === 'exists') return '#fbbf24'
  return '#f87171'
}
