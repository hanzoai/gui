// WebhookEdit — port of upstream WebhookEditPage.
//
// SECURITY: the HMAC signing secret is a write-only field. We hold
// it in a separate `secretEdit` state, never hydrate it from the
// server response, and only include it in the payload when
// non-empty. The @hanzo/gui `Input` with `secureTextEntry` masks the
// glyphs while the value sits in component state — but the value
// itself never round-trips. After save the input is cleared and
// the placeholder hint reverts. Upstream Casdoor echoed the secret
// in plain `<input>`s; that regression is closed here.

import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  H3,
  Input,
  Separator,
  Switch,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost, apiDelete } from '../../data/useFetch'
import { LabelRow } from './LabelRow'
import { SelectInline } from './LdapEdit'
import type { IamItemResponse, Webhook, WebhookHeader } from './types'

export interface WebhookEditProps {
  owner: string
  name: string
  onExit?: () => void
}

const PREVIEW_TEMPLATE = {
  id: 9078,
  owner: 'built-in',
  name: '68f55b28-7380-46b1-9bde-64fe1576e3b3',
  organization: 'built-in',
  clientIp: '198.51.100.42',
  user: 'admin',
  method: 'POST',
  requestUri: '/v1/iam/applications',
  action: 'login',
  isTriggered: false,
  object: '{}',
}

export function WebhookEdit({ owner, name, onExit }: WebhookEditProps) {
  const url = `/v1/iam/webhooks/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const { data, error, isLoading, mutate } = useFetch<IamItemResponse<Webhook>>(url)

  const [draft, setDraft] = useState<Webhook | undefined>(undefined)
  // Write-only — never hydrated from the server, never echoed back
  // after save (we clear it in `submit`).
  const [secretEdit, setSecretEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (data?.data) setDraft(data.data)
  }, [data])

  if (isLoading) return <Loading label="Loading webhook" />
  if (error) return <ErrorState error={error} />
  if (!draft) return null

  const update = <K extends keyof Webhook>(k: K, v: Webhook[K]) => setDraft({ ...draft, [k]: v })

  const submit = async (exit: boolean) => {
    setSaving(true)
    setSaveError(undefined)
    try {
      const payload: Webhook = { ...draft, secret: secretEdit || '' }
      await apiPost(url, payload)
      setSecretEdit('')
      await mutate()
      if (exit) onExit?.()
    } catch (e) {
      setSaveError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setSaving(false)
    }
  }

  const previewText = JSON.stringify(PREVIEW_TEMPLATE, null, 2)

  return (
    <YStack gap="$5">
      <Card bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack items="center" justify="space-between" px="$5" py="$3.5">
          <H3 size="$5" color="$color">
            Edit Webhook
          </H3>
          <XStack gap="$2">
            <Button size="$3" variant="outlined" disabled={saving} onPress={() => submit(false)}>
              <Save size={14} /> Save
            </Button>
            <Button size="$3" disabled={saving} onPress={() => submit(true)}>
              Save & Exit
            </Button>
            <Button
              size="$3"
              variant="outlined"
              onPress={async () => {
                if (!window.confirm(`Delete webhook "${draft.name}"?`)) return
                await apiDelete(url)
                onExit?.()
              }}
            >
              Delete
            </Button>
          </XStack>
        </XStack>
        <Separator />
        <YStack gap="$4" p="$5">
          <LabelRow label="Organization">
            <Input
              value={draft.organization}
              onChangeText={(v: string) => update('organization', v)}
            />
          </LabelRow>
          <LabelRow label="Name">
            <Input value={draft.name} onChangeText={(v: string) => update('name', v)} />
          </LabelRow>
          <LabelRow label="URL">
            <Input value={draft.url} onChangeText={(v: string) => update('url', v)} />
          </LabelRow>
          <LabelRow label="Method">
            <SelectInline
              value={draft.method}
              options={['POST', 'GET', 'PUT', 'DELETE'].map((m) => ({ value: m, label: m }))}
              onChange={(v) => update('method', v as Webhook['method'])}
            />
          </LabelRow>
          <LabelRow label="Content type">
            <SelectInline
              value={draft.contentType}
              options={[
                { value: 'application/json', label: 'application/json' },
                {
                  value: 'application/x-www-form-urlencoded',
                  label: 'application/x-www-form-urlencoded',
                },
              ]}
              onChange={(v) => update('contentType', v as Webhook['contentType'])}
            />
          </LabelRow>
          <LabelRow label="Headers" align="start">
            <HeaderEditor
              headers={draft.headers}
              onChange={(next) => update('headers', next)}
            />
          </LabelRow>
          <LabelRow label="Events" align="start">
            <TextArea
              minH={80}
              value={draft.events.join('\n')}
              onChangeText={(v: string) =>
                update(
                  'events',
                  v
                    .split('\n')
                    .map((s) => s.trim())
                    .filter(Boolean),
                )
              }
            />
            <Text mt="$1" fontSize="$1" color="$placeholderColor">
              One event per line.
            </Text>
          </LabelRow>
          <LabelRow label="Signing secret">
            <Input
              secureTextEntry
              autoComplete="off"
              placeholder="Set HMAC secret"
              value={secretEdit}
              onChangeText={setSecretEdit}
            />
            <Text mt="$1.5" fontSize="$1" color="$placeholderColor">
              Write-only. The secret is hashed server-side and never returned.
            </Text>
          </LabelRow>
          <LabelRow label="User-extended payload">
            <Switch
              size="$2"
              checked={draft.isUserExtended}
              onCheckedChange={(c: boolean) => update('isUserExtended', c)}
            >
              <Switch.Thumb />
            </Switch>
          </LabelRow>
          <LabelRow label="Single org only">
            <Switch
              size="$2"
              checked={draft.singleOrgOnly}
              onCheckedChange={(c: boolean) => update('singleOrgOnly', c)}
            >
              <Switch.Thumb />
            </Switch>
          </LabelRow>
          <LabelRow label="Enabled">
            <Switch
              size="$2"
              checked={draft.isEnabled}
              onCheckedChange={(c: boolean) => update('isEnabled', c)}
            >
              <Switch.Thumb />
            </Switch>
          </LabelRow>
          <LabelRow label="Preview" align="start">
            <TextArea minH={220} value={previewText} editable={false} />
          </LabelRow>
        </YStack>
      </Card>
      {saveError ? <ErrorState error={saveError} /> : null}
    </YStack>
  )
}

interface HeaderEditorProps {
  headers: WebhookHeader[]
  onChange: (next: WebhookHeader[]) => void
}

function HeaderEditor({ headers, onChange }: HeaderEditorProps) {
  return (
    <YStack gap="$2">
      {headers.map((h, i) => (
        <XStack key={i} gap="$2">
          <Input
            flex={1}
            placeholder="Name"
            value={h.name}
            onChangeText={(v: string) =>
              onChange(headers.map((x, j) => (j === i ? { ...x, name: v } : x)))
            }
          />
          <Input
            flex={2}
            placeholder="Value"
            value={h.value}
            onChangeText={(v: string) =>
              onChange(headers.map((x, j) => (j === i ? { ...x, value: v } : x)))
            }
          />
          <Button
            size="$2"
            variant="outlined"
            onPress={() => onChange(headers.filter((_, j) => j !== i))}
          >
            Remove
          </Button>
        </XStack>
      ))}
      <XStack>
        <Button size="$2" onPress={() => onChange([...headers, { name: '', value: '' }])}>
          Add header
        </Button>
      </XStack>
    </YStack>
  )
}
