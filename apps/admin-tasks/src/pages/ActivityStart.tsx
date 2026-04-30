// ActivityStart — single-page form to start a standalone activity.
// Mirrors the workflow Start dialog: type + taskQueue are required,
// the rest is optional configuration. Input is JSON-parsed before
// submit so the user sees an inline error rather than a 400 from the
// server. Search attributes / memo accept JSON object literals.

import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  H1,
  Input,
  Spinner,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Play } from '@hanzogui/lucide-icons-2/icons/Play'
import { Alert } from '@hanzogui/admin'
import { Activities, ApiError } from '../lib/api'
import type { Activity, StartActivityRequest } from '../lib/api'
import { canWriteNamespace, useSettings } from '../stores/settings'

export function ActivityStartPage() {
  const { ns } = useParams()
  const namespace = ns!
  const navigate = useNavigate()
  const { settings } = useSettings()
  const writable = canWriteNamespace(settings)

  const [type, setType] = useState('')
  const [taskQueue, setTaskQueue] = useState('default')
  const [activityId, setActivityId] = useState('')
  const [input, setInput] = useState('')
  const [scheduleToClose, setScheduleToClose] = useState('')
  const [scheduleToStart, setScheduleToStart] = useState('')
  const [startToClose, setStartToClose] = useState('30s')
  const [heartbeatTimeout, setHeartbeatTimeout] = useState('')
  const [retryInitial, setRetryInitial] = useState('')
  const [retryMax, setRetryMax] = useState('')
  const [searchAttrs, setSearchAttrs] = useState('')
  const [memo, setMemo] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function submit() {
    setErr(null)

    if (!type.trim()) {
      setErr('Activity type is required.')
      return
    }
    if (!taskQueue.trim()) {
      setErr('Task queue is required.')
      return
    }
    if (!startToClose.trim()) {
      setErr('Start-to-close timeout is required.')
      return
    }

    let parsedInput: unknown = undefined
    if (input.trim()) {
      try {
        parsedInput = JSON.parse(input)
      } catch (e) {
        setErr(`Input must be valid JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }
    }
    let parsedSearch: Record<string, never> | undefined
    if (searchAttrs.trim()) {
      try {
        parsedSearch = JSON.parse(searchAttrs)
      } catch (e) {
        setErr(`Search attributes must be valid JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }
    }
    let parsedMemo: Record<string, unknown> | undefined
    if (memo.trim()) {
      try {
        parsedMemo = JSON.parse(memo)
      } catch (e) {
        setErr(`Memo must be valid JSON: ${e instanceof Error ? e.message : String(e)}`)
        return
      }
    }

    const req: StartActivityRequest = {
      activityId: activityId.trim() || undefined,
      activityType: { name: type.trim() },
      taskQueue: { name: taskQueue.trim() },
      input: parsedInput,
      startToCloseTimeout: startToClose.trim(),
      scheduleToCloseTimeout: scheduleToClose.trim() || undefined,
      scheduleToStartTimeout: scheduleToStart.trim() || undefined,
      heartbeatTimeout: heartbeatTimeout.trim() || undefined,
      searchAttributes: parsedSearch as never,
      memo: parsedMemo,
    }
    if (retryInitial.trim() || retryMax.trim()) {
      req.retryPolicy = {
        initialInterval: retryInitial.trim() || undefined,
        maximumAttempts: retryMax.trim() ? Number(retryMax) : undefined,
      }
    }

    setSubmitting(true)
    try {
      const result: Activity = await Activities.start(namespace, req)
      navigate(
        `/namespaces/${encodeURIComponent(namespace)}/activities/${encodeURIComponent(result.activityId)}/${encodeURIComponent(result.runId)}`,
      )
    } catch (e) {
      if (e instanceof ApiError) {
        setErr(
          e.status === 501
            ? 'Standalone activity start is not yet implemented in the native server (501).'
            : `Failed: ${e.message}`,
        )
      } else {
        setErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (!writable) {
    return (
      <YStack gap="$4">
        <BackLink namespace={namespace} />
        <Alert variant="destructive" title="Namespace is read-only">
          Write actions are disabled for this namespace. Ask an admin to grant
          write access before starting activities.
        </Alert>
      </YStack>
    )
  }

  return (
    <YStack gap="$5" maxW={760}>
      <BackLink namespace={namespace} />
      <H1 size="$7" color="$color" fontWeight="600">
        Start an activity in {namespace}
      </H1>
      <Text fontSize="$2" color="$placeholderColor">
        Posts to /v1/tasks/namespaces/{namespace}/activities. Workers register
        the activity type via the worker SDK.
      </Text>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$4">
          <Section title="Identity">
            <Field label="Activity type *">
              <Input value={type} onChangeText={setType} placeholder="DispatchOrder" />
            </Field>
            <XStack gap="$3">
              <Field label="Task queue *" flex={1}>
                <Input value={taskQueue} onChangeText={setTaskQueue} />
              </Field>
              <Field label="Activity ID" flex={1}>
                <Input value={activityId} onChangeText={setActivityId} placeholder="auto" />
              </Field>
            </XStack>
          </Section>

          <Section title="Input">
            <Field label="Input (JSON, optional)">
              <TextArea
                value={input}
                onChangeText={setInput}
                placeholder={'{"orderId":"abc"}'}
                minH={100}
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              />
            </Field>
          </Section>

          <Section title="Timeouts">
            <XStack gap="$3">
              <Field label="Start-to-close *" flex={1}>
                <Input
                  value={startToClose}
                  onChangeText={setStartToClose}
                  placeholder="30s"
                />
              </Field>
              <Field label="Heartbeat" flex={1}>
                <Input
                  value={heartbeatTimeout}
                  onChangeText={setHeartbeatTimeout}
                  placeholder="10s"
                />
              </Field>
            </XStack>
            <XStack gap="$3">
              <Field label="Schedule-to-close" flex={1}>
                <Input
                  value={scheduleToClose}
                  onChangeText={setScheduleToClose}
                  placeholder="2m"
                />
              </Field>
              <Field label="Schedule-to-start" flex={1}>
                <Input
                  value={scheduleToStart}
                  onChangeText={setScheduleToStart}
                  placeholder="30s"
                />
              </Field>
            </XStack>
          </Section>

          <Section title="Retry policy">
            <XStack gap="$3">
              <Field label="Initial interval" flex={1}>
                <Input
                  value={retryInitial}
                  onChangeText={setRetryInitial}
                  placeholder="1s"
                />
              </Field>
              <Field label="Maximum attempts" flex={1}>
                <Input
                  value={retryMax}
                  onChangeText={setRetryMax}
                  placeholder="3"
                  inputMode="numeric"
                />
              </Field>
            </XStack>
          </Section>

          <Section title="Indexing">
            <Field label="Search attributes (JSON, optional)">
              <TextArea
                value={searchAttrs}
                onChangeText={setSearchAttrs}
                placeholder={'{"CustomKeywordField":"value"}'}
                minH={80}
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              />
            </Field>
            <Field label="Memo (JSON, optional)">
              <TextArea
                value={memo}
                onChangeText={setMemo}
                placeholder={'{"createdBy":"ops"}'}
                minH={80}
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              />
            </Field>
          </Section>

          {err ? (
            <Alert variant="destructive" title="Could not start">
              {err}
            </Alert>
          ) : null}

          <XStack gap="$2" justify="flex-end">
            <Link
              to={`/namespaces/${encodeURIComponent(namespace)}/activities`}
              style={{ textDecoration: 'none' }}
            >
              <Button chromeless>
                <Text fontSize="$2">Cancel</Text>
              </Button>
            </Link>
            <Button
              onPress={() => void submit()}
              disabled={submitting || !type.trim() || !taskQueue.trim() || !startToClose.trim()}
              bg={'#f2f2f2' as never}
              hoverStyle={{ background: '#ffffff' as never }}
            >
              <XStack items="center" gap="$1.5">
                {submitting ? <Spinner size="small" /> : <Play size={14} color="#070b13" />}
                <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                  {submitting ? 'Starting…' : 'Start'}
                </Text>
              </XStack>
            </Button>
          </XStack>
        </YStack>
      </Card>
    </YStack>
  )
}

function BackLink({ namespace }: { namespace: string }) {
  return (
    <Link
      to={`/namespaces/${encodeURIComponent(namespace)}/activities`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
        <ChevronLeft size={14} color="#7e8794" />
        <Text fontSize="$2" color="$placeholderColor">
          activities
        </Text>
      </XStack>
    </Link>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2.5">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
        {title.toUpperCase()}
      </Text>
      {children}
    </YStack>
  )
}

function Field({
  label,
  flex,
  children,
}: {
  label: string
  flex?: number
  children: React.ReactNode
}) {
  return (
    <YStack gap="$1.5" flex={flex}>
      <Text fontSize="$2" color="$color">
        {label}
      </Text>
      {children}
    </YStack>
  )
}
