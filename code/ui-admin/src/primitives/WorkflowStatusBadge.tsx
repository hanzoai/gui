// WorkflowStatusBadge — port of upstream temporalio/ui
// workflow-status.svelte. Paints one of nine workflow execution
// statuses as a colour-coded chip, accepts either the wire enum
// (`WORKFLOW_EXECUTION_STATUS_RUNNING`) or the short PascalCase form
// (`Running`).
//
// Defers to the Badge primitive for chrome and the format helpers
// for status → variant mapping. Adding a status mapping in one
// place must update every list table — this is that place.

import { Badge } from './Badge'
import {
  parseWorkflowStatus,
  workflowStatusLabel,
  workflowStatusVariant,
  type WorkflowStatus,
} from '../data/format'

export interface WorkflowStatusBadgeProps {
  // Either the wire enum string or the short PascalCase form. Unknown
  // strings render as Unspecified rather than throwing — list pages
  // must keep working when the backend ships a status before us.
  status: string | WorkflowStatus
}

export function WorkflowStatusBadge({ status }: WorkflowStatusBadgeProps) {
  const s = parseWorkflowStatus(status)
  return <Badge variant={workflowStatusVariant(s)}>{workflowStatusLabel(s)}</Badge>
}
