// EventTypeIcon — Lucide icon + colour for an event category. Single
// source of truth so HistoryTree, EventCard, EventDetail render the
// same glyph.

import { Activity } from '@hanzogui/lucide-icons-2/icons/Activity'
import { Bell } from '@hanzogui/lucide-icons-2/icons/Bell'
import { Bookmark } from '@hanzogui/lucide-icons-2/icons/Bookmark'
import { Clock } from '@hanzogui/lucide-icons-2/icons/Clock'
import { Cog } from '@hanzogui/lucide-icons-2/icons/Cog'
import { GitBranch } from '@hanzogui/lucide-icons-2/icons/GitBranch'
import { Layers } from '@hanzogui/lucide-icons-2/icons/Layers'
import { RefreshCw } from '@hanzogui/lucide-icons-2/icons/RefreshCw'
import { Send } from '@hanzogui/lucide-icons-2/icons/Send'
import { categorize } from '../../stores/event-aggregation'
import type { EventTypeCategory } from '../../lib/types'

const CATEGORY_ICON: Record<EventTypeCategory, typeof Activity> = {
  workflow: Cog,
  activity: Activity,
  timer: Clock,
  signal: Bell,
  marker: Bookmark,
  'child-workflow': GitBranch,
  nexus: Send,
  update: RefreshCw,
  command: Layers,
  other: Layers,
}

export const CATEGORY_COLOR: Record<EventTypeCategory, string> = {
  workflow: '#7dd3fc',
  activity: '#86efac',
  timer: '#fcd34d',
  signal: '#c4b5fd',
  marker: '#94a3b8',
  'child-workflow': '#a5b4fc',
  nexus: '#f0abfc',
  update: '#fdba74',
  command: '#cbd5e1',
  other: '#7e8794',
}

export interface EventTypeIconProps {
  eventType: string
  size?: number
}

export function EventTypeIcon({ eventType, size = 14 }: EventTypeIconProps) {
  const cat = categorize(eventType)
  const Icon = CATEGORY_ICON[cat] ?? Layers
  return <Icon size={size} color={CATEGORY_COLOR[cat]} />
}

export function categoryColor(eventType: string): string {
  return CATEGORY_COLOR[categorize(eventType)] ?? CATEGORY_COLOR.other
}
