// MigrationStatusCard — polls `GET /v1/tasks/namespaces/{ns}/migrate
// ?jobId=...` every second while the job is mid-flight. Surfaces
// the four engine phases (locked → copying → replaying → done) plus
// a progress bar. Stops polling when state is `done` or `failed`.

import { useEffect, useRef, useState } from 'react'
import { Card, Text, XStack, YStack } from 'hanzogui'
import { Alert, Badge } from '@hanzogui/admin'
import { ApiError, Migration, type MigrationJob, type MigrationPhase } from '../../lib/api'

export interface MigrationStatusCardProps {
  ns: string
  jobId: string
  // Fired once the job reaches a terminal state. The parent
  // typically clears the job ref so the card unmounts.
  onTerminal?: (job: MigrationJob) => void
}

const PHASES: MigrationPhase[] = ['queued', 'locked', 'copying', 'replaying', 'done']

function phaseIndex(state: string): number {
  const i = PHASES.indexOf(state as MigrationPhase)
  return i === -1 ? 0 : i
}

function isTerminal(state: string): boolean {
  return state === 'done' || state === 'failed'
}

export function MigrationStatusCard({ ns, jobId, onTerminal }: MigrationStatusCardProps) {
  const [job, setJob] = useState<MigrationJob | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const fired = useRef(false)

  useEffect(() => {
    let cancelled = false
    fired.current = false

    async function tick() {
      try {
        const next = await Migration.status(ns, jobId)
        if (cancelled) return
        setJob(next)
        setErr(null)
        if (isTerminal(next.state) && !fired.current) {
          fired.current = true
          onTerminal?.(next)
        }
      } catch (e) {
        if (cancelled) return
        setErr(e instanceof ApiError ? e.message : (e as Error).message)
      }
    }

    void tick()
    const id = setInterval(() => {
      if (job && isTerminal(job.state)) return
      void tick()
    }, 1000)
    return () => {
      cancelled = true
      clearInterval(id)
    }
    // job intentionally omitted — only ns/jobId reset the poller.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ns, jobId, onTerminal])

  if (err && !job) {
    return (
      <Alert variant="destructive" title="Could not read migration status">
        {err}
      </Alert>
    )
  }
  if (!job) {
    return (
      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <Text fontSize="$2" color="$placeholderColor">
          Waiting for engine to acknowledge job {jobId}…
        </Text>
      </Card>
    )
  }
  const idx = phaseIndex(job.state)
  const total = PHASES.length - 1
  const progress = job.state === 'failed' ? 0 : job.progress ?? idx / total

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <XStack items="center" justify="space-between">
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
              MIGRATING {ns.toUpperCase()}
            </Text>
            <Text fontSize="$2" color="$placeholderColor">
              {job.fromNode ?? '—'} → {job.toNode ?? '—'} · job {job.jobId}
            </Text>
          </YStack>
          <Badge
            variant={
              (job.state === 'done'
                ? 'success'
                : job.state === 'failed'
                  ? 'destructive'
                  : 'info') as never
            }
          >
            {job.state}
          </Badge>
        </XStack>

        <YStack
          height={6}
          rounded="$10"
          bg={'rgba(255,255,255,0.06)' as never}
          overflow="hidden"
          aria-label="migration-progress"
        >
          <YStack
            height={6}
            bg={(job.state === 'failed' ? '#ef4444' : '#22c55e') as never}
            width={`${Math.max(0, Math.min(1, progress)) * 100}%` as never}
          />
        </YStack>

        <XStack gap="$2" flexWrap="wrap">
          {PHASES.map((p, i) => (
            <XStack key={p} items="center" gap="$1.5">
              <YStack
                width={8}
                height={8}
                rounded="$10"
                bg={(i <= idx ? '#22c55e' : 'rgba(255,255,255,0.15)') as never}
              />
              <Text fontSize="$1" color={(i <= idx ? '$color' : '$placeholderColor') as never}>
                {p}
              </Text>
            </XStack>
          ))}
        </XStack>

        {job.error ? (
          <Alert variant="destructive" title="Migration failed">
            {job.error}
          </Alert>
        ) : null}
      </YStack>
    </Card>
  )
}
