// ScheduleStatusPill — paused vs active. Pause-on-failure annotated as
// a warning state when the backend signals it.
import { Text, XStack } from 'hanzogui'
import { Badge } from '@hanzogui/admin'

export interface ScheduleStatusPillProps {
  paused?: boolean
  pauseOnFailure?: boolean
  withDot?: boolean
}

export function ScheduleStatusPill({
  paused,
  pauseOnFailure,
  withDot = true,
}: ScheduleStatusPillProps) {
  const variant = paused ? 'warning' : 'success'
  const dot = paused ? '#f59e0b' : '#22c55e'
  const label = paused
    ? pauseOnFailure
      ? 'paused (on failure)'
      : 'paused'
    : 'active'
  return (
    <Badge variant={variant}>
      <XStack items="center" gap="$1.5">
        {withDot ? (
          <Text fontSize={10} color={dot as never}>●</Text>
        ) : null}
        <Text fontSize="$1" fontWeight="500" color="inherit">
          {label}
        </Text>
      </XStack>
    </Badge>
  )
}
