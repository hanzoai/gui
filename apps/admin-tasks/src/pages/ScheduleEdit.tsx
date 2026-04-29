// ScheduleEdit — full update path. Loads the existing Schedule,
// hydrates the editor state, and POSTs the patched envelope through
// Schedules.update. Round-trips spec / action / policies / notes.

import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, H1, H4, Input, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Alert, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { ApiError, Schedules, type Schedule } from '../lib/api'
import type { ScheduleSpec } from '../lib/types'
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

export function ScheduleEditPage() {
  const { ns, scheduleId } = useParams()
  const namespace = ns!
  const id = scheduleId!
  const navigate = useNavigate()
  const url = Schedules.describeUrl(namespace, id)
  const { data, error, isLoading } = useFetch<Schedule>(url)

  const [note, setNote] = useState('')
  const [spec, setSpec] = useState<ScheduleSpec>({})
  const [action, setAction] = useState<ScheduleActionEditorState>({
    workflowType: '',
    taskQueue: '',
    workflowId: '',
    input: undefined,
    inputJson: '',
    inputMode: 'json',
  })
  const [policy, setPolicy] = useState<SchedulePolicyState>({
    overlapPolicy: 'Skip',
    catchupWindow: '60s',
    pauseOnFailure: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  // Hydrate once the existing schedule resolves.
  useEffect(() => {
    if (!data) return
    setNote(data.state?.notes ?? data.state?.note ?? '')
    setSpec(data.spec ?? {})
    const tq =
      typeof data.action?.taskQueue === 'string'
        ? data.action.taskQueue
        : data.action?.taskQueue?.name ?? ''
    const inputUnknown = data.action?.input
    let inputJson = ''
    if (inputUnknown !== undefined && inputUnknown !== null) {
      try {
        inputJson = JSON.stringify(inputUnknown, null, 2)
      } catch {
        inputJson = String(inputUnknown)
      }
    }
    setAction({
      workflowType: data.action?.workflowType?.name ?? '',
      taskQueue: tq,
      workflowId: data.action?.workflowId ?? '',
      input: inputUnknown,
      inputJson,
      inputMode: 'json',
    })
    setPolicy({
      overlapPolicy: data.policies?.overlapPolicy ?? 'Skip',
      catchupWindow: data.policies?.catchupWindow ?? '60s',
      pauseOnFailure: !!data.policies?.pauseOnFailure,
    })
  }, [data])

  const onSubmit = useCallback(async () => {
    if (!data) return
    setSubmitErr(null)
    if (!action.workflowType.trim()) return setSubmitErr('workflow type required')
    if (!action.taskQueue.trim()) return setSubmitErr('task queue required')
    setSubmitting(true)
    try {
      const builtAction = buildAction(action)
      const payload =
        builtAction.input === undefined || builtAction.input === null
          ? undefined
          : { data: encodeJsonBase64(builtAction.input) }
      const patch: Partial<Schedule> = {
        spec,
        action: { ...builtAction, input: payload },
        state: { ...data.state, notes: note.trim() || undefined },
        policies: {
          overlapPolicy: policy.overlapPolicy,
          catchupWindow: policy.catchupWindow,
          pauseOnFailure: policy.pauseOnFailure,
        },
      }
      await Schedules.update(namespace, id, patch)
      navigate(`/namespaces/${encodeURIComponent(namespace)}/schedules/${encodeURIComponent(id)}`)
    } catch (e) {
      setSubmitErr(toMsg(e))
    } finally {
      setSubmitting(false)
    }
  }, [data, namespace, id, spec, action, policy, note, navigate])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const canSubmit = !submitting && !!action.workflowType.trim() && !!action.taskQueue.trim()

  return (
    <YStack gap="$4">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/schedules/${encodeURIComponent(id)}`}
        style={{ textDecoration: 'none' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            {id}
          </Text>
        </XStack>
      </Link>

      <H1 size="$8" color="$color">
        Edit schedule
      </H1>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Identity
          </H4>
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor">
              Schedule ID
            </Text>
            <Input
              value={id}
              disabled
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            />
          </YStack>
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor">
              Note
            </Text>
            <Input value={note} onChangeText={setNote} placeholder="Why this exists" />
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
        <Alert variant="destructive" title="Could not save changes">
          {submitErr}
        </Alert>
      ) : null}

      <XStack gap="$2" justify="flex-end">
        <Link
          to={`/namespaces/${encodeURIComponent(namespace)}/schedules/${encodeURIComponent(id)}`}
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
              {submitting ? 'Saving…' : 'Save changes'}
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
