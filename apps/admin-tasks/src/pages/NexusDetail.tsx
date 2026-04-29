// NexusDetail — describe + edit + delete one endpoint. Edit toggles
// inline (no Dialog primitive in admin); delete pops a fixed-position
// confirm overlay following the SetCurrentDialog convention from
// FEATURE-6 since the same Dialog primitive gap applies here.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, H1, H4, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Alert,
  Badge,
  ErrorState,
  LoadingState,
  formatTimestamp,
  useFetch,
} from '@hanzogui/admin'
import { ApiError, Namespaces, Nexus } from '../lib/api'
import type { ListNamespacesResponse, NexusEndpoint } from '../lib/api'
import {
  NexusTargetEditor,
  parseTarget,
  serializeTarget,
  targetIsValid,
  type NexusTarget,
} from '../components/nexus/NexusTargetEditor'
import { AllowedCallersEditor } from '../components/nexus/AllowedCallersEditor'

export function NexusDetailPage() {
  const { ns, endpointId } = useParams()
  const namespace = ns || ''
  const id = endpointId!
  const navigate = useNavigate()

  // Detail fetch is namespace-scoped; the top-level /nexus/:id route
  // does not have ns. In that case, we fall back to listing and
  // resolving by name.
  const detailUrl = namespace ? Nexus.describeUrl(namespace, id) : Nexus.listUrl()
  const { data, error, isLoading, mutate } = useFetch<NexusEndpoint | { endpoints?: NexusEndpoint[] }>(detailUrl)

  const endpoint = useMemo<NexusEndpoint | null>(() => {
    if (!data) return null
    if ('endpoints' in data) return data.endpoints?.find((e) => e.name === id) ?? null
    return data as NexusEndpoint
  }, [data, id])

  const { data: nsResp } = useFetch<ListNamespacesResponse>(Namespaces.listUrl())
  const allNamespaces = useMemo(
    () => (nsResp?.namespaces ?? []).map((n) => n.namespaceInfo?.name).filter((n): n is string => !!n),
    [nsResp],
  )

  const [editing, setEditing] = useState(false)
  const [target, setTarget] = useState<NexusTarget | null>(null)
  const [description, setDescription] = useState('')
  const [callers, setCallers] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [opErr, setOpErr] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)

  // Seed edit form when entering edit mode.
  useEffect(() => {
    if (!editing || !endpoint) return
    setTarget(parseTarget(endpoint.target ?? ''))
    setDescription(endpoint.descriptionString ?? endpoint.description ?? '')
    setCallers(endpoint.allowedCallerNamespaces ?? [])
  }, [editing, endpoint])

  const onSave = useCallback(async () => {
    if (!endpoint || !target) return
    setOpErr(null)
    if (!targetIsValid(target)) {
      setOpErr('Target is incomplete.')
      return
    }
    if (callers.length === 0) {
      setOpErr('At least one allowed caller namespace is required.')
      return
    }
    setBusy(true)
    try {
      const ownerNs = endpoint.namespace || namespace
      await Nexus.update(ownerNs, endpoint.name, {
        name: endpoint.name,
        descriptionString: description || undefined,
        target: serializeTarget(target),
        allowedCallerNamespaces: callers,
      })
      setEditing(false)
      await mutate()
    } catch (e) {
      if (e instanceof ApiError) {
        setOpErr(e.status === 501 ? 'Backend does not yet implement nexus update (501).' : e.message)
      } else {
        setOpErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }, [endpoint, target, callers, description, namespace, mutate])

  const onDelete = useCallback(async () => {
    if (!endpoint) return
    setBusy(true)
    setOpErr(null)
    try {
      await Nexus.delete(endpoint.namespace || namespace, endpoint.name)
      setConfirmDelete(false)
      navigate(namespace ? `/namespaces/${encodeURIComponent(namespace)}/nexus` : '/nexus')
    } catch (e) {
      if (e instanceof ApiError) {
        setOpErr(e.status === 501 ? 'Backend does not yet implement nexus delete (501).' : e.message)
      } else {
        setOpErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setBusy(false)
    }
  }, [endpoint, namespace, navigate])

  // Esc-to-cancel for the destructive overlay.
  useEffect(() => {
    if (!confirmDelete) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !busy) setConfirmDelete(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [confirmDelete, busy])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !endpoint) return <LoadingState />

  const parsed = parseTarget(endpoint.target ?? '')
  const backHref = namespace ? `/namespaces/${encodeURIComponent(namespace)}/nexus` : '/nexus'

  return (
    <YStack gap="$5">
      <Link to={backHref} style={{ textDecoration: 'none', color: 'inherit' }}>
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            endpoints
          </Text>
        </XStack>
      </Link>

      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          NEXUS ENDPOINT
        </Text>
        <XStack items="center" gap="$3" flexWrap="wrap">
          <H1 size="$7" color="$color" fontWeight="600">
            {endpoint.name}
          </H1>
          <Badge variant={parsed.kind === 'worker' ? 'info' : 'default'}>{parsed.kind}</Badge>
          {endpoint.state ? <Badge variant="muted">{endpoint.state.toLowerCase()}</Badge> : null}
        </XStack>
        {endpoint.createTime ? (
          <Text fontSize="$1" color="$placeholderColor">
            created {formatTimestamp(new Date(endpoint.createTime))}
          </Text>
        ) : null}
      </YStack>

      {editing && target ? (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <YStack gap="$4">
            <YStack gap="$2">
              <H4 size="$3" color="$color">
                Description
              </H4>
              <Text fontSize="$1" color="$placeholderColor">
                Markdown supported in feed views; plain text in the wire.
              </Text>
              <input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this endpoint route?"
                style={{
                  background: 'transparent',
                  border: '1px solid var(--borderColor)',
                  borderRadius: 6,
                  color: 'var(--color)',
                  fontSize: 14,
                  padding: '8px 10px',
                }}
              />
            </YStack>

            <YStack gap="$2">
              <H4 size="$3" color="$color">
                Target
              </H4>
              <NexusTargetEditor value={target} namespaces={allNamespaces} onChange={setTarget} />
            </YStack>

            <YStack gap="$2">
              <H4 size="$3" color="$color">
                Allowed callers
              </H4>
              <AllowedCallersEditor value={callers} options={allNamespaces} onChange={setCallers} />
            </YStack>

            {opErr ? (
              <Alert variant="destructive" title="Could not save">
                {opErr}
              </Alert>
            ) : null}

            <XStack gap="$2" justify="flex-end">
              <Button chromeless onPress={() => setEditing(false)} disabled={busy}>
                <Text fontSize="$2">Cancel</Text>
              </Button>
              <Button onPress={() => void onSave()} disabled={busy} bg={'#f2f2f2' as never}>
                <XStack items="center" gap="$1.5">
                  {busy ? <Spinner size="small" /> : null}
                  <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                    {busy ? 'Saving…' : 'Save changes'}
                  </Text>
                </XStack>
              </Button>
            </XStack>
          </YStack>
        </Card>
      ) : (
        <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <YStack gap="$3">
            <Section label="Target">
              <Text
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$2"
                color="$color"
              >
                {endpoint.target}
              </Text>
              {parsed.kind === 'worker' ? (
                <Text fontSize="$1" color="$placeholderColor">
                  namespace {parsed.namespace} · task queue {parsed.taskQueue}
                  {parsed.service ? ` · service ${parsed.service}` : ''}
                </Text>
              ) : null}
            </Section>

            <Section label="Description">
              <Text fontSize="$2" color="$color">
                {endpoint.descriptionString || endpoint.description || '—'}
              </Text>
            </Section>

            <Section label={`Allowed callers (${endpoint.allowedCallerNamespaces?.length ?? 0})`}>
              {endpoint.allowedCallerNamespaces && endpoint.allowedCallerNamespaces.length > 0 ? (
                <XStack gap="$1.5" flexWrap="wrap">
                  {endpoint.allowedCallerNamespaces.map((c) => (
                    <Badge key={c} variant="default">
                      {c}
                    </Badge>
                  ))}
                </XStack>
              ) : (
                <Text fontSize="$1" color="$placeholderColor">
                  none
                </Text>
              )}
            </Section>

            <XStack gap="$2" justify="flex-end">
              <Button size="$2" chromeless onPress={() => setEditing(true)}>
                <XStack items="center" gap="$1.5">
                  <Pencil size={12} color="#7e8794" />
                  <Text fontSize="$2">Edit</Text>
                </XStack>
              </Button>
              <Button size="$2" chromeless onPress={() => setConfirmDelete(true)}>
                <XStack items="center" gap="$1.5">
                  <Trash2 size={12} color="#fca5a5" />
                  <Text fontSize="$2" color={'#fca5a5' as never}>
                    Delete
                  </Text>
                </XStack>
              </Button>
            </XStack>
          </YStack>
        </Card>
      )}

      <DeleteConfirm
        open={confirmDelete}
        endpointName={endpoint.name}
        busy={busy}
        error={opErr}
        onConfirm={() => void onDelete()}
        onCancel={() => (busy ? undefined : setConfirmDelete(false))}
      />
    </YStack>
  )
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$1">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
        {label}
      </Text>
      {children}
    </YStack>
  )
}

function DeleteConfirm({
  open,
  endpointName,
  busy,
  error,
  onConfirm,
  onCancel,
}: {
  open: boolean
  endpointName: string
  busy: boolean
  error: string | null
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!open) return null
  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      bg={'rgba(0,0,0,0.55)' as never}
      items="center"
      justify="center"
      z={1000}
      style={{ position: 'fixed' as never }}
      onPress={onCancel}
    >
      <Card
        width={480}
        maxWidth={'90vw' as never}
        p="$5"
        gap="$3"
        bg="$background"
        borderColor="$borderColor"
        borderWidth={1}
        onPress={(e: { stopPropagation: () => void }) => e.stopPropagation()}
      >
        <Text fontSize="$5" color="$color" fontWeight="500">
          Delete endpoint
        </Text>
        <Text fontSize="$2" color="$color">
          Permanently remove{' '}
          <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} fontWeight="500" color="$color">
            {endpointName}
          </Text>
          . Workflows that route through this endpoint will start failing immediately.
        </Text>
        {error ? (
          <Text fontSize="$1" color={'#fca5a5' as never}>
            {error}
          </Text>
        ) : null}
        <XStack gap="$2" justify="flex-end">
          <Button size="$2" chromeless onPress={onCancel} disabled={busy}>
            Cancel
          </Button>
          <Button size="$2" onPress={onConfirm} disabled={busy} bg={'#7f1d1d' as never}>
            <XStack items="center" gap="$1.5">
              {busy ? <Spinner size="small" /> : <Trash2 size={12} color="#fecaca" />}
              <Text fontSize="$2" color={'#fecaca' as never} fontWeight="500">
                {busy ? 'Deleting…' : 'Delete'}
              </Text>
            </XStack>
          </Button>
        </XStack>
      </Card>
    </YStack>
  )
}
