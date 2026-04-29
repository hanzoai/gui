// WorkflowStatusPill — wraps the shared WorkflowStatusBadge with a
// dot prefix so pills render uniformly in tables, headers, and
// timelines. Accepts either wire enum or PascalCase short form.

import { Text, XStack } from 'hanzogui'
import { Badge, parseWorkflowStatus, workflowStatusLabel, workflowStatusVariant } from '@hanzogui/admin'
import { statusColor } from '../../lib/format'

export interface WorkflowStatusPillProps {
  status: string
  withDot?: boolean
}

export function WorkflowStatusPill({ status, withDot = true }: WorkflowStatusPillProps) {
  const s = parseWorkflowStatus(status)
  return (
    <Badge variant={workflowStatusVariant(s)}>
      <XStack items="center" gap="$1.5">
        {withDot ? (
          <Text fontSize={10} color={statusColor(s) as never}>●</Text>
        ) : null}
        <Text fontSize="$1" fontWeight="500" color="inherit">
          {workflowStatusLabel(s)}
        </Text>
      </XStack>
    </Badge>
  )
}
