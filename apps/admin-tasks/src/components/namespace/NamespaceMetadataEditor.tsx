// Namespace metadata editor — summary (single line) + details (markdown).
// Posts via Namespaces.updateMetadata; the backend stub is wired and
// will start persisting once the metadata column lands.

import { useState } from 'react'
import { Button, Input, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { Alert } from '@hanzogui/admin'
import { ApiError, Namespaces } from '../../lib/api'

export interface NamespaceMetadataEditorProps {
  ns: string
  initialSummary?: string
  initialDetails?: string
  onSaved?: (next: { summary: string; details: string }) => void
  onCancel?: () => void
}

const SUMMARY_MAX = 80

export function NamespaceMetadataEditor({
  ns,
  initialSummary = '',
  initialDetails = '',
  onSaved,
  onCancel,
}: NamespaceMetadataEditorProps) {
  const [summary, setSummary] = useState(initialSummary)
  const [details, setDetails] = useState(initialDetails)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const dirty = summary !== initialSummary || details !== initialDetails

  async function save() {
    setSaving(true)
    setError(null)
    try {
      await Namespaces.updateMetadata(ns, summary, details || undefined)
      onSaved?.({ summary, details })
    } catch (e) {
      setError(e instanceof ApiError ? e : e instanceof Error ? e : new Error(String(e)))
    } finally {
      setSaving(false)
    }
  }

  return (
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
      {error ? (
        <Alert variant="destructive" title="Failed to save metadata">
          {error.message}
        </Alert>
      ) : null}
      <XStack gap="$2" justify="flex-end">
        <Button size="$2" chromeless disabled={saving} onPress={() => onCancel?.()}>
          Cancel
        </Button>
        <Button
          size="$2"
          disabled={!dirty || saving}
          onPress={save}
        >
          <XStack items="center" gap="$1.5">
            {saving ? <Spinner size="small" /> : null}
            <Text fontSize="$2">Save metadata</Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}
