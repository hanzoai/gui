// ScheduleSpecEditor — composes Cron / Interval / Calendar editors
// behind a tab/segment selector. Tracks per-mode local state and emits
// a normalised ScheduleSpec to the caller.

import { useCallback, useMemo, useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import type { CalendarSpec, IntervalSpec, ScheduleSpec } from '../../lib/types'
import { CronEditor } from './CronEditor'
import { IntervalEditor, buildIntervalSpec, type IntervalUnit } from './IntervalEditor'
import { CalendarSpecEditor } from './CalendarSpecEditor'
import { describeSpec, nextOccurrences } from '../../stores/schedule-recurrence'

export type SpecMode = 'cron' | 'interval' | 'calendar'

export const SPEC_MODES: ReadonlyArray<{ mode: SpecMode; label: string }> = [
  { mode: 'cron', label: 'Cron' },
  { mode: 'interval', label: 'Interval' },
  { mode: 'calendar', label: 'Calendar' },
]

export interface ScheduleSpecEditorProps {
  value: ScheduleSpec
  onChange: (next: ScheduleSpec) => void
}

export function ScheduleSpecEditor({ value, onChange }: ScheduleSpecEditorProps) {
  // Determine initial mode from the spec; cron wins if multiple set.
  const [mode, setMode] = useState<SpecMode>(() => initialMode(value))
  const [crons, setCrons] = useState<string[]>(() =>
    value.cronString && value.cronString.length ? value.cronString : ['0 * * * *'],
  )
  const [interval, setInterval] = useState(() => initialInterval(value))
  const [calendars, setCalendars] = useState<CalendarSpec[]>(
    () => value.calendar ?? [{ minute: '0', hour: '*' }],
  )
  const [excludes, setExcludes] = useState<CalendarSpec[]>(value.excludeCalendar ?? [])
  const [timezoneName, setTimezoneName] = useState(value.timezoneName ?? '')
  const [jitter, setJitter] = useState(value.jitter ?? '')

  const emit = useCallback(
    (override?: Partial<{
      mode: SpecMode
      crons: string[]
      interval: typeof interval
      calendars: CalendarSpec[]
      excludes: CalendarSpec[]
      timezoneName: string
      jitter: string
    }>) => {
      const m = override?.mode ?? mode
      const c = override?.crons ?? crons
      const iv = override?.interval ?? interval
      const cal = override?.calendars ?? calendars
      const ex = override?.excludes ?? excludes
      const tz = override?.timezoneName ?? timezoneName
      const j = override?.jitter ?? jitter
      const out: ScheduleSpec = {}
      if (m === 'cron') out.cronString = c.filter((s) => s.trim())
      if (m === 'interval') out.interval = [buildIntervalSpec(iv.every, iv.unit, iv.phase, iv.phaseUnit)]
      if (m === 'calendar') out.calendar = cal
      if (ex.length) out.excludeCalendar = ex
      if (tz.trim()) out.timezoneName = tz.trim()
      if (j.trim()) out.jitter = j.trim()
      onChange(out)
    },
    [mode, crons, interval, calendars, excludes, timezoneName, jitter, onChange],
  )

  const switchMode = useCallback(
    (m: SpecMode) => {
      setMode(m)
      emit({ mode: m })
    },
    [emit],
  )

  const previewSpec = useMemo<ScheduleSpec>(() => {
    if (mode === 'cron') return { cronString: crons.filter((s) => s.trim()) }
    if (mode === 'interval')
      return {
        interval: [buildIntervalSpec(interval.every, interval.unit, interval.phase, interval.phaseUnit)],
      }
    return { calendar: calendars }
  }, [mode, crons, interval, calendars])

  const upcoming = useMemo(() => nextOccurrences(previewSpec, 5), [previewSpec])

  return (
    <YStack gap="$4">
      <XStack gap="$1.5">
        {SPEC_MODES.map(({ mode: m, label }) => (
          <Button
            key={m}
            size="$2"
            onPress={() => switchMode(m)}
            bg={mode === m ? ('#f2f2f2' as never) : 'transparent'}
            borderWidth={1}
            borderColor={mode === m ? ('#f2f2f2' as never) : '$borderColor'}
          >
            <Text fontSize="$2" color={mode === m ? ('#070b13' as never) : '$color'}>
              {label}
            </Text>
          </Button>
        ))}
      </XStack>

      {mode === 'cron' ? (
        <YStack gap="$3">
          {crons.map((c, i) => (
            <YStack key={i} gap="$2">
              <CronEditor
                value={c}
                onChange={(v) => {
                  const next = crons.slice()
                  next[i] = v
                  setCrons(next)
                  emit({ crons: next })
                }}
              />
              {crons.length > 1 ? (
                <Button
                  size="$2"
                  chromeless
                  onPress={() => {
                    const next = crons.filter((_, idx) => idx !== i)
                    setCrons(next)
                    emit({ crons: next })
                  }}
                >
                  <XStack items="center" gap="$1.5">
                    <Trash2 size={12} color="#ef4444" />
                    <Text fontSize="$1" color={'#ef4444' as never}>
                      Remove
                    </Text>
                  </XStack>
                </Button>
              ) : null}
            </YStack>
          ))}
          <XStack>
            <Button
              size="$2"
              chromeless
              borderWidth={1}
              borderColor="$borderColor"
              onPress={() => {
                const next = [...crons, '0 0 * * *']
                setCrons(next)
                emit({ crons: next })
              }}
            >
              <XStack items="center" gap="$1.5">
                <Plus size={12} color="#7e8794" />
                <Text fontSize="$1">Add cron</Text>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      ) : null}

      {mode === 'interval' ? (
        <IntervalEditor
          every={interval.every}
          unit={interval.unit}
          phase={interval.phase}
          phaseUnit={interval.phaseUnit}
          onChange={(s) => {
            setInterval(s)
            emit({ interval: s })
          }}
        />
      ) : null}

      {mode === 'calendar' ? (
        <YStack gap="$3">
          {calendars.map((c, i) => (
            <YStack
              key={i}
              gap="$2"
              borderWidth={1}
              borderColor="$borderColor"
              p="$3"
              rounded="$2"
            >
              <CalendarSpecEditor
                value={c}
                onChange={(v) => {
                  const next = calendars.slice()
                  next[i] = v
                  setCalendars(next)
                  emit({ calendars: next })
                }}
              />
              {calendars.length > 1 ? (
                <Button
                  size="$2"
                  chromeless
                  onPress={() => {
                    const next = calendars.filter((_, idx) => idx !== i)
                    setCalendars(next)
                    emit({ calendars: next })
                  }}
                >
                  <XStack items="center" gap="$1.5">
                    <Trash2 size={12} color="#ef4444" />
                    <Text fontSize="$1" color={'#ef4444' as never}>
                      Remove rule
                    </Text>
                  </XStack>
                </Button>
              ) : null}
            </YStack>
          ))}
          <XStack>
            <Button
              size="$2"
              chromeless
              borderWidth={1}
              borderColor="$borderColor"
              onPress={() => {
                const next = [...calendars, { minute: '0', hour: '0' }]
                setCalendars(next)
                emit({ calendars: next })
              }}
            >
              <XStack items="center" gap="$1.5">
                <Plus size={12} color="#7e8794" />
                <Text fontSize="$1">Add calendar rule</Text>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      ) : null}

      <YStack gap="$2">
        <Text fontSize="$2" fontWeight="500" color="$color">
          Exclusions
        </Text>
        {excludes.map((c, i) => (
          <YStack
            key={i}
            gap="$2"
            borderWidth={1}
            borderColor="$borderColor"
            p="$3"
            rounded="$2"
          >
            <CalendarSpecEditor
              value={c}
              exclude
              onChange={(v) => {
                const next = excludes.slice()
                next[i] = v
                setExcludes(next)
                emit({ excludes: next })
              }}
            />
            <Button
              size="$2"
              chromeless
              onPress={() => {
                const next = excludes.filter((_, idx) => idx !== i)
                setExcludes(next)
                emit({ excludes: next })
              }}
            >
              <XStack items="center" gap="$1.5">
                <Trash2 size={12} color="#ef4444" />
                <Text fontSize="$1" color={'#ef4444' as never}>
                  Remove exclusion
                </Text>
              </XStack>
            </Button>
          </YStack>
        ))}
        <XStack>
          <Button
            size="$2"
            chromeless
            borderWidth={1}
            borderColor="$borderColor"
            onPress={() => {
              const next = [...excludes, { minute: '0', hour: '0' }]
              setExcludes(next)
              emit({ excludes: next })
            }}
          >
            <XStack items="center" gap="$1.5">
              <Plus size={12} color="#7e8794" />
              <Text fontSize="$1">Add exclusion</Text>
            </XStack>
          </Button>
        </XStack>
      </YStack>

      <XStack gap="$3" flexWrap="wrap">
        <YStack gap="$1" width={220}>
          <Text fontSize="$1" color="$placeholderColor">
            Timezone (IANA)
          </Text>
          <Input
            value={timezoneName}
            onChangeText={(v) => {
              setTimezoneName(v)
              emit({ timezoneName: v })
            }}
            placeholder="UTC"
          />
        </YStack>
        <YStack gap="$1" width={220}>
          <Text fontSize="$1" color="$placeholderColor">
            Jitter
          </Text>
          <Input
            value={jitter}
            onChangeText={(v) => {
              setJitter(v)
              emit({ jitter: v })
            }}
            placeholder="0s"
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          />
        </YStack>
      </XStack>

      <YStack gap="$1" borderTopWidth={1} borderTopColor="$borderColor" pt="$3">
        <Text fontSize="$1" color="$placeholderColor">
          Summary
        </Text>
        <Text fontSize="$2" color="$color">
          {describeSpec(previewSpec)}
        </Text>
        {upcoming.length > 0 ? (
          <YStack gap="$0.5" mt="$1">
            <Text fontSize="$1" color="$placeholderColor">
              Next fires (UTC)
            </Text>
            {upcoming.map((iso) => (
              <Text
                key={iso}
                fontSize="$1"
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                color="$color"
              >
                {iso}
              </Text>
            ))}
          </YStack>
        ) : null}
      </YStack>
    </YStack>
  )
}

function initialMode(value: ScheduleSpec): SpecMode {
  if (value.cronString && value.cronString.length) return 'cron'
  if (value.interval && value.interval.length) return 'interval'
  if (value.calendar && value.calendar.length) return 'calendar'
  return 'cron'
}

function initialInterval(value: ScheduleSpec): {
  every: number
  unit: IntervalUnit
  phase: number
  phaseUnit: IntervalUnit
} {
  const i: IntervalSpec | undefined = value.interval?.[0]
  if (!i) return { every: 1, unit: 'h', phase: 0, phaseUnit: 's' }
  const seconds = parseSecondsLoose(i.interval)
  const unit: IntervalUnit =
    seconds % 86400 === 0 ? 'd' : seconds % 3600 === 0 ? 'h' : seconds % 60 === 0 ? 'm' : 's'
  const div = unit === 'd' ? 86400 : unit === 'h' ? 3600 : unit === 'm' ? 60 : 1
  const phaseSeconds = i.phase ? parseSecondsLoose(i.phase) : 0
  const phaseUnit: IntervalUnit =
    phaseSeconds === 0
      ? 's'
      : phaseSeconds % 86400 === 0
        ? 'd'
        : phaseSeconds % 3600 === 0
          ? 'h'
          : phaseSeconds % 60 === 0
            ? 'm'
            : 's'
  const phaseDiv = phaseUnit === 'd' ? 86400 : phaseUnit === 'h' ? 3600 : phaseUnit === 'm' ? 60 : 1
  return {
    every: Math.max(1, Math.floor(seconds / div)),
    unit,
    phase: Math.max(0, Math.floor(phaseSeconds / phaseDiv)),
    phaseUnit,
  }
}

function parseSecondsLoose(d: string): number {
  const m = String(d).match(/^(\d+(?:\.\d+)?)(s|m|h|d)?$/)
  if (!m) return 0
  const n = Number(m[1])
  const u = (m[2] ?? 's') as IntervalUnit
  const mult: Record<IntervalUnit, number> = { s: 1, m: 60, h: 3600, d: 86400 }
  return Math.floor(n * mult[u])
}
