// Server editor — single MCP server. Inputs for org / name / display
// name / URL / token / application; the tool list is summarized inline
// because the upstream `ToolTable` carries its own deep dependencies.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Input,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { useFetch } from '../../data/useFetch'
import { ServerUrls, type ItemResponse, type ServerItem } from './api'
import { type AdminAccount, isAdminAccount } from './types'

export interface ServerEditProps {
  account: AdminAccount
}

export function ServerEdit({ account }: ServerEditProps) {
  const nav = useNavigate()
  const params = useParams<{ owner: string; serverName: string }>()
  const owner = params.owner ?? ''
  const serverName = params.serverName ?? ''

  const url = useMemo(
    () => ServerUrls.one(owner, serverName),
    [owner, serverName],
  )
  const { data, isLoading, error } = useFetch<ItemResponse<ServerItem>>(url)

  const [server, setServer] = useState<ServerItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) setServer(data.data)
  }, [data])

  const update = useCallback(
    <K extends keyof ServerItem>(key: K, value: ServerItem[K]) => {
      setServer((prev) => (prev ? { ...prev, [key]: value } : prev))
    },
    [],
  )

  const submitEdit = useCallback(
    async (exit: boolean) => {
      if (!server) return
      setSaving(true)
      setSaveError(null)
      try {
        const res = await fetch(ServerUrls.update(owner, serverName), {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(server),
        })
        if (!res.ok) throw new Error(`save failed: ${res.status}`)
        if (exit) nav('/servers')
        else nav(`/servers/${server.owner}/${server.name}`)
      } catch (e) {
        setSaveError(e instanceof Error ? e.message : 'save failed')
      } finally {
        setSaving(false)
      }
    },
    [nav, owner, server, serverName],
  )

  if (isLoading || !server) {
    return (
      <YStack p="$4">
        <Text color="$placeholderColor">
          {error ? `Could not load: ${error.message}` : 'Loading server...'}
        </Text>
      </YStack>
    )
  }

  // The MCP base URL is the deterministic upstream of this server.
  const baseUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/api/server/${server.owner}/${server.name}`

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
          Edit MCP Server
        </Text>
        <XStack gap="$2">
          <Button disabled={saving} onPress={() => submitEdit(false)}>
            Save
          </Button>
          <Button
            theme="blue"
            disabled={saving}
            onPress={() => submitEdit(true)}
          >
            Save &amp; Exit
          </Button>
        </XStack>
      </XStack>

      {saveError ? (
        <Text fontSize="$2" color="#fca5a5" px="$4">
          {saveError}
        </Text>
      ) : null}

      <YStack p="$4" gap="$4">
        <Field label="Organization">
          <Input
            value={server.owner}
            disabled={!isAdminAccount(account)}
            onChangeText={(v) => update('owner', v)}
          />
        </Field>
        <Field label="Name">
          <Input
            value={server.name}
            onChangeText={(v) => update('name', v)}
          />
        </Field>
        <Field label="Display name">
          <Input
            value={server.displayName}
            onChangeText={(v) => update('displayName', v)}
          />
        </Field>
        <Field label="URL">
          <Input
            value={server.url}
            onChangeText={(v) => update('url', v)}
          />
        </Field>
        <Field label="Access token">
          <Input
            value={server.token ?? ''}
            secureTextEntry
            placeholder="***"
            onChangeText={(v) => update('token', v)}
          />
        </Field>
        <Field label="Application">
          <Input
            value={server.application}
            onChangeText={(v) => update('application', v)}
          />
        </Field>
        <Field label="Tools">
          <Text fontSize="$2" color="$placeholderColor">
            {server.tools?.length ?? 0} tool(s) configured.
          </Text>
        </Field>
        <Field label="Base URL">
          <Input value={baseUrl} disabled />
        </Field>
      </YStack>
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
