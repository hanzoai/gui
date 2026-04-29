// ScheduleDetail — describe view with pause/unpause, trigger now,
// edit, delete, recent runs, and upcoming-fire preview. Pause/unpause
// are optimistic — the row flips immediately and rolls back on error.

import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, H1, H4, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Pause } from '@hanzogui/lucide-icons-2/icons/Pause'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Play } from '@hanzogui/lucide-icons-2/icons/Play'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Zap } from '@hanzogui/lucide-icons-2/icons/Zap'
import { Alert, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { ApiError, Schedules, type Schedule } from '../lib/api'
import { describeSpec, nextOccurrences } from '../stores/schedule-recurrence'
import { ScheduleStatusPill } from '../components/schedule/ScheduleStatusPill'
import { RecentRunsTable, type RecentRunRow } from '../components/schedule/RecentRunsTable'
import { formatTimestamp } from '../lib/format'

export function ScheduleDetailPage() {
  const { ns, scheduleId } = useParams()
  const namespace = ns!
  const id = scheduleId!
  const navigate = useNavigate()
  const url = Schedules.describeUrl(namespace, id)
  const { data, error, isLoading, mutate } = useFetch<Schedule>(url)

  const [busy, setBusy] = useState<'pause' | 'trigger' | 'delete' | null>(null)
  const [actionErr, setActionErr] = useState<string | null>(null)
  const [actionOk, setActionOk] = useState<string | null>(null)

  const flash = useCallback((msg: string) => {
    setActionOk(msg)
    setTimeout(() => setActionOk(null), 2500)
  }, [])

  // Optimistic UI ghost — reflected in the buttons immediately while
  // the request is in flight. Reset on completion.
  const [optimisticPaused, setOptimisticPaused] = useState<boolean | null>(null)

  const onPauseToggle = useCallback(async () => {
    if (!data) return
    const wasPaused = !!data.state?.paused
    setBusy('pause')
    setActionErr(null)
    setOptimisticPaused(!wasPaused)
    try {
      if (wasPaused) await Schedules.unpause(namespace, id)
      else await Schedules.pause(namespace, id)
      flash(wasPaused ? 'Resumed' : 'Paused')
      void mutate()
    } catch (e) {
      setOptimisticPaused(null)
      setActionErr(toMsg(e))
    } finally {
      setBusy(null)
      setOptimisticPaused(null)
    }
  }, [data, namespace, id, mutate, flash])

  const onTrigger = useCallback(async () => {
    setBusy('trigger')
    setActionErr(null)
    try {
      await Schedules.trigger(namespace, id)
      flash('Triggered')
      void mutate()
    } catch (e) {
      setActionErr(toMsg(e))
    } finally {
      setBusy(null)
    }
  }, [namespace, id, mutate, flash])

  const onDelete = useCallback(async () => {
    if (!confirm(`Delete schedule "${id}"? This cannot be undone.`)) return
    setBusy('delete')
    setActionErr(null)
    try {
      await Schedules.delete(namespace, id)
      navigate(`/namespaces/${encodeURIComponent(namespace)}/schedules`)
    } catch (e) {
      setActionErr(toMsg(e))
    } finally {
      setBusy(null)
    }
  }, [namespace, id, navigate])

  const upcoming = useMemo(() => {
    if (!data) return []
    if (data.state?.paused) return []
    if (data.info?.futureActionTimes && data.info.futureActionTimes.length) {
      return data.info.futureActionTimes.slice(0, 5)
    }
    return nextOccurrences(data.spec, 5)
  }, [data])

  const recentRows = useMemo<RecentRunRow[]>(() => {
    if (!data?.info?.recentActions) return []
    return data.info.recentActions.map((a) => ({
      scheduleTime: a.scheduleTime,
      actualTime: a.actualTime,
    }))
  }, [data])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  return (
    <YStack gap="$4">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/schedules`}
        style={{ textDecoration: 'none' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            Schedules
          </Text>
        </XStack>
      </Link>

      <XStack items="flex-start" gap="$3" justify="space-between">
        <YStack gap="$2" flex={1}>
          <XStack items="center" gap="$2">
            <H1 size="$8" color="$color" fontWeight="600">
              {data.scheduleId}
            </H1>
            <ScheduleStatusPill
              paused={optimisticPaused ?? data.state?.paused}
              pauseOnFailure={data.policies?.pauseOnFailure}
            />
          </XStack>
          <Text fontSize="$2" color="$placeholderColor">
            {describeSpec(data.spec)}
          </Text>
          {data.state?.notes || data.state?.note ? (
            <Text fontSize="$1" color="$placeholderColor">
              Note: {data.state.notes ?? data.state.note}
            </Text>
          ) : null}
        </YStack>
        <XStack gap="$1.5">
          <Button size="$2" onPress={() => void onTrigger()} disabled={busy != null}>
            <XStack items="center" gap="$1.5">
              {busy === 'trigger' ? <Spinner size="small" /> : <Zap size={12} color="#7e8794" />}
              <Text fontSize="$2">Trigger now</Text>
            </XStack>
          </Button>
          <Button size="$2" onPress={() => void onPauseToggle()} disabled={busy != null}>
            <XStack items="center" gap="$1.5">
              {busy === 'pause' ? (
                <Spinner size="small" />
              ) : (optimisticPaused ?? data.state?.paused) ? (
                <Play size={12} color="#22c55e" />
              ) : (
                <Pause size={12} color="#f59e0b" />
              )}
              <Text fontSize="$2">{(optimisticPaused ?? data.state?.paused) ? 'Resume' : 'Pause'}</Text>
            </XStack>
          </Button>
          <Link
            to={`/namespaces/${encodeURIComponent(namespace)}/schedules/${encodeURIComponent(
              id,
            )}/edit`}
            style={{ textDecoration: 'none' }}
          >
            <Button size="$2">
              <XStack items="center" gap="$1.5">
                <Pencil size={12} color="#7e8794" />
                <Text fontSize="$2">Edit</Text>
              </XStack>
            </Button>
          </Link>
          <Button size="$2" onPress={() => void onDelete()} disabled={busy != null}>
            <XStack items="center" gap="$1.5">
              {busy === 'delete' ? <Spinner size="small" /> : <Trash2 size={12} color="#ef4444" />}
              <Text fontSize="$2" color={'#ef4444' as never}>
                Delete
              </Text>
            </XStack>
          </Button>
        </XStack>
      </XStack>

      {actionOk ? (
        <Alert title={actionOk}>Schedule action acknowledged.</Alert>
      ) : null}
      {actionErr ? (
        <Alert variant="destructive" title="Action failed">
          {actionErr}
        </Alert>
      ) : null}

      <XStack gap="$3" flexWrap="wrap">
        <Stat label="Total runs" value={String(data.info?.actionCount ?? 0)} />
        <Stat
          label="Created"
          value={data.info?.createTime ? formatTimestamp(new Date(data.info.createTime)) : '—'}
        />
        <Stat
          label="Updated"
          value={data.info?.updateTime ? formatTimestamp(new Date(data.info.updateTime)) : '—'}
        />
        <Stat label="Workflow type" value={data.action?.workflowType?.name ?? '—'} />
        <Stat
          label="Task queue"
          value={typeof data.action?.taskQueue === 'string'
            ? data.action.taskQueue
            : data.action?.taskQueue?.name ?? '—'}
        />
        <Stat
          label="Overlap policy"
          value={data.policies?.overlapPolicy ?? 'Unspecified'}
        />
      </XStack>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Upcoming fires (UTC)
          </H4>
          {upcoming.length === 0 ? (
            <Text fontSize="$2" color="$placeholderColor">
              {data.state?.paused ? 'Schedule is paused.' : 'No upcoming fires computed.'}
            </Text>
          ) : (
            <YStack gap="$1">
              {upcoming.map((iso) => (
                <Text
                  key={iso}
                  fontSize="$2"
                  fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                  color="$color"
                >
                  {iso}
                </Text>
              ))}
            </YStack>
          )}
        </YStack>
      </Card>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$3" color="$color">
            Recent runs
          </H4>
          <RecentRunsTable namespace={namespace} rows={recentRows} />
        </YStack>
      </Card>
    </YStack>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <YStack
      gap="$1"
      borderWidth={1}
      borderColor="$borderColor"
      bg="$background"
      p="$3"
      flexBasis={220}
      rounded="$2"
    >
      <Text fontSize="$1" color="$placeholderColor">
        {label}
      </Text>
      <Text fontSize="$3" fontWeight="500" color="$color" numberOfLines={1}>
        {value}
      </Text>
    </YStack>
  )
}

function toMsg(e: unknown): string {
  if (e instanceof ApiError) {
    return `${e.status === 501 ? 'Not yet implemented' : `Failed (${e.status})`}: ${e.message}`
  }
  return e instanceof Error ? e.message : String(e)
}
