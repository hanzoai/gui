// User metadata pane — view + edit summary + details on a workflow.
// Save round-trips via UserMetadata.updateWorkflow; on success refetch
// the workflow describe so the new values + updatedBy/At appear.

import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button, Card, Input, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Alert, Empty } from '@hanzogui/admin'
import { ApiError, UserMetadata, type WorkflowExecution } from '../../lib/api'

const SUMMARY_MAX = 80

// `ns` defaults to the route param so existing callers that just pass
// `<UserMetadataPane wf={wf} />` keep working. `onSaved` is optional —
// without it the pane re-reads from props on next render after the
// parent revalidates.
export interface UserMetadataPaneProps {
  wf: WorkflowExecution
  ns?: string
  onSaved?: () => void | Promise<void>
}

interface MetadataExtras {
  updatedBy?: string
  updatedAt?: string
}

export function UserMetadataPane({ ns, wf, onSaved }: UserMetadataPaneProps) {
  const { ns: nsParam } = useParams()
  const namespace = ns ?? nsParam ?? ''
  const md = wf.userMetadata ?? null
  const extras = (md ?? {}) as MetadataExtras
  const summary = md?.summary ?? ''
  const details = md?.details ?? ''
  const [editing, setEditing] = useState(false)

  if (!editing) {
    if (!summary && !details) {
      return (
        <YStack gap="$3">
          <XStack justify="flex-end">
            <Button size="$2" chromeless onPress={() => setEditing(true)}>
              <XStack items="center" gap="$1.5">
                <Pencil size={12} />
                <Text fontSize="$2">Add metadata</Text>
              </XStack>
            </Button>
          </XStack>
          <Empty
            title="No user metadata"
            hint="Workers can attach a short summary and a longer details blob to a workflow."
          />
        </YStack>
      )
    }
    return (
      <YStack gap="$3">
        <XStack items="center" justify="space-between" gap="$2">
          <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
            WORKFLOW METADATA
          </Text>
          <Button size="$2" chromeless onPress={() => setEditing(true)}>
            <XStack items="center" gap="$1.5">
              <Pencil size={12} />
              <Text fontSize="$2">Edit</Text>
            </XStack>
          </Button>
        </XStack>
        {summary ? (
          <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <YStack gap="$1.5">
              <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
                SUMMARY
              </Text>
              <Text fontSize="$3" color="$color">
                {summary}
              </Text>
            </YStack>
          </Card>
        ) : null}
        {details ? (
          <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <YStack gap="$1.5">
              <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
                DETAILS
              </Text>
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$2"
                color="$color"
              >
                {details}
              </Text>
            </YStack>
          </Card>
        ) : null}
        {extras.updatedAt ? (
          <Text fontSize="$1" color="$placeholderColor">
            Last updated{extras.updatedBy ? ` by ${extras.updatedBy}` : ''} ·{' '}
            {new Date(extras.updatedAt).toLocaleString()}
          </Text>
        ) : null}
      </YStack>
    )
  }

  return (
    <Editor
      ns={namespace}
      workflowId={wf.execution.workflowId}
      runId={wf.execution.runId}
      initialSummary={summary}
      initialDetails={details}
      onCancel={() => setEditing(false)}
      onSaved={async () => {
        setEditing(false)
        await onSaved?.()
      }}
    />
  )
}

function Editor({
  ns,
  workflowId,
  runId,
  initialSummary,
  initialDetails,
  onCancel,
  onSaved,
}: {
  ns: string
  workflowId: string
  runId: string
  initialSummary: string
  initialDetails: string
  onCancel: () => void
  onSaved: () => void | Promise<void>
}) {
  const [summary, setSummary] = useState(initialSummary)
  const [details, setDetails] = useState(initialDetails)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<Error | null>(null)
  const dirty = summary !== initialSummary || details !== initialDetails

  async function save() {
    setSaving(true)
    setErr(null)
    try {
      await UserMetadata.updateWorkflow(ns, workflowId, runId || undefined, summary, details || undefined)
      await onSaved()
    } catch (e) {
      setErr(e instanceof ApiError ? e : e instanceof Error ? e : new Error(String(e)))
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <YStack gap="$1.5">
          <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
            SUMMARY
          </Text>
          <Input
            value={summary}
            onChangeText={(v) => setSummary(v.slice(0, SUMMARY_MAX))}
            placeholder="Short single-line description (markdown allowed)"
            maxLength={SUMMARY_MAX}
            size="$3"
          />
          <Text fontSize="$1" color="$placeholderColor">
            {summary.length}/{SUMMARY_MAX}
          </Text>
        </YStack>
        <YStack gap="$1.5">
          <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
            DETAILS
          </Text>
          <TextArea
            value={details}
            onChangeText={setDetails}
            placeholder="Longer markdown description"
            minH={140}
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$2"
          />
        </YStack>
        {err ? (
          <Alert variant="destructive" title="Failed to save metadata">
            {err.message}
          </Alert>
        ) : null}
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless disabled={saving} onPress={onCancel}>
            Cancel
          </Button>
          <Button size="$2" disabled={!dirty || saving} onPress={save}>
            <XStack items="center" gap="$1.5">
              {saving ? <Spinner size="small" /> : null}
              <Text fontSize="$2">Save metadata</Text>
            </XStack>
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}
