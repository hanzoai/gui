import { SizableText, Spinner, XStack, YStack } from 'hanzogui'
import {
  formatMonthLabel,
  isBeforeToday,
  monthMatrix,
  weekdayLabels,
  type MonthCell,
} from './time'

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

/** Navigable month grid; days with availability are selectable. */
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

  return (
    <YStack gap="$2" flex={1} minWidth={260}>
      <XStack alignItems="center" justifyContent="space-between" paddingVertical="$1">
        <NavArrow label="Previous month" disabled={atFirstMonth} onPress={onPrev}>
          {'‹'}
        </NavArrow>
        <XStack alignItems="center" gap="$2">
          <SizableText size="$5" fontWeight="700" color="$color12">
            {formatMonthLabel(viewDate)}
          </SizableText>
          {loading ? <Spinner size="small" color="$color9" /> : null}
        </XStack>
        <NavArrow label="Next month" onPress={onNext}>
          {'›'}
        </NavArrow>
      </XStack>

      <XStack>
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

      <YStack gap="$1.5">
        {rows.map((row, r) => (
          <XStack key={r} gap="$1.5">
            {row.map((cell) => (
              <DayCell
                key={cell.key}
                cell={cell}
                available={availableKeys.has(cell.key)}
                past={isBeforeToday(cell.key)}
                selected={selectedDay === cell.key}
                onSelectDay={onSelectDay}
              />
            ))}
          </XStack>
        ))}
      </YStack>
    </YStack>
  )
}

function DayCell({
  cell,
  available,
  past,
  selected,
  onSelectDay,
}: {
  cell: MonthCell
  available: boolean
  past: boolean
  selected: boolean
  onSelectDay: (key: string) => void
}) {
  const selectable = cell.inMonth && available && !past
  const dayNum = cell.date.getDate()

  return (
    <YStack
      flexBasis={0}
      flexGrow={1}
      aspectRatio={1}
      alignItems="center"
      justifyContent="center"
      borderRadius="$4"
      borderWidth={1}
      borderColor={selected ? '$color12' : selectable ? '$color5' : 'transparent'}
      backgroundColor={selected ? '$color12' : selectable ? '$color2' : 'transparent'}
      opacity={cell.inMonth ? 1 : 0}
      cursor={selectable ? 'pointer' : 'default'}
      hoverStyle={selectable && !selected ? { backgroundColor: '$color4' } : undefined}
      pressStyle={selectable ? { backgroundColor: '$color6' } : undefined}
      onPress={selectable ? () => onSelectDay(cell.key) : undefined}
      aria-label={selectable ? `Select ${cell.key}` : undefined}
      role={selectable ? 'button' : undefined}
    >
      <SizableText
        size="$3"
        fontWeight={selectable ? '600' : '400'}
        color={selected ? '$color1' : selectable ? '$color12' : '$color8'}
      >
        {dayNum}
      </SizableText>
      {selectable && !selected ? (
        <YStack
          position="absolute"
          bottom={4}
          width={4}
          height={4}
          borderRadius={9999}
          backgroundColor="$color10"
        />
      ) : null}
    </YStack>
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
    <YStack
      width={34}
      height={34}
      alignItems="center"
      justifyContent="center"
      borderRadius="$4"
      opacity={disabled ? 0.35 : 1}
      cursor={disabled ? 'default' : 'pointer'}
      hoverStyle={disabled ? undefined : { backgroundColor: '$color4' }}
      pressStyle={disabled ? undefined : { backgroundColor: '$color6' }}
      onPress={disabled ? undefined : onPress}
      aria-label={label}
      role="button"
    >
      <SizableText size="$6" color="$color11">
        {children}
      </SizableText>
    </YStack>
  )
}
