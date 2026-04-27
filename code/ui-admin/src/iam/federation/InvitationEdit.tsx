// InvitationEdit — port of upstream InvitationEditPage.

import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Dialog,
  H3,
  Input,
  Separator,
  Text,
  TextArea,
  XStack,
  YStack,
} from 'hanzogui'
import { Copy } from '@hanzogui/lucide-icons-2/icons/Copy'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Send } from '@hanzogui/lucide-icons-2/icons/Send'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost, apiDelete } from '../../data/useFetch'
import { LabelRow } from './LabelRow'
import { SelectInline } from './LdapEdit'
import type { IamItemResponse, Invitation } from './types'

export interface InvitationEditProps {
  owner: string
  name: string
  // The default application slug for sign-up URL composition.
  defaultApplication?: string
  onExit?: () => void
}

export function InvitationEdit({
  owner,
  name,
  defaultApplication = 'app-hanzo',
  onExit,
}: InvitationEditProps) {
  const url = `/v1/iam/invitations/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const { data, error, isLoading, mutate } = useFetch<IamItemResponse<Invitation>>(url)

  const [draft, setDraft] = useState<Invitation | undefined>(undefined)
  const [emails, setEmails] = useState('')
  const [showSend, setShowSend] = useState(false)
  const [sending, setSending] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<Error | undefined>(undefined)
  const [copyMsg, setCopyMsg] = useState('')

  useEffect(() => {
    if (data?.data) setDraft(data.data)
  }, [data])

  if (isLoading) return <Loading label="Loading invitation" />
  if (error) return <ErrorState error={error} />
  if (!draft) return null

  const isPlanCreated = draft.tag === 'auto_created_invitation_for_plan'
  const update = <K extends keyof Invitation>(k: K, v: Invitation[K]) =>
    setDraft({ ...draft, [k]: v })

  const submit = async (exit: boolean) => {
    setSaving(true)
    setSaveError(undefined)
    try {
      await apiPost(url, draft)
      await mutate()
      if (exit) onExit?.()
    } catch (e) {
      setSaveError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setSaving(false)
    }
  }

  const copySignupLink = async () => {
    const link = `${window.location.origin}/signup/${defaultApplication}?invitationCode=${draft.defaultCode}`
    try {
      await navigator.clipboard.writeText(link)
      setCopyMsg('Copied.')
      window.setTimeout(() => setCopyMsg(''), 2000)
    } catch {
      setCopyMsg('Copy failed.')
    }
  }

  const validEmails = emails
    .split('\n')
    .map((s) => s.trim())
    .filter(isLikelyEmail)

  const sendInvitations = async () => {
    if (validEmails.length === 0) return
    setSending(true)
    try {
      await apiPost(`${url}/send`, { emails: validEmails })
      setShowSend(false)
      setEmails('')
    } finally {
      setSending(false)
    }
  }

  return (
    <YStack gap="$5">
      <Card bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack items="center" justify="space-between" px="$5" py="$3.5">
          <H3 size="$5" color="$color">
            Edit Invitation
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
                if (!window.confirm(`Delete invitation "${draft.name}"?`)) return
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
              value={draft.owner}
              disabled={isPlanCreated}
              onChangeText={(v: string) => update('owner', v)}
            />
          </LabelRow>
          <LabelRow label="Name">
            <Input
              value={draft.name}
              disabled={isPlanCreated}
              onChangeText={(v: string) => update('name', v)}
            />
          </LabelRow>
          <LabelRow label="Display name">
            <Input
              value={draft.displayName}
              onChangeText={(v: string) => update('displayName', v)}
            />
          </LabelRow>
          <LabelRow label="Code">
            <Input value={draft.code} onChangeText={(v: string) => update('code', v)} />
          </LabelRow>
          <LabelRow label="Default code">
            <Input
              value={draft.defaultCode}
              onChangeText={(v: string) => update('defaultCode', v)}
            />
          </LabelRow>
          <LabelRow label="">
            <XStack gap="$2" items="center">
              <Button size="$2" variant="outlined" onPress={copySignupLink}>
                <Copy size={12} /> Copy signup link
              </Button>
              {copyMsg ? (
                <Text fontSize="$1" color="#4ade80">
                  {copyMsg}
                </Text>
              ) : null}
            </XStack>
          </LabelRow>
          <LabelRow label="Send" align="start">
            <YStack gap="$2">
              <TextArea
                minH={80}
                placeholder="One email per line"
                value={emails}
                onChangeText={setEmails}
              />
              <XStack>
                <Button
                  size="$2"
                  disabled={validEmails.length === 0}
                  onPress={() => setShowSend(true)}
                >
                  <Send size={12} /> Send to {validEmails.length}
                </Button>
              </XStack>
            </YStack>
          </LabelRow>
          <LabelRow label="Quota">
            <Input
              width={120}
              keyboardType="numeric"
              value={String(draft.quota)}
              onChangeText={(v: string) => update('quota', Number.parseInt(v, 10) || 0)}
            />
          </LabelRow>
          <LabelRow label="Used count">
            <Input
              width={120}
              keyboardType="numeric"
              value={String(draft.usedCount)}
              onChangeText={(v: string) => update('usedCount', Number.parseInt(v, 10) || 0)}
            />
          </LabelRow>
          <LabelRow label="Application">
            <Input
              value={draft.application}
              onChangeText={(v: string) => update('application', v)}
            />
          </LabelRow>
          <LabelRow label="State">
            <SelectInline
              value={draft.state}
              options={[
                { value: 'Active', label: 'Active' },
                { value: 'Suspended', label: 'Suspended' },
              ]}
              onChange={(v) => update('state', v as Invitation['state'])}
            />
          </LabelRow>
          {(['username', 'email', 'phone'] as const).map((k) => (
            <LabelRow key={k} label={k[0].toUpperCase() + k.slice(1)}>
              <Input
                value={draft[k] ?? ''}
                onChangeText={(v: string) => update(k, v)}
              />
            </LabelRow>
          ))}
        </YStack>
      </Card>

      <Dialog modal open={showSend} onOpenChange={setShowSend}>
        <Dialog.Portal>
          <Dialog.Overlay
            key="overlay"
            animation="quick"
            opacity={0.6}
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
          <Dialog.Content
            bordered
            elevate
            key="content"
            animation="quick"
            enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.96 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.96 }}
            gap="$3"
            width={500}
          >
            <Dialog.Title>Send invitations</Dialog.Title>
            <Dialog.Description>
              You will email this invitation to {validEmails.length} recipient(s).
            </Dialog.Description>
            <YStack gap="$1" maxH={200} overflow="hidden">
              {validEmails.map((e) => (
                <Text key={e} fontSize="$2" color="$color">
                  {e}
                </Text>
              ))}
            </YStack>
            <XStack gap="$2" justify="flex-end">
              <Button size="$3" variant="outlined" onPress={() => setShowSend(false)}>
                Cancel
              </Button>
              <Button size="$3" disabled={sending} onPress={sendInvitations}>
                {sending ? 'Sending…' : 'Send'}
              </Button>
            </XStack>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog>

      {saveError ? <ErrorState error={saveError} /> : null}
    </YStack>
  )
}

export function isLikelyEmail(s: string): boolean {
  // RFC 5322 is non-trivial; this is the same lightweight check the
  // upstream uses. Backend re-validates on send.
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s)
}
