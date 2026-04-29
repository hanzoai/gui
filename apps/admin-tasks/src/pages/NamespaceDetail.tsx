// Namespace detail — describe view with editable metadata (Edit
// metadata toggle wraps NamespaceMetadataEditor), archival config,
// retention editor, and a custom search-attributes section. Identities
// remain on the second tab.

import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  H1,
  H4,
  Paragraph,
  Popover,
  Spinner,
  Tabs,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronDown } from '@hanzogui/lucide-icons-2/icons/ChevronDown'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Globe } from '@hanzogui/lucide-icons-2/icons/Globe'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Plug } from '@hanzogui/lucide-icons-2/icons/Plug'
import {
  Alert,
  Badge,
  CopyField,
  Empty,
  ErrorState,
  LoadingState,
  humanTTL,
  useFetch,
} from '@hanzogui/admin'
import {
  ApiError,
  Namespaces,
  type Identity,
  type Namespace,
  type SearchAttributesResponse,
} from '../lib/api'
import { NamespaceMetadataEditor } from '../components/namespace/NamespaceMetadataEditor'
import {
  RetentionEditor,
  daysToDuration,
  durationToDays,
} from '../components/namespace/RetentionEditor'

interface NamespaceMetadata {
  summary?: string
  details?: string
  updatedBy?: string
  updatedAt?: string
}

