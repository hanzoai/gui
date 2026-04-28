// Hanzo Bot wire-shape types for the admin SPA. Transport (apiPost,
// apiDelete, ApiError, useFetch) lives in @hanzogui/admin. This file
// only owns shapes that match the bot gateway's HTTP surface
// (src/gateway/server-http.ts → /v1/bot/*).
//
// No /api/ prefix. /v1 only — append-only opcode evolution.

export { ApiError, apiPost, apiDelete } from '@hanzogui/admin'

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
