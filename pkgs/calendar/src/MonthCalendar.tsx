import { SizableText, Spinner, XStack, YStack } from '@hanzo/gui'
import { Press, useRoving } from './press.tsx'
import {
  dateFromKey,
  formatDayLong,
  formatMonthLabel,
  isBeforeToday,
  monthMatrix,
  weekdayLabels,
  ymd,
  type MonthCell,
} from './time.ts'

export interface MonthCalendarProps {
  viewDate: Date
  availableKeys: Set<string>
  selectedDay: string | null
  onSelectDay: (key: string) => void
  onPrev: () => void
  onNext: () => void
  atFirstMonth: boolean
  weekStartsOn?: 0 | 1
  loading?: boolean
}

/** The key seven days from `key`, either way. */
const week = (key: string, dir: 1 | -1) => {
  const d = dateFromKey(key)
  d.setDate(d.getDate() + 7 * dir)
  return ymd(d)
}

/**
 * Navigable month grid; days with availability are selectable.
 *
 * The open days are one tab stop: Tab lands on the chosen day (or the first open
 * one), Left and Right step a day, Up and Down a week when that day is open,
 * Home and End go to the ends. Enter or Space chooses.
 */
export function MonthCalendar({
  viewDate,
  availableKeys,
  selectedDay,
  onSelectDay,
  onPrev,
  onNext,
  atFirstMonth,
  weekStartsOn = 0,
  loading,
}: MonthCalendarProps) {
  const cells = monthMatrix(viewDate, weekStartsOn)
  const rows: MonthCell[][] = []
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7))
  const labels = weekdayLabels(weekStartsOn)
  const month = formatMonthLabel(viewDate)

  const open = cells
    .filter((c) => c.inMonth && availableKeys.has(c.key) && !isBeforeToday(c.key))
    .map((c) => c.key)
  const roving = useRoving(
    open.length,
    Math.max(open.indexOf(selectedDay ?? ''), 0),
    (i, key) => {
      if (key !== 'ArrowUp' && key !== 'ArrowDown') return null
      const j = open.indexOf(week(open[i], key === 'ArrowDown' ? 1 : -1))
      return j === -1 ? null : j
    },
    month
  )

  return (
    // Grows into a row beside the times, at its content height in a column.
    // `flex={1}` is `flex: 1 1 0%` under a config whose styleCompat is "web",
    // and a zero basis in an auto-height column collapses the grid to nothing.
    <YStack gap="$2" flexGrow={1} minWidth={260} $sm={{ flexBasis: 0 }}>
      <XStack alignItems="center" justifyContent="space-between" paddingVertical="$1">
        <NavArrow label="Previous month" disabled={atFirstMonth} onPress={onPrev}>
          {'‹'}
        </NavArrow>
        <XStack alignItems="center" gap="$2">
          <SizableText size="$5" fontWeight="700" color="$color12" aria-live="polite">
            {month}
          </SizableText>
          {loading ? <Spinner size="small" color="$color9" /> : null}
        </XStack>
        <NavArrow label="Next month" onPress={onNext}>
          {'›'}
        </NavArrow>
      </XStack>

      <XStack aria-hidden>
        {labels.map((l) => (
          <YStack
            key={l}
            flexBasis={0}
            flexGrow={1}
            alignItems="center"
            paddingVertical="$1"
          >
            <SizableText size="$1" color="$color10">
              {l}
            </SizableText>
          </YStack>
        ))}
      </XStack>

      <YStack gap="$1.5" role="group" aria-label={`Days in ${month}`}>
        {rows.map((row, r) => (
          <XStack key={r} gap="$1.5">
            {row.map((cell) => {
              const at = open.indexOf(cell.key)
              return (
                <DayCell
                  key={cell.key}
                  cell={cell}
                  open={at !== -1}
                  selected={selectedDay === cell.key}
                  onSelectDay={onSelectDay}
                  roving={at === -1 ? undefined : roving.item(at)}
                />
              )
            })}
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
}

function DayCell({
  cell,
  open,
  selected,
  onSelectDay,
  roving,
}: {
  cell: MonthCell
  open: boolean
  selected: boolean
  onSelectDay: (key: string) => void
  roving?: ReturnType<ReturnType<typeof useRoving>['item']>
}) {
  const dayNum = cell.date.getDate()
  const frame = {
    // The availability dot is placed against the cell; a config whose
    // default position is static would place it against the page.
    position: 'relative',
    flexBasis: 0,
    flexGrow: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '$4',
    borderWidth: 1,
    opacity: cell.inMonth ? 1 : 0,
  } as const

  const number = (
    <SizableText
      size="$3"
      fontWeight={open ? '600' : '400'}
      color={selected ? '$color1' : open ? '$color12' : '$color8'}
    >
      {dayNum}
    </SizableText>
  )

  if (!open || !roving) {
    return (
      <YStack
        {...frame}
        borderColor="transparent"
        aria-hidden={!cell.inMonth || undefined}
      >
        {number}
      </YStack>
    )
  }

  return (
    <Press
      {...frame}
      {...roving}
      borderColor={selected ? '$color12' : '$borderColor'}
      backgroundColor={selected ? '$color12' : '$color3'}
      hoverStyle={selected ? undefined : { borderColor: '$color8' }}
      pressStyle={selected ? undefined : { borderColor: '$color8' }}
      onPress={() => onSelectDay(cell.key)}
      aria-label={`${formatDayLong(cell.date)}, times available`}
      // The chosen one of the set; pressing it again does not unchoose it, so
      // it is not a toggle (aria-pressed).
      aria-current={selected || undefined}
    >
      {number}
      {selected ? null : (
        <YStack
          position="absolute"
          bottom={4}
          width={4}
          height={4}
          borderRadius={9999}
          backgroundColor="$color10"
        />
      )}
    </Press>
  )
}

function NavArrow({
  children,
  onPress,
  disabled,
  label,
}: {
  children: string
  onPress: () => void
  disabled?: boolean
  label: string
}) {
  return (
    <Press
      width={34}
      height={34}
      alignItems="center"
      justifyContent="center"
      borderRadius="$4"
      opacity={disabled ? 0.35 : 1}
      hoverStyle={disabled ? undefined : { backgroundColor: '$color4' }}
      pressStyle={disabled ? undefined : { backgroundColor: '$color6' }}
      disabled={disabled}
      onPress={onPress}
      aria-label={label}
    >
      <SizableText size="$6" color="$color11" aria-hidden>
        {children}
      </SizableText>
    </Press>
  )
}