export function NamespaceDetailPage() {
  const { ns } = useParams()
  const url = Namespaces.describeUrl(ns!)
  const { data, error, isLoading, mutate } = useFetch<Namespace>(url)
  const metaUrl = Namespaces.getMetadata(ns!)
  const { data: meta, mutate: mutateMeta } = useFetch<NamespaceMetadata>(metaUrl)

  const [editingMeta, setEditingMeta] = useState(false)

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const { namespaceInfo, config } = data
  const stateRaw = namespaceInfo.state ?? ''
  const active = stateRaw === 'NAMESPACE_STATE_REGISTERED' || stateRaw === 'Registered'
  const state = stateRaw.replace(/^NAMESPACE_STATE_/, '').toLowerCase() || 'unknown'

  return (
    <YStack gap="$5">
      <Link to="/namespaces" style={{ textDecoration: 'none', color: 'inherit' }}>
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            Back to Namespaces
          </Text>
          <Text fontSize="$2" color="$placeholderColor" px="$2">
            |
          </Text>
          <Link
            to={`/namespaces/${encodeURIComponent(ns!)}/workflows`}
            style={{ textDecoration: 'none' }}
          >
            <Text fontSize="$2" color="$placeholderColor" hoverStyle={{ color: '$color' as any }}>
              Go to Workflows
            </Text>
          </Link>
        </XStack>
      </Link>

      <XStack items="flex-start" gap="$3">
        <YStack gap="$1" flex={1}>
          <XStack items="center" gap="$3">
            <H1 size="$8" color="$color" fontWeight="600">
              {namespaceInfo.name}
            </H1>
            <Badge variant={active ? 'success' : 'muted'}>{state}</Badge>
          </XStack>
          {namespaceInfo.description && (
            <Paragraph color="$placeholderColor" fontSize="$2">
              {namespaceInfo.description}
            </Paragraph>
          )}
        </YStack>
        <ConnectDropdown ns={namespaceInfo.name} />
      </XStack>

      <Tabs defaultValue="overview" orientation="horizontal" flexDirection="column">
        <Tabs.List
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          gap="$2"
          self="flex-start"
        >
          <TabTrigger value="overview">Overview</TabTrigger>
          <TabTrigger value="metadata">Metadata</TabTrigger>
          <TabTrigger value="config">Configuration</TabTrigger>
          <TabTrigger value="search-attributes">Search attributes</TabTrigger>
          <TabTrigger value="identities">Identities</TabTrigger>
        </Tabs.List>

        <Tabs.Content value="overview" mt="$4">
          <XStack gap="$3" flexWrap="wrap">
            <StatCard label="Region" flexBasis={220}>
              <XStack items="center" gap="$2">
                <Globe size={14} color="#7e8794" />
                <Text fontSize="$5" fontWeight="500" color="$color">
                  {namespaceInfo.region || 'embedded'}
                </Text>
              </XStack>
            </StatCard>
            <StatCard
              label="Retention Policy"
              hint={config.workflowExecutionRetentionTtl}
              flexBasis={220}
            >
              <Text fontSize="$5" fontWeight="500" color="$color">
                {humanTTL(config.workflowExecutionRetentionTtl)}
              </Text>
            </StatCard>
            <StatCard label="APS Limit" hint="actions per second" flexBasis={220}>
              <Text fontSize="$5" fontWeight="500" color="$color">
                {config.apsLimit.toLocaleString()}
              </Text>
            </StatCard>
            <StatCard label="History archival" flexBasis={220}>
              <ArchivalBadge state={config.historyArchivalState} uri={config.historyArchivalUri} />
            </StatCard>
            <StatCard label="Visibility archival" flexBasis={220}>
              <ArchivalBadge
                state={config.visibilityArchivalState}
                uri={config.visibilityArchivalUri}
              />
            </StatCard>
            <StatCard label="Owner" flexBasis={220}>
              <Text fontSize="$3" fontWeight="500" color="$color" numberOfLines={1}>
                {namespaceInfo.ownerEmail || '—'}
              </Text>
            </StatCard>
          </XStack>
        </Tabs.Content>

        <Tabs.Content value="metadata" mt="$4">
          <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
            {editingMeta ? (
              <NamespaceMetadataEditor
                ns={ns!}
                initialSummary={meta?.summary ?? ''}
                initialDetails={meta?.details ?? ''}
                onCancel={() => setEditingMeta(false)}
                onSaved={async () => {
                  setEditingMeta(false)
                  await mutateMeta()
                }}
              />
            ) : (
              <YStack gap="$3">
                <XStack items="center" justify="space-between" gap="$2">
                  <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
                    NAMESPACE METADATA
                  </Text>
                  <Button size="$2" chromeless onPress={() => setEditingMeta(true)}>
                    <XStack items="center" gap="$1.5">
                      <Pencil size={12} />
                      <Text fontSize="$2">Edit metadata</Text>
                    </XStack>
                  </Button>
                </XStack>
                {meta?.summary || meta?.details ? (
                  <YStack gap="$3">
                    {meta.summary ? (
                      <YStack gap="$1">
                        <Text fontSize="$1" color="$placeholderColor">
                          Summary
                        </Text>
                        <Text fontSize="$3" color="$color">
                          {meta.summary}
                        </Text>
                      </YStack>
                    ) : null}
                    {meta.details ? (
                      <YStack gap="$1">
                        <Text fontSize="$1" color="$placeholderColor">
                          Details
                        </Text>
                        <Text
                          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                          fontSize="$2"
                          color="$color"
                        >
                          {meta.details}
                        </Text>
                      </YStack>
                    ) : null}
                    {meta.updatedAt ? (
                      <Text fontSize="$1" color="$placeholderColor">
                        Last updated{meta.updatedBy ? ` by ${meta.updatedBy}` : ''} ·{' '}
                        {new Date(meta.updatedAt).toLocaleString()}
                      </Text>
                    ) : null}
                  </YStack>
                ) : (
                  <Empty
                    title="No metadata yet"
                    hint="Attach a short summary and a longer details blob to this namespace."
                  />
                )}
              </YStack>
            )}
          </Card>
        </Tabs.Content>

        <Tabs.Content value="config" mt="$4">
          <YStack gap="$4">
            <RetentionPanel ns={ns!} ttl={config.workflowExecutionRetentionTtl} onSaved={mutate} />
            <ArchivalPanel ns={ns!} config={config} onSaved={mutate} />
          </YStack>
        </Tabs.Content>

        <Tabs.Content value="search-attributes" mt="$4">
          <SearchAttributesPanel ns={ns!} />
        </Tabs.Content>

        <Tabs.Content value="identities" mt="$4">
          <IdentitiesPanel ns={ns!} />
        </Tabs.Content>
      </Tabs>
    </YStack>
  )
}

function TabTrigger({ value, children }: { value: string; children: React.ReactNode }) {
  return (
    <Tabs.Tab value={value} px="$3" py="$2" unstyled bg="transparent">
      <Text fontSize="$2" color="$color">
        {children}
      </Text>
    </Tabs.Tab>
  )
}

function ArchivalBadge({ state, uri }: { state?: string; uri?: string }) {
  const enabled = state === 'ARCHIVAL_STATE_ENABLED' || state === 'Enabled'
  return (
    <YStack gap="$1">
      <Badge variant={enabled ? 'success' : 'muted'}>{enabled ? 'enabled' : 'disabled'}</Badge>
      {uri ? (
        <Text fontSize="$1" color="$placeholderColor" numberOfLines={1}>
          {uri}
        </Text>
      ) : null}
    </YStack>
  )
}

