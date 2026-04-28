// AdapterEdit — port of upstream AdapterEditPage.
//
// useSameDb=true reuses IAM's platform DB and zeroes out the
// connection fields. Toggling off populates sensible mysql
// defaults that the user can override. Test connection hits
// /v1/iam/adapters/{owner}/{name}/policies and surfaces the
// success/failure message inline (no global toast in this port).

import { useEffect, useState } from 'react'
import { Button, H3, Input, Spinner, Switch, Text, XStack, YStack } from 'hanzogui'
import { ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost } from '../../data/useFetch'
import type { Adapter, AdapterDatabaseType, IamItemResponse } from './types'

export interface AdapterEditProps {
  owner: string
  name: string
  builtIns?: ReadonlySet<string>
  onClose: (saved: boolean) => void
  fetcher?: (url: string) => Promise<unknown>
}

const DEFAULT_BUILTINS = new Set<string>()

const DB_TYPES: { id: AdapterDatabaseType; label: string }[] = [
  { id: 'mysql', label: 'MySQL' },
  { id: 'postgres', label: 'PostgreSQL' },
  { id: 'mssql', label: 'SQL Server' },
  { id: 'oracle', label: 'Oracle' },
  { id: 'sqlite3', label: 'SQLite 3' },
]

export function AdapterEdit({
  owner,
  name,
  builtIns = DEFAULT_BUILTINS,
  onClose,
  fetcher,
}: AdapterEditProps) {
  const url = `/v1/iam/adapters/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`
  const { data, error, isLoading } = useFetch<IamItemResponse<Adapter>>(url, { fetcher })
  const [draft, setDraft] = useState<Adapter | null>(null)
  // Write-only — the DB bind password is held here and never hydrated
  // from the server. An empty string means "leave the stored value
  // alone"; any non-empty value is sent on save and then cleared.
  // Same pattern as LdapEdit / SyncerEdit / WebhookEdit.
  const [passwordEdit, setPasswordEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [testStatus, setTestStatus] = useState<
    | { kind: 'idle' }
    | { kind: 'pending' }
    | { kind: 'ok' }
    | { kind: 'error'; msg: string }
  >({ kind: 'idle' })

  useEffect(() => {
    if (data?.data) setDraft(data.data)
  }, [data])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !draft)
    return (
      <XStack p="$5" items="center" justify="center">
        <Spinner size="small" />
      </XStack>
    )

  const isBuiltIn = builtIns.has(draft.name)
  const showConnFields = !draft.useSameDb && !isBuiltIn

  function update<K extends keyof Adapter>(key: K, value: Adapter[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev))
  }

  function toggleSameDb(next: boolean) {
    update('useSameDb', next)
    setPasswordEdit('')
    if (next) {
      // Match upstream: clear connection fields when reusing.
      update('type', '')
      update('databaseType', undefined)
      update('host', '')
      update('port', 0)
      update('user', '')
      update('database', '')
    } else {
      // Sensible defaults so the form isn't empty.
      update('type', 'Database')
      update('databaseType', 'mysql')
      update('host', 'localhost')
      update('port', 3306)
      update('user', 'root')
      update('database', 'casbin')
    }
  }

  async function save(exit: boolean) {
    if (!draft) return
    setSaving(true)
    setSaveError(null)
    try {
      const payload: Adapter | Omit<Adapter, 'password'> = passwordEdit
        ? { ...draft, password: passwordEdit }
        : (() => {
            const { password: _omit, ...rest } = draft
            return rest
          })()
      await apiPost(url, payload)
      setPasswordEdit('')
      if (exit) onClose(true)
    } catch (e) {
      setSaveError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  async function testConnection() {
    if (!draft) return
    setTestStatus({ kind: 'pending' })
    try {
      // Upstream calls getPolicies for `${owner}/${name}` — equivalent
      // here is a GET on the adapter's policies subresource.
      const res = await fetch(`${url}/policies`, {
        headers: { Accept: 'application/json' },
      })
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { msg?: string } | null
        setTestStatus({ kind: 'error', msg: body?.msg ?? `HTTP ${res.status}` })
        return
      }
      setTestStatus({ kind: 'ok' })
    } catch (e) {
      setTestStatus({ kind: 'error', msg: (e as Error).message })
    }
  }

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <H3 size="$6" color="$color">
          {isBuiltIn ? 'View Adapter' : 'Edit Adapter'}
        </H3>
        <XStack gap="$2">
          <Button onPress={() => save(false)} disabled={saving || isBuiltIn}>
            Save
          </Button>
          <Button
            onPress={() => save(true)}
            disabled={saving || isBuiltIn}
            theme={'blue' as never}
          >
            Save & Exit
          </Button>
          <Button onPress={() => onClose(false)} disabled={saving} variant="outlined">
            Cancel
          </Button>
        </XStack>
      </XStack>

      {saveError ? (
        <YStack
          rounded="$2"
          borderWidth={1}
          borderColor="#7f1d1d"
          bg="rgba(239,68,68,0.10)"
          p="$3"
        >
          <Text fontSize="$2" color="#fca5a5">
            {saveError}
          </Text>
        </YStack>
      ) : null}

      <Field label="Organization">
        <Input value={draft.owner} disabled />
      </Field>
      <Field label="Name">
        <Input
          value={draft.name}
          disabled={isBuiltIn}
          onChangeText={(v: string) => update('name', v)}
        />
      </Field>
      <Field label="Table">
        <Input
          value={draft.table}
          disabled={isBuiltIn}
          onChangeText={(v: string) => update('table', v)}
        />
      </Field>
      <Field label="Use same DB">
        <Switch
          checked={draft.useSameDb || isBuiltIn}
          disabled={isBuiltIn}
          onCheckedChange={toggleSameDb}
        >
          <Switch.Thumb />
        </Switch>
      </Field>

      {showConnFields ? (
        <>
          <Field label="DB type">
            <XStack gap="$2" flexWrap={'wrap' as never}>
              {DB_TYPES.map((db) => (
                <Button
                  key={db.id}
                  size="$2"
                  theme={(draft.databaseType === db.id ? 'blue' : undefined) as never}
                  onPress={() => update('databaseType', db.id)}
                >
                  {db.label}
                </Button>
              ))}
            </XStack>
          </Field>
          <Field label="Host">
            <Input
              value={draft.host ?? ''}
              onChangeText={(v: string) => update('host', v)}
            />
          </Field>
          <Field label="User">
            <Input
              value={draft.user ?? ''}
              onChangeText={(v: string) => update('user', v)}
            />
          </Field>
          <Field label="Password">
            <Input
              value={passwordEdit}
              onChangeText={setPasswordEdit}
              placeholder={draft.password ? '••••••••' : 'Set bind password'}
              autoComplete="off"
              secureTextEntry
            />
            <Text mt="$1.5" fontSize="$1" color="$placeholderColor">
              Leave empty to keep the current password.
            </Text>
          </Field>
          <Field label="Database">
            <Input
              value={draft.database ?? ''}
              onChangeText={(v: string) => update('database', v)}
            />
          </Field>
          <Field label="Port">
            <Input
              keyboardType={'number-pad' as never}
              value={String(draft.port ?? 0)}
              onChangeText={(v: string) => {
                const n = parseInt(v, 10)
                update('port', Number.isFinite(n) ? Math.max(0, Math.min(65535, n)) : 0)
              }}
              width={140}
            />
          </Field>
        </>
      ) : null}

      <Field label="DB test">
        <XStack gap="$3" items="center">
          <Button onPress={testConnection} disabled={testStatus.kind === 'pending'}>
            {testStatus.kind === 'pending' ? 'Testing…' : 'Test connection'}
          </Button>
          {testStatus.kind === 'ok' ? (
            <Text fontSize="$2" color="#86efac">
              Connection OK
            </Text>
          ) : null}
          {testStatus.kind === 'error' ? (
            <Text fontSize="$2" color="#fca5a5">
              {testStatus.msg}
            </Text>
          ) : null}
        </XStack>
      </Field>
    </YStack>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <XStack gap="$4" items="center">
      <YStack width={160}>
        <Text fontSize="$2" color="$placeholderColor">
          {label}
        </Text>
      </YStack>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}
