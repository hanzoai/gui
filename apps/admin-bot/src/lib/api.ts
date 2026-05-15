// Hanzo Bot wire-shape types for the admin SPA. Transport (apiPost,
// apiDelete, ApiError, useFetch) lives in @hanzogui/admin. This file
// only owns shapes that match the bot gateway's HTTP surface.
//
// Mount prefix is read from VITE_API_PREFIX (default /v1/bot).
// Server-side BASE_API_PREFIX must match for multi-app deployments.

export { ApiError, apiPost, apiDelete } from '@hanzogui/admin'

const RAW_API_PREFIX = (import.meta.env.VITE_API_PREFIX as string | undefined) ?? '/v1/bot'
export const ROOT = '/' + RAW_API_PREFIX.replace(/^\/+|\/+$/g, '')

// ── Health / overview ────────────────────────────────────────────────

export interface HealthSnapshot {
  status: 'ok' | 'degraded' | 'down'
  version?: string
  uptimeMs?: number
  detail?: string
}

export interface StatusSummary {
  channelsActive: number
  agentsActive: number
  sessionsOpen: number
  cronEnabled: boolean
}

// ── Channels ─────────────────────────────────────────────────────────

export interface ChannelEntry {
  id: string
  kind: string // 'discord' | 'slack' | 'telegram' | 'imessage' | 'nostr' | ...
  enabled: boolean
  status: 'connected' | 'pending' | 'error' | 'disconnected'
  detail?: string
}

export interface ChannelsListResult {
  channels: ChannelEntry[]
}

// ── Agents ───────────────────────────────────────────────────────────

export interface AgentEntry {
  id: string
  kind: string
  status: string
  modelProvider?: string
  modelName?: string
  lastSeenAt?: string
}

export interface AgentsListResult {
  agents: AgentEntry[]
}

// ── Sessions ─────────────────────────────────────────────────────────

export interface SessionEntry {
  id: string
  agentId?: string
  channelId?: string
  startedAt: string
  status: 'open' | 'closed'
  messageCount?: number
}

export interface SessionsListResult {
  sessions: SessionEntry[]
}

// ── Logs ─────────────────────────────────────────────────────────────

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface LogEntry {
  ts: string
  level: LogLevel
  msg: string
  source?: string
}
