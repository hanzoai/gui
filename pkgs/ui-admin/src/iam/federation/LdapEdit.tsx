// LdapEdit — port of upstream LdapEditPage.
//
// Ported from `iam/web/src/LdapEditPage.tsx` (Casdoor fork). Style
// shifts from Tailwind grid to @hanzo/gui primitives; behaviour is
// preserved one-to-one. The backend still expects PUT against
// `/v1/iam/ldap/<id>` with the Ldap shape.

import { useEffect, useState, type ReactNode } from 'react'
import {
  Button,
  Card,
  H3,
  Input,
  Select,
  Separator,
  Switch,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Loading, ErrorState } from '../../primitives/Empty'
import { useFetch, apiPost } from '../../data/useFetch'
import { LabelRow } from './LabelRow'
import type { Ldap, IamItemResponse } from './types'

export interface LdapEditProps {
  ldapId: string
  organizationName: string
  // Called after a successful save when the user clicked "Save & Exit".
  // Parent owns navigation; the page never imports a router.
  onExit?: () => void
  // Called when the user clicks "Sync LDAP". Parent decides what
  // route that is.
  onOpenSync?: (orgName: string, ldapId: string) => void
}

const PASSWORD_TYPES = ['Plain', 'SSHA', 'MD5'] as const

export function LdapEdit({ ldapId, organizationName, onExit, onOpenSync }: LdapEditProps) {
  const url = `/v1/iam/ldap/${encodeURIComponent(organizationName)}/${encodeURIComponent(ldapId)}`
  const { data, error, isLoading, mutate } = useFetch<IamItemResponse<Ldap>>(url)

  const [draft, setDraft] = useState<Ldap | undefined>(undefined)
  // Password is held separately from the draft so we never write a
  // server-side value into it. An empty `passwordEdit` means "leave
  // unchanged"; any non-empty value is sent on save.
  const [passwordEdit, setPasswordEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<Error | undefined>(undefined)

  useEffect(() => {
    if (data?.data) setDraft(data.data)
  }, [data])

  if (isLoading) return <Loading label="Loading LDAP server" />
  if (error) return <ErrorState error={error} />
  if (!draft) return null

  const update = <K extends keyof Ldap>(key: K, value: Ldap[K]) =>
    setDraft({ ...draft, [key]: value })

  const submit = async (exit: boolean) => {
    setSaving(true)
    setSaveError(undefined)
    try {
      const payload: Ldap = passwordEdit
        ? { ...draft, password: passwordEdit }
        : { ...draft, password: '' }
      await apiPost<IamItemResponse<Ldap>>(url, payload)
      setPasswordEdit('')
      await mutate()
      if (exit) onExit?.()
    } catch (e) {
      setSaveError(e instanceof Error ? e : new Error(String(e)))
    } finally {
      setSaving(false)
    }
  }

  return (
    <YStack gap="$5">
      <Card bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack items="center" justify="space-between" px="$5" py="$3.5">
          <H3 size="$5" color="$color">
            Edit LDAP
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
              onPress={() => onOpenSync?.(draft.owner, draft.id)}
            >
              Sync LDAP
            </Button>
          </XStack>
        </XStack>
        <Separator />
        <YStack gap="$4" p="$5">
          <LabelRow label="Organization">
            <Input value={draft.owner} onChangeText={(v: string) => update('owner', v)} />
          </LabelRow>
          <LabelRow label="ID">
            <Input value={draft.id} disabled opacity={0.6} />
          </LabelRow>
          {(
            [
              ['Server name', 'serverName'],
              ['Server host', 'host'],
              ['Base DN', 'baseDn'],
              ['Search Filter', 'filter'],
              ['Admin', 'username'],
            ] as Array<[string, keyof Ldap]>
          ).map(([label, key]) => (
            <LabelRow key={String(key)} label={label}>
              <Input
                value={String(draft[key] ?? '')}
                onChangeText={(v: string) => update(key, v as never)}
              />
            </LabelRow>
          ))}
          <LabelRow label="Server port">
            <Input
              keyboardType="numeric"
              width={160}
              value={String(draft.port)}
              onChangeText={(v: string) => update('port', clampPort(v))}
            />
          </LabelRow>
          <LabelRow label="Enable SSL">
            <Switch
              size="$2"
              checked={draft.enableSsl}
              onCheckedChange={(c: boolean) => update('enableSsl', c)}
            >
              <Switch.Thumb />
            </Switch>
          </LabelRow>
          <LabelRow label="Allow self-signed certificate">
            <Switch
              size="$2"
              checked={draft.allowSelfSignedCert}
              onCheckedChange={(c: boolean) => update('allowSelfSignedCert', c)}
            >
              <Switch.Thumb />
            </Switch>
          </LabelRow>
          <LabelRow label="Admin Password">
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
          <LabelRow label="Password type">
            <SelectInline
              value={draft.passwordType}
              options={PASSWORD_TYPES.map((t) => ({ value: t, label: t }))}
              onChange={(v) => update('passwordType', v as Ldap['passwordType'])}
            />
          </LabelRow>
          <LabelRow label="Auto Sync">
            <XStack gap="$2" items="center">
              <Input
                keyboardType="numeric"
                width={120}
                value={String(draft.autoSync)}
                onChangeText={(v: string) =>
                  update('autoSync', Math.max(0, Number.parseInt(v, 10) || 0))
                }
              />
              <Text fontSize="$2" color="$placeholderColor">
                mins
              </Text>
              {draft.autoSync > 0 ? (
                <Text fontSize="$2" color="#fbbf24">
                  Auto-sync will mirror users into the selected organization.
                </Text>
              ) : null}
            </XStack>
          </LabelRow>
        </YStack>
      </Card>
      {saveError ? <ErrorState error={saveError} /> : null}
    </YStack>
  )
}

function clampPort(raw: string): number {
  const n = Number.parseInt(raw, 10) || 0
  if (n < 0) return 0
  if (n > 65535) return 65535
  return n
}

interface InlineOption {
  value: string
  label: ReactNode
}

interface SelectInlineProps {
  value: string
  options: InlineOption[]
  onChange: (v: string) => void
  width?: number | '100%'
}

export function SelectInline({ value, options, onChange, width = '100%' }: SelectInlineProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <Select.Trigger width={width} iconAfter={ChevronDown}>
        <Select.Value />
      </Select.Trigger>
      <Select.Content zIndex={2_000_000}>
        <Select.Viewport>
          {options.map((opt, idx) => (
            <Select.Item key={opt.value} index={idx} value={opt.value}>
              <Select.ItemText>{opt.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Viewport>
      </Select.Content>
    </Select>
  )
}
