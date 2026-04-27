// SystemInfo — runtime metrics dashboard. CPU usage per core, memory
// usage, API latency / throughput, build version. Polls the IAM
// `/system-info` endpoint every two seconds while mounted; stops
// cleanly on unmount or on first error (errors don't render any
// noisy spinner — they degrade to "Failed to get").
//
// Original at `~/work/hanzo/iam/web/src/SystemInfo.tsx` (Ant Design).
// This is the @hanzo/gui v7 port: stacked cards, no Antd.

import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, H4, Paragraph, Text, XStack, YStack } from 'hanzogui'
import type { PrometheusInfo, SystemInfo as SystemInfoData, VersionInfo } from './types'
import { getFriendlyFileSize, getProgressColor } from './util'

export interface SystemInfoProps {
  // Async fetcher for the {cpu, memory} snapshot. Returns `null` to
  // signal "give up polling" — caller-decided.
  loadSystem: () => Promise<SystemInfoData | null>
  // Async fetcher for prometheus latency/throughput.
  loadPrometheus: () => Promise<PrometheusInfo | null>
  // Async fetcher for the embedded build version.
  loadVersion: () => Promise<VersionInfo | null>
  // Poll cadence in milliseconds. Defaults to 2 s, matching upstream.
  pollIntervalMs?: number
  // Repo URL the version link points at. Caller-supplied so this
  // component is brand-neutral.
  repoUrl?: string
}

interface ProgressBarProps {
  percent: number
  label?: string
}

function ProgressBar({ percent, label }: ProgressBarProps) {
  const safe = Math.max(0, Math.min(100, percent))
  const color = getProgressColor(safe)
  return (
    <YStack gap="$1">
      <XStack
        height={8}
        bg={'rgba(255,255,255,0.06)' as never}
        rounded="$1"
        overflow="hidden"
      >
        <XStack height={8} width={`${safe}%` as never} bg={color as never} />
      </XStack>
      <Text fontSize="$1" color="$placeholderColor">
        {label ?? `${safe.toFixed(1)}%`}
      </Text>
    </YStack>
  )
}

export function SystemInfo({
  loadSystem,
  loadPrometheus,
  loadVersion,
  pollIntervalMs = 2000,
  repoUrl,
}: SystemInfoProps) {
  const [system, setSystem] = useState<SystemInfoData>({
    cpuUsage: [],
    memoryUsed: 0,
    memoryTotal: 0,
  })
  const [prom, setProm] = useState<PrometheusInfo>({
    apiThroughput: [],
    apiLatency: [],
    totalThroughput: 0,
  })
  const [version, setVersion] = useState<VersionInfo>({ version: '' })
  const [loading, setLoading] = useState(true)
  const stopped = useRef(false)

  useEffect(() => {
    stopped.current = false

    let timer: ReturnType<typeof setInterval> | null = null
    const tick = async () => {
      if (stopped.current) return
      try {
        const sys = await loadSystem()
        if (sys) setSystem(sys)
      } catch {
        stopped.current = true
        if (timer) clearInterval(timer)
      }
      try {
        const p = await loadPrometheus()
        if (p) setProm(p)
      } catch {
        // Prometheus is optional — keep the timer running.
      }
    }

    void (async () => {
      await tick()
      setLoading(false)
      try {
        const v = await loadVersion()
        if (v) setVersion(v)
      } catch {
        // Version is optional — render "Unknown" below.
      }
    })()

    timer = setInterval(tick, pollIntervalMs)
    return () => {
      stopped.current = true
      if (timer) clearInterval(timer)
    }
  }, [loadSystem, loadPrometheus, loadVersion, pollIntervalMs])

  const memPercent = useMemo(() => {
    if (!system.memoryTotal) return 0
    return Number(((system.memoryUsed / system.memoryTotal) * 100).toFixed(2))
  }, [system.memoryUsed, system.memoryTotal])

  const versionText = useMemo(() => {
    if (!version.version) return 'Unknown version'
    if (version.commitOffset && version.commitOffset > 0) {
      return `${version.version} (ahead+${version.commitOffset})`
    }
    return version.version
  }, [version.version, version.commitOffset])

  return (
    <YStack gap="$4" p="$4">
      <XStack gap="$4" flexWrap="wrap">
        <Card
          flexBasis={320}
          flexGrow={1}
          p="$4"
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
        >
          <YStack gap="$3">
            <H4 size="$4">CPU Usage</H4>
            {loading ? (
              <Paragraph color="$placeholderColor">Loading…</Paragraph>
            ) : system.cpuUsage.length === 0 ? (
              <Paragraph color="$placeholderColor">Failed to get</Paragraph>
            ) : (
              system.cpuUsage.map((u, i) => (
                <ProgressBar key={i} percent={Number(u.toFixed(1))} />
              ))
            )}
          </YStack>
        </Card>

        <Card
          flexBasis={320}
          flexGrow={1}
          p="$4"
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
        >
          <YStack gap="$3">
            <H4 size="$4">Memory Usage</H4>
            {loading ? (
              <Paragraph color="$placeholderColor">Loading…</Paragraph>
            ) : system.memoryTotal <= 0 ? (
              <Paragraph color="$placeholderColor">Failed to get</Paragraph>
            ) : (
              <YStack gap="$2">
                <Text fontSize="$3">
                  {getFriendlyFileSize(system.memoryUsed)} /{' '}
                  {getFriendlyFileSize(system.memoryTotal)}
                </Text>
                <ProgressBar percent={memPercent} label={`${memPercent}%`} />
              </YStack>
            )}
          </YStack>
        </Card>
      </XStack>

      <XStack gap="$4" flexWrap="wrap">
        <Card
          flexBasis={320}
          flexGrow={1}
          p="$4"
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
        >
          <YStack gap="$2">
            <H4 size="$4">API Latency</H4>
            <Paragraph color="$placeholderColor" fontSize="$2">
              {prom.apiLatency.length === 0
                ? 'No data yet.'
                : `${prom.apiLatency.length} samples — last: ${prom.apiLatency.at(-1)?.toFixed(2) ?? '0'} ms`}
            </Paragraph>
          </YStack>
        </Card>
        <Card
          flexBasis={320}
          flexGrow={1}
          p="$4"
          bg="$background"
          borderColor="$borderColor"
          borderWidth={1}
        >
          <YStack gap="$2">
            <H4 size="$4">API Throughput</H4>
            <Paragraph color="$placeholderColor" fontSize="$2">
              Total: {prom.totalThroughput.toLocaleString()} requests
            </Paragraph>
          </YStack>
        </Card>
      </XStack>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$2">
          <H4 size="$4">About</H4>
          <Paragraph color="$placeholderColor" fontSize="$2">
            Identity & Access Management (IAM) / Single-Sign-On (SSO) platform with web UI
            supporting OAuth 2.0, OIDC, SAML, and CAS.
          </Paragraph>
          <Text fontSize="$2">
            Version:{' '}
            {repoUrl ? (
              <Text
                tag="a"
                href={`${repoUrl}/releases/tag/${version.version}`}
                color="#60a5fa"
                {...({ target: '_blank', rel: 'noreferrer' } as never)}
              >
                {versionText}
              </Text>
            ) : (
              <Text>{versionText}</Text>
            )}
          </Text>
        </YStack>
      </Card>
    </YStack>
  )
}
