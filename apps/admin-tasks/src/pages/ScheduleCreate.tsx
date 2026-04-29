// ScheduleCreate — wizard for a new schedule. Composes the spec
// editor (cron/interval/calendar), action editor (workflow type +
// input as form-or-JSON), and policy editor. On submit we POST to
// Schedules.create with a Schedule envelope; the input is sent as a
// JSON-serialised payload (encodeJsonBase64) so the backend round-
// trips the value as a Payloads.data field.

import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, H1, H4, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Alert } from '@hanzogui/admin'
import { ApiError, Schedules } from '../lib/api'
import type { Schedule, ScheduleSpec } from '../lib/types'
import { ScheduleSpecEditor } from '../components/schedule/ScheduleSpecEditor'
import {
  ScheduleActionEditor,
  buildAction,
  type ScheduleActionEditorState,
} from '../components/schedule/ScheduleActionEditor'
import {
  SchedulePolicyEditor,
  type SchedulePolicyState,
} from '../components/schedule/SchedulePolicyEditor'
import { encodeJsonBase64 } from '../components/schedule/JsonSchemaForm'

const DEFAULT_SPEC: ScheduleSpec = { cronString: ['0 * * * *'] }
const DEFAULT_ACTION: ScheduleActionEditorState = {
  workflowType: '',
  taskQueue: 'default',
  workflowId: '',
  input: undefined,
  inputJson: '',
  inputMode: 'json',
}
const DEFAULT_POLICY: SchedulePolicyState = {
  overlapPolicy: 'Skip',
  catchupWindow: '60s',
  pauseOnFailure: false,
}

export function ScheduleCreatePage() {
  const { ns } = useParams()
  const namespace = ns!
  const navigate = useNavigate()

  const [scheduleId, setScheduleId] = useState('')
  const [note, setNote] = useState('')
  const [spec, setSpec] = useState<ScheduleSpec>(DEFAULT_SPEC)
  const [action, setAction] = useState<ScheduleActionEditorState>(DEFAULT_ACTION)
  const [policy, setPolicy] = useState<SchedulePolicyState>(DEFAULT_POLICY)
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const onSubmit = useCallback(async () => {
    setSubmitErr(null)
    if (!scheduleId.trim()) return setSubmitErr('schedule id required')
    if (!action.workflowType.trim()) return setSubmitErr('workflow type required')
    if (!action.taskQueue.trim()) return setSubmitErr('task queue required')
    setSubmitting(true)
    try {
      const builtAction = buildAction(action)
      // Convert structured input to a base64 payload envelope. The
      // backend currently echoes Payloads.data as a single string; we
      // pre-encode here so the round-trip is stable.
      const payload =
        builtAction.input === undefined || builtAction.input === null
          ? undefined
          : { data: encodeJsonBase64(builtAction.input) }

      const schedule: Schedule = {
        scheduleId: scheduleId.trim(),
        namespace,
        spec,
        action: { ...builtAction, input: payload },
        state: { paused: false, notes: note.trim() || undefined },
        info: { createTime: new Date().toISOString() },
        policies: {
          overlapPolicy: policy.overlapPolicy,
          catchupWindow: policy.catchupWindow,
          pauseOnFailure: policy.pauseOnFailure,
        },
      }
      const created = await Schedules.create(namespace, schedule)
      navigate(
        `/namespaces/${encodeURIComponent(namespace)}/schedules/${encodeURIComponent(
          created.scheduleId || schedule.scheduleId,
        )}`,
      )
    } catch (e) {
      setSubmitErr(toMsg(e))
    } finally {
      setSubmitting(false)
    }
  }, [scheduleId, note, namespace, spec, action, policy, navigate])

  const canSubmit =
    !submitting && !!scheduleId.trim() && !!action.workflowType.trim() && !!action.taskQueue.trim()

  return (
    <YStack gap="$4">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/schedules`}
        style={{ textDecoration: 'none' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            Schedules
          </Text>
        </XStack>
      </Link>

      <H1 size="$8" color="$color">
        Create schedule in {namespace}
      </H1>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <YStack gap="$1.5">
            <H4 size="$3" color="$color">
              Identity
            </H4>
            <YStack gap="$1">
              <Text fontSize="$1" color="$placeholderColor">
                Schedule ID
              </Text>
              <Input
                value={scheduleId}
                onChangeText={setScheduleId}
                placeholder="my-daily-report"
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              />
            </YStack>
            <YStack gap="$1">
              <Text fontSize="$1" color="$placeholderColor">
                Note (optional)
              </Text>
              <Input value={note} onChangeText={setNote} placeholder="Why this exists" />
            </YStack>
          </YStack>
        </YStack>
      </Card>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$3" color="$color">
            Recurrence
          </H4>
          <ScheduleSpecEditor value={spec} onChange={setSpec} />
        </YStack>
      </Card>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$3" color="$color">
            Action
          </H4>
          <ScheduleActionEditor state={action} onChange={setAction} />
        </YStack>
      </Card>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$3">
          <H4 size="$3" color="$color">
            Policies
          </H4>
          <SchedulePolicyEditor value={policy} onChange={setPolicy} />
        </YStack>
      </Card>

      {submitErr ? (
        <Alert variant="destructive" title="Could not create schedule">
          {submitErr}
        </Alert>
      ) : null}

      <XStack gap="$2" justify="flex-end">
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/schedules`}
          style={{ textDecoration: 'none' }}
        >
          <Button chromeless>
            <Text fontSize="$2">Cancel</Text>
          </Button>
        </Link>
        <Button
          onPress={() => void onSubmit()}
          disabled={!canSubmit}
          bg={canSubmit ? ('#f2f2f2' as never) : ('rgba(255,255,255,0.05)' as never)}
        >
          <XStack items="center" gap="$1.5">
            {submitting ? <Spinner size="small" /> : <Save size={14} color={canSubmit ? '#070b13' : '#7e8794'} />}
            <Text
              fontSize="$2"
              fontWeight="500"
              color={canSubmit ? ('#070b13' as never) : '$placeholderColor'}
            >
              {submitting ? 'Creating…' : 'Create schedule'}
            </Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}

function toMsg(e: unknown): string {
  if (e instanceof ApiError) {
    return `${e.status === 501 ? 'Not yet implemented' : `Failed (${e.status})`}: ${e.message}`
  }
  return e instanceof Error ? e.message : String(e)
}
