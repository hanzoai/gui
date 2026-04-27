// Site editor — single Site config. Many fields, all of them straight
// inputs; the upstream `RuleTable` (rules to apply at this site) is
// rendered as a JSON list summary. The full inline rule editor is a
// separate primitive; this port keeps the focus on the site-level
// fields and links the rules out to the rule list.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Input,
  Select,
  Switch,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { useFetch } from '../../data/useFetch'
import { SiteUrls, type ItemResponse, type SiteItem } from './api'
import { type AdminAccount, isAdminAccount } from './types'

const SSL_MODES: SiteItem['sslMode'][] = [
  'HTTP',
  'HTTPS and HTTP',
  'HTTPS Only',
  'Static Folder',
]

const STATUSES: SiteItem['status'][] = ['Active', 'Inactive']

export interface SiteEditProps {
  account: AdminAccount
}

export function SiteEdit({ account }: SiteEditProps) {
  const nav = useNavigate()
  const params = useParams<{ owner: string; siteName: string }>()
  const owner = params.owner ?? ''
  const siteName = params.siteName ?? ''

  const url = useMemo(() => SiteUrls.one(owner, siteName), [owner, siteName])
  const { data, isLoading, error } = useFetch<ItemResponse<SiteItem>>(url)

  const [site, setSite] = useState<SiteItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) setSite(data.data)
  }, [data])

  const update = useCallback(
    <K extends keyof SiteItem>(key: K, value: SiteItem[K]) => {
      setSite((prev) => (prev ? { ...prev, [key]: value } : prev))
    },
    [],
  )

  const submitEdit = useCallback(async () => {
    if (!site) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch(SiteUrls.update(owner, siteName), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site),
      })
      if (!res.ok) throw new Error(`save failed: ${res.status}`)
      nav(`/sites/${site.owner}/${site.name}`)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'save failed')
    } finally {
      setSaving(false)
    }
  }, [nav, owner, site, siteName])

  if (isLoading || !site) {
    return (
      <YStack p="$4">
        <Text color="$placeholderColor">
          {error ? `Could not load: ${error.message}` : 'Loading site...'}
        </Text>
      </YStack>
    )
  }

  const adminCanChangeOrg = isAdminAccount(account)

  return (
    <YStack gap="$4">
      <XStack
        items="center"
        justify="space-between"
        p="$4"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Text fontSize="$6" fontWeight="600" color="$color">
          Edit Site
        </Text>
        <Button disabled={saving} onPress={submitEdit}>
          Save
        </Button>
      </XStack>

      {saveError ? (
        <Text fontSize="$2" color="#fca5a5" px="$4">
          {saveError}
        </Text>
      ) : null}

      <YStack p="$4" gap="$4">
        <Field label="Organization">
          <Input
            value={site.owner}
            disabled={!adminCanChangeOrg}
            onChangeText={(v) => update('owner', v)}
          />
        </Field>
        {(['name', 'displayName', 'tag', 'domain', 'host'] as const).map((k) => (
          <Field key={k} label={labelFor(k)}>
            <Input
              value={(site[k] as string | undefined) ?? ''}
              onChangeText={(v) => update(k, v as SiteItem[typeof k])}
            />
          </Field>
        ))}
        <Field label="Port">
          <Input
            value={String(site.port ?? 0)}
            onChangeText={(v) => update('port', parseInt(v, 10) || 0)}
            keyboardType="numeric"
          />
        </Field>
        {(
          ['needRedirect', 'disableVerbose', 'enableAlert'] as const
        ).map((k) => (
          <Field key={k} label={labelFor(k)}>
            <Switch
              checked={Boolean(site[k])}
              onCheckedChange={(v: boolean) =>
                update(k, v as SiteItem[typeof k])
              }
            >
              <Switch.Thumb />
            </Switch>
          </Field>
        ))}
        <Field label="Public IP">
          <Input value={site.publicIp ?? ''} disabled />
        </Field>
        <Field label="SSL mode">
          <Select
            value={site.sslMode ?? 'HTTPS Only'}
            onValueChange={(v) =>
              update('sslMode', v as SiteItem['sslMode'])
            }
          >
            <Select.Trigger>
              <Select.Value placeholder="Select SSL mode" />
            </Select.Trigger>
            <Select.Content>
              {SSL_MODES.map((m, i) =>
                m ? (
                  <Select.Item key={m} value={m} index={i}>
                    <Select.ItemText>{m}</Select.ItemText>
                  </Select.Item>
                ) : null,
              )}
            </Select.Content>
          </Select>
        </Field>
        <Field label="Status">
          <Select
            value={site.status ?? 'Active'}
            onValueChange={(v) =>
              update('status', v as SiteItem['status'])
            }
          >
            <Select.Trigger>
              <Select.Value placeholder="Select status" />
            </Select.Trigger>
            <Select.Content>
              {STATUSES.map((s, i) =>
                s ? (
                  <Select.Item key={s} value={s} index={i}>
                    <Select.ItemText>{s}</Select.ItemText>
                  </Select.Item>
                ) : null,
              )}
            </Select.Content>
          </Select>
        </Field>
        <Field label="Rules">
          <Text fontSize="$2" color="$placeholderColor">
            {site.rules?.length ?? 0} rule(s) attached. Edit individual
            rules from the Rules page.
          </Text>
        </Field>
      </YStack>
    </YStack>
  )
}

function labelFor(k: string): string {
  switch (k) {
    case 'displayName':
      return 'Display name'
    case 'needRedirect':
      return 'Need redirect'
    case 'disableVerbose':
      return 'Disable verbose'
    case 'enableAlert':
      return 'Enable alert'
    default:
      return k.charAt(0).toUpperCase() + k.slice(1)
  }
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <XStack gap="$3" items="center">
      <YStack width={160}>
        <Text fontSize="$2" color="$placeholderColor">
          {label}
        </Text>
      </YStack>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}