function RetentionPanel({
  ns,
  ttl,
  onSaved,
}: {
  ns: string
  ttl: string
  onSaved: () => Promise<void>
}) {
  const [days, setDays] = useState(() => durationToDays(ttl))
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<Error | null>(null)
  const initial = durationToDays(ttl)
  const dirty = days !== initial

  useEffect(() => {
    setDays(durationToDays(ttl))
  }, [ttl])

  const save = useCallback(async () => {
    setSaving(true)
    setErr(null)
    try {
      await Namespaces.update(ns, {
        config: { workflowExecutionRetentionTtl: daysToDuration(days), apsLimit: 0 },
      } as never)
      await onSaved()
    } catch (e) {
      setErr(e instanceof ApiError ? e : e instanceof Error ? e : new Error(String(e)))
    } finally {
      setSaving(false)
    }
  }, [ns, days, onSaved])

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$3">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          RETENTION PERIOD
        </Text>
        <RetentionEditor days={days} onChange={setDays} disabled={saving} />
        {err ? (
          <Alert variant="destructive" title="Failed to update retention">
            {err.message}
          </Alert>
        ) : null}
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless disabled={!dirty || saving} onPress={() => setDays(initial)}>
            Reset
          </Button>
          <Button size="$2" disabled={!dirty || saving} onPress={save}>
            <XStack items="center" gap="$1.5">
              {saving ? <Spinner size="small" /> : null}
              <Text fontSize="$2">Save retention</Text>
            </XStack>
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}

function ArchivalPanel({
  ns,
  config,
  onSaved,
}: {
  ns: string
  config: Namespace['config']
  onSaved: () => Promise<void>
}) {
  const histEnabled =
    config.historyArchivalState === 'ARCHIVAL_STATE_ENABLED' ||
    config.historyArchivalState === 'Enabled'
  const visEnabled =
    config.visibilityArchivalState === 'ARCHIVAL_STATE_ENABLED' ||
    config.visibilityArchivalState === 'Enabled'
  const [hist, setHist] = useState(histEnabled)
  const [vis, setVis] = useState(visEnabled)
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState<Error | null>(null)
  const dirty = hist !== histEnabled || vis !== visEnabled

  useEffect(() => {
    setHist(histEnabled)
    setVis(visEnabled)
  }, [histEnabled, visEnabled])

  async function save() {
    setSaving(true)
    setErr(null)
    try {
      await Namespaces.update(ns, {
        config: {
          historyArchivalState: hist ? 'ARCHIVAL_STATE_ENABLED' : 'ARCHIVAL_STATE_DISABLED',
          visibilityArchivalState: vis ? 'ARCHIVAL_STATE_ENABLED' : 'ARCHIVAL_STATE_DISABLED',
        },
      } as never)
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
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          ARCHIVAL
        </Text>
        <ToggleRow
          label="History archival"
          hint={config.historyArchivalUri || 'No archival URI configured.'}
          on={hist}
          onChange={setHist}
          disabled={saving}
        />
        <ToggleRow
          label="Visibility archival"
          hint={config.visibilityArchivalUri || 'No archival URI configured.'}
          on={vis}
          onChange={setVis}
          disabled={saving}
        />
        {err ? (
          <Alert variant="destructive" title="Failed to update archival">
            {err.message}
          </Alert>
        ) : null}
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" disabled={!dirty || saving} onPress={save}>
            <XStack items="center" gap="$1.5">
              {saving ? <Spinner size="small" /> : null}
              <Text fontSize="$2">Save archival</Text>
            </XStack>
          </Button>
        </XStack>
      </YStack>
    </Card>
  )
}

function ToggleRow({
  label,
  hint,
  on,
  onChange,
  disabled,
}: {
  label: string
  hint?: string
  on: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <XStack items="center" gap="$3" justify="space-between">
      <YStack gap="$1" flex={1}>
        <Text fontSize="$2" color="$color">
          {label}
        </Text>
        {hint ? (
          <Text fontSize="$1" color="$placeholderColor">
            {hint}
          </Text>
        ) : null}
      </YStack>
      <Button
        size="$2"
        chromeless
        borderWidth={1}
        borderColor="$borderColor"
        disabled={disabled}
        onPress={() => onChange(!on)}
      >
        <Text fontSize="$2">{on ? 'Enabled' : 'Disabled'}</Text>
      </Button>
    </XStack>
  )
}

function SearchAttributesPanel({ ns }: { ns: string }) {
  const url = `/v1/tasks/namespaces/${encodeURIComponent(ns)}/search-attributes`
  const { data, error, isLoading } = useFetch<SearchAttributesResponse>(url)
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState rows={2} />
  const custom = data?.customAttributes ?? {}
  const entries = Object.entries(custom)
  if (entries.length === 0) {
    return (
      <Empty
        title="No custom search attributes"
        hint="Add custom attributes via the SDK to filter workflows by application-specific keys."
      />
    )
  }
  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <H4 flex={2} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Key
        </H4>
        <H4 flex={1} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Type
        </H4>
      </XStack>
      {entries.map(([k, t], i) => (
        <XStack
          key={k}
          px="$4"
          py="$2.5"
          borderTopWidth={i === 0 ? 0 : 1}
          borderTopColor="$borderColor"
          items="center"
        >
          <Text flex={2} fontSize="$2" color="$color">
            {k}
          </Text>
          <YStack flex={1}>
            <Badge variant="muted">{t}</Badge>
          </YStack>
        </XStack>
      ))}
    </Card>
  )
}

