// Cluster — operator view of the distributed engine. Refreshes every
// 5s; falls back to a "single-node deployment" empty state when the
// engine returns 404 on `/v1/tasks/cluster` (capability-gated).
//
// Layout: status card (replicator type, validators, in-quorum bool,
// shard counts) → validator table → leader map → shard table.

import { useEffect, useRef, useState } from 'react'
import { H1, H4, Text, XStack, YStack } from 'hanzogui'
import { Empty, ErrorState, LoadingState } from '@hanzogui/admin'
import { ApiError, Cluster, type ClusterStatus } from '../lib/api'
import { ClusterStatusCard } from '../components/cluster/ClusterStatusCard'
import { ValidatorTable } from '../components/cluster/ValidatorTable'
import { LeaderMap } from '../components/cluster/LeaderMap'
import { ShardTable } from '../components/cluster/ShardTable'

const REFRESH_MS = 5000

interface ProbeState {
  loading: boolean
  status: ClusterStatus | null
  inQuorum: boolean
  // 404 → engine is single-node. Treated as a non-error "feature
  // unavailable" state, not as a failure.
  unavailable: boolean
  error: Error | null
}

export function ClusterPage() {
  const [state, setState] = useState<ProbeState>({
    loading: true,
    status: null,
    inQuorum: false,
    unavailable: false,
    error: null,
  })
  const cancelled = useRef(false)

  useEffect(() => {
    cancelled.current = false
    async function tick() {
      try {
        const [status, health] = await Promise.all([Cluster.getStatus(), Cluster.getHealth()])
        if (cancelled.current) return
        setState({
          loading: false,
          status,
          inQuorum: health.ok,
          unavailable: false,
          error: null,
        })
      } catch (e) {
        if (cancelled.current) return
        const ae = e as ApiError
        if (ae && ae.status === 404) {
          setState({ loading: false, status: null, inQuorum: false, unavailable: true, error: null })
          return
        }
        setState((s) => ({
          ...s,
          loading: false,
          error: e instanceof Error ? e : new Error(String(e)),
        }))
      }
    }
    void tick()
    const id = setInterval(() => {
      // Stop polling once we've confirmed single-node mode — the
      // engine is not going to flip without a redeploy.
      if (cancelled.current) return
      void tick()
    }, REFRESH_MS)
    return () => {
      cancelled.current = true
      clearInterval(id)
    }
  }, [])

  if (state.unavailable) {
    return (
      <YStack gap="$5">
        <Header />
        <Empty
          title="Cluster mode disabled"
          hint="This engine is running as a single-node deployment. Replicated mode (quasar) exposes per-shard ownership and namespace migration; single-node deployments do not."
        />
      </YStack>
    )
  }
  if (state.error) return <ErrorState error={state.error} />
  if (state.loading || !state.status) return <LoadingState rows={3} />

  return (
    <YStack gap="$5">
      <Header />
      <ClusterStatusCard status={state.status} inQuorum={state.inQuorum} />

      <Section title="Validators">
        <ValidatorTable validators={state.status.validators} />
      </Section>

      <Section title="Leader map" hint="Shard / task-queue ownership grouped by org or namespace prefix.">
        <LeaderMap leaderFor={state.status.leaderFor} />
      </Section>

      <Section title="Shards" hint="Sorted by replication lag (worst first).">
        <ShardTable shards={state.status.shards} />
      </Section>
    </YStack>
  )
}

function Header() {
  return (
    <XStack items="baseline" gap="$3">
      <H1 size="$8" fontWeight="600" color="$color">
        Cluster
      </H1>
      <Text fontSize="$2" color="$placeholderColor">
        replicator topology · refreshes every {REFRESH_MS / 1000}s
      </Text>
    </XStack>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <YStack gap="$3">
      <YStack gap="$1">
        <H4 fontSize="$5" fontWeight="600" color="$color">
          {title}
        </H4>
        {hint ? (
          <Text fontSize="$2" color="$placeholderColor">
            {hint}
          </Text>
        ) : null}
      </YStack>
      {children}
    </YStack>
  )
}
