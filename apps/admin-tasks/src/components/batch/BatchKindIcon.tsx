// BatchKindIcon — color-coded icon for a batch operation kind. The
// upstream Svelte UI uses small badges; we render a single Lucide icon
// in the kind's brand color so list and detail pages share one tag.

import { XCircle } from '@hanzogui/lucide-icons-2/icons/XCircle'
import { Hand } from '@hanzogui/lucide-icons-2/icons/Hand'
import { Zap } from '@hanzogui/lucide-icons-2/icons/Zap'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Settings2 } from '@hanzogui/lucide-icons-2/icons/Settings2'
import { Square } from '@hanzogui/lucide-icons-2/icons/Square'

export type BatchKind =
  | 'Terminate'
  | 'Cancel'
  | 'Signal'
  | 'Reset'
  | 'UpdateOptions'
  | 'Delete'
  | 'Unspecified'

interface Spec {
  Icon: typeof XCircle
  color: string
  label: string
}

const SPEC: Record<BatchKind, Spec> = {
  Terminate: { Icon: XCircle, color: '#ef4444', label: 'Terminate' },
  Cancel: { Icon: Hand, color: '#eab308', label: 'Cancel' },
  Signal: { Icon: Zap, color: '#3b82f6', label: 'Signal' },
  Reset: { Icon: RefreshCw, color: '#a855f7', label: 'Reset' },
  UpdateOptions: { Icon: Settings2, color: '#7e8794', label: 'Update options' },
  Delete: { Icon: Square, color: '#7e8794', label: 'Delete' },
  Unspecified: { Icon: Square, color: '#7e8794', label: 'Unspecified' },
}

// Wire forms come back in a few shapes. Normalize before lookup.
export function normalizeKind(input: string | undefined | null): BatchKind {
  if (!input) return 'Unspecified'
  const stripped = input.replace(/^BATCH_OPERATION_TYPE_/, '')
  const key = stripped
    .toLowerCase()
    .replace(/(^|_)(\w)/g, (_, __, c: string) => c.toUpperCase())
  if (key === 'UpdateExecutionOptions' || key === 'UpdateOption') return 'UpdateOptions'
  if (key in SPEC) return key as BatchKind
  return 'Unspecified'
}

export interface BatchKindIconProps {
  kind: string | BatchKind
  size?: number
  withLabel?: boolean
}

export function BatchKindIcon({ kind, size = 14, withLabel = false }: BatchKindIconProps) {
  const k = typeof kind === 'string' ? normalizeKind(kind) : kind
  const { Icon, color, label } = SPEC[k]
  if (!withLabel) return <Icon size={size} color={color as never} aria-label={label} />
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <Icon size={size} color={color as never} aria-label={label} />
      <span>{label}</span>
    </span>
  )
}

export function batchKindLabel(kind: string | BatchKind): string {
  const k = typeof kind === 'string' ? normalizeKind(kind) : kind
  return SPEC[k].label
}

export function batchKindColor(kind: string | BatchKind): string {
  const k = typeof kind === 'string' ? normalizeKind(kind) : kind
  return SPEC[k].color
}