function ConnectDropdown({ ns }: { ns: string }) {
  const host = typeof window === 'undefined' ? 'tasks.local' : window.location.hostname
  const zap = `${host}:9999`
  const http =
    typeof window === 'undefined'
      ? `https://tasks.local/v1/tasks/namespaces/${encodeURIComponent(ns)}`
      : `${window.location.protocol}//${window.location.host}/v1/tasks/namespaces/${encodeURIComponent(ns)}`

  return (
    <Popover placement="bottom-end">
      <Popover.Trigger asChild>
        <Button size="$2" borderWidth={1} borderColor="$borderColor">
          <XStack items="center" gap="$1.5">
            <Plug size={14} />
            <Text fontSize="$2">Connect</Text>
            <ChevronDown size={14} />
          </XStack>
        </Button>
      </Popover.Trigger>
      <Popover.Content
        bg="$background"
        borderWidth={1}
        borderColor="$borderColor"
        p="$3"
        minW={420}
        elevate
      >
        <YStack gap="$3">
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
              ZAP ENDPOINT
            </Text>
            <CopyField value={zap} />
          </YStack>
          <YStack gap="$1">
            <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
              HTTP ENDPOINT
            </Text>
            <CopyField value={http} />
          </YStack>
          <Text fontSize="$1" color="$placeholderColor">
            ZAP is the canonical native binary transport. HTTP/JSON is browser-only.
          </Text>
        </YStack>
      </Popover.Content>
    </Popover>
  )
}

function StatCard({
  label,
  hint,
  children,
  flexBasis,
}: {
  label: string
  hint?: string
  children: React.ReactNode
  flexBasis?: number
}) {
  return (
    <Card
      p="$4"
      bg="$background"
      borderColor="$borderColor"
      borderWidth={1}
      flexBasis={flexBasis}
      flexGrow={1}
    >
      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          {label.toUpperCase()}
        </Text>
        {children}
        {hint && (
          <Text fontSize="$1" color="$placeholderColor">
            {hint}
          </Text>
        )}
      </YStack>
    </Card>
  )
}

function IdentitiesPanel({ ns }: { ns: string }) {
  const url = `/v1/tasks/namespaces/${encodeURIComponent(ns)}/identities`
  const { data, error, isLoading } = useFetch<{ identities: Identity[] }>(url)
  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState rows={2} />
  const rows = data?.identities ?? []
  if (rows.length === 0) {
    return (
      <Empty
        title="No identities granted"
        hint="Identities are sourced from hanzo.id IAM. Grant access via the Hanzo Tasks SDK or POST /identities."
      />
    )
  }
  return (
    <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <XStack
        bg={'rgba(255,255,255,0.03)' as never}
        px="$4"
        py="$2"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <H4 flex={2} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Email
        </H4>
        <H4 flex={1} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Role
        </H4>
        <H4 flex={1} fontSize="$2" color="$placeholderColor" fontWeight="500">
          Granted
        </H4>
      </XStack>
      {rows.map((id, i) => (
        <XStack
          key={`${id.email}-${i}`}
          px="$4"
          py="$2.5"
          borderTopWidth={i === 0 ? 0 : 1}
          borderTopColor="$borderColor"
          items="center"
        >
          <Text flex={2} fontSize="$2" color="$color">
            {id.email}
          </Text>
          <YStack flex={1}>
            <Badge variant="muted">{id.role}</Badge>
          </YStack>
          <Text flex={1} fontSize="$2" color="$placeholderColor">
            {new Date(id.grantTime).toLocaleString()}
          </Text>
        </XStack>
      ))}
    </Card>
  )
}
