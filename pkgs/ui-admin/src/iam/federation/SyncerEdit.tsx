// SyncerEdit — port of upstream SyncerEditPage. Bind password is a
// write-only field: the input is held in `passwordEdit` state, never
// hydrated from the server, and only included in the payload when
// non-empty. Test connection is a server round-trip; the result is
// surfaced inline.

import { useEffect, useState } from 'react'
import { Button, Card, H3, Input, Separator, Switch, Text, TextArea, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost, apiDelete } from '../../data/useFetch'
import { LabelRow } from './LabelRow'
import { SelectInline } from './LdapEdit'
import type { IamItemResponse, Syncer, SyncerType } from './types'

export interface SyncerEditProps {
  owner: string
  name: string
  onExit?: () => void
}

const SYNCER_TYPES: SyncerType[] = [
  'Database',
  'Keycloak',
  'WeCom',
  'Azure AD',
  'Active Directory',
  'Google Workspace',
  'DingTalk',
  'Lark',
  'Okta',
  'SCIM',
  'AWS IAM',
]

const NON_DB_TYPES: SyncerType[] = [
  'WeCom',
  'Azure AD',
  'Google Workspace',
  'DingTalk',
  'Lark',
  'Okta',
  'SCIM',
  'AWS IAM',
]

export function SyncerEdit({ owner, name, onExit }: SyncerEditProps) {
  const url = `/v1/iam/syncers/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const { data, error, isLoading, mutate } = useFetch<IamItemResponse<Syncer>>(url)

  const [draft, setDraft] = useState<Syncer | undefined>(undefined)
  const [passwordEdit, setPasswordEdit] = useState('')
  const [sshPasswordEdit, setSshPasswordEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState<'idle' | 'pending' | 'ok' | 'err'>('idle')
  const [testMsg, setTestMsg] = useState('')
  const [saveError, setSaveError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (data?.data) setDraft(data.data)
  }, [data])

  if (isLoading) return <Loading label="Loading syncer" />
  if (error) return <ErrorState error={error} />
  if (!draft) return null

  const isNonDb = NON_DB_TYPES.includes(draft.type)
  const update = <K extends keyof Syncer>(k: K, v: Syncer[K]) => setDraft({ ...draft, [k]: v })

  const submit = async (exit: boolean) => {
    setSaving(true)
    setSaveError(undefined)
    try {
      // Omit `password` and `sshPassword` from the payload when blank so
      // the server keeps the stored credentials. Sending `''` would
      // wipe them — that's the upstream Casdoor regression we close here.
      const base: Record<string, unknown> = { ...draft }
      delete base.password
      delete base.sshPassword
      if (passwordEdit) base.password = passwordEdit
      if (sshPasswordEdit) base.sshPassword = sshPasswordEdit
      const payload = base as Syncer | Omit<Syncer, 'password' | 'sshPassword'>
      await apiPost(url, payload)
      setPasswordEdit('')
      setSshPasswordEdit('')
      await mutate()
      if (exit) onExit?.()
    } catch (e) {
      setSaveError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setSaving(false)
    }
  }

  const testConnection = async () => {
    setTesting('pending')
    setTestMsg('')
    try {
      // Mirror the save semantics: send the password only when the user
      // typed one. Otherwise the server uses the stored credential to
      // run the probe — never echo the server-supplied password back.
      const base: Record<string, unknown> = { ...draft }
      delete base.password
      if (passwordEdit) base.password = passwordEdit
      const r = await apiPost<{ status: string; msg?: string }>(
        `${url}/test`,
        base,
      )
      if (r.status === 'ok') {
        setTesting('ok')
        setTestMsg('Connected.')
      } else {
        setTesting('err')
        setTestMsg(r.msg ?? 'Connection failed.')
      }
    } catch (e) {
      setTesting('err')
      setTestMsg(e instanceof Error ? e.message : String(e))
    }
  }

  return (
    <YStack gap="$5">
      <Card bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack items="center" justify="space-between" px="$5" py="$3.5">
          <H3 size="$5" color="$color">
            Edit Syncer
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
                if (!window.confirm(`Delete syncer "${draft.name}"?`)) return
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
            <Input value={draft.organization} onChangeText={(v: string) => update('organization', v)} />
          </LabelRow>
          <LabelRow label="Name">
            <Input value={draft.name} onChangeText={(v: string) => update('name', v)} />
          </LabelRow>
          <LabelRow label="Type">
            <SelectInline
              value={draft.type}
              options={SYNCER_TYPES.map((t) => ({ value: t, label: t }))}
              onChange={(v) => update('type', v as SyncerType)}
            />
          </LabelRow>
          {!isNonDb && draft.type !== 'Active Directory' && (
            <LabelRow label="Database type">
              <SelectInline
                value={draft.databaseType || 'mysql'}
                options={[
                  { value: 'mysql', label: 'MySQL' },
                  { value: 'postgres', label: 'PostgreSQL' },
                  { value: 'mssql', label: 'SQL Server' },
                  { value: 'oracle', label: 'Oracle' },
                  { value: 'sqlite3', label: 'SQLite 3' },
                ]}
                onChange={(v) => update('databaseType', v as Syncer['databaseType'])}
              />
            </LabelRow>
          )}
          <LabelRow label="Host">
            <Input value={draft.host} onChangeText={(v: string) => update('host', v)} />
          </LabelRow>
          {!isNonDb && (
            <LabelRow label="Port">
              <Input
                width={160}
                keyboardType="numeric"
                value={String(draft.port)}
                onChangeText={(v: string) => update('port', Number.parseInt(v, 10) || 0)}
              />
            </LabelRow>
          )}
          <LabelRow label="User">
            <Input value={draft.user} onChangeText={(v: string) => update('user', v)} />
          </LabelRow>
          <LabelRow label="Password">
            <Input
              secureTextEntry
              autoComplete="off"
              placeholder={draft.password ? '••••••••' : 'Set bind password'}
              value={passwordEdit}
              onChangeText={setPasswordEdit}
            />
            <Text mt="$1.5" fontSize="$1" color="$placeholderColor">
              Leave empty to keep the current password.
            </Text>
          </LabelRow>
          {!isNonDb && (
            <LabelRow label="Database">
              <Input
                value={draft.database}
                onChangeText={(v: string) => update('database', v)}
              />
            </LabelRow>
          )}
          {!isNonDb && (
            <LabelRow label="Table">
              <Input value={draft.table} onChangeText={(v: string) => update('table', v)} />
            </LabelRow>
          )}
          <LabelRow label="Sync interval">
            <Input
              width={160}
              keyboardType="numeric"
              value={String(draft.syncInterval)}
              onChangeText={(v: string) =>
                update('syncInterval', Math.max(0, Number.parseInt(v, 10) || 0))
              }
            />
          </LabelRow>
          <LabelRow label="SSH" align="start">
            <YStack gap="$2">
              <SelectInline
                value={draft.sshType || ''}
                options={[
                  { value: '', label: 'None' },
                  { value: 'password', label: 'Password' },
                  { value: 'cert', label: 'Cert' },
                ]}
                onChange={(v) => update('sshType', v as Syncer['sshType'])}
              />
              {draft.sshType ? (
                <YStack gap="$2">
                  <Input
                    placeholder="SSH host"
                    value={draft.sshHost}
                    onChangeText={(v: string) => update('sshHost', v)}
                  />
                  <Input
                    placeholder="SSH port"
                    width={160}
                    keyboardType="numeric"
                    value={String(draft.sshPort || 22)}
                    onChangeText={(v: string) =>
                      update('sshPort', Number.parseInt(v, 10) || 22)
                    }
                  />
                  <Input
                    placeholder="SSH user"
                    value={draft.sshUser}
                    onChangeText={(v: string) => update('sshUser', v)}
                  />
                  {draft.sshType === 'password' ? (
                    <Input
                      secureTextEntry
                      placeholder="SSH password"
                      value={sshPasswordEdit}
                      onChangeText={setSshPasswordEdit}
                    />
                  ) : (
                    <Input
                      placeholder="SSH cert name"
                      value={draft.cert}
                      onChangeText={(v: string) => update('cert', v)}
                    />
                  )}
                </YStack>
              ) : null}
            </YStack>
          </LabelRow>
          <LabelRow label="Test connection">
            <XStack gap="$2" items="center">
              <Button size="$3" disabled={testing === 'pending'} onPress={testConnection}>
                {testing === 'pending' ? 'Testing…' : 'Test'}
              </Button>
              {testMsg ? (
                <Text fontSize="$2" color={testing === 'ok' ? '#4ade80' : '#f87171'}>
                  {testMsg}
                </Text>
              ) : null}
            </XStack>
          </LabelRow>
          <LabelRow label="Affiliation table">
            <Input
              value={draft.affiliationTable}
              onChangeText={(v: string) => update('affiliationTable', v)}
            />
          </LabelRow>
          <LabelRow label="Avatar base URL">
            <Input
              value={draft.avatarBaseUrl}
              onChangeText={(v: string) => update('avatarBaseUrl', v)}
            />
          </LabelRow>
          <LabelRow label="Error text" align="start">
            <TextArea
              minH={120}
              value={draft.errorText || ''}
              onChangeText={(v: string) => update('errorText', v)}
            />
          </LabelRow>
          <LabelRow label="Read-only">
            <Switch
              size="$2"
              checked={draft.isReadOnly}
              onCheckedChange={(c: boolean) => update('isReadOnly', c)}
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
        </YStack>
      </Card>
      {saveError ? <ErrorState error={saveError} /> : null}
    </YStack>
  )
}
