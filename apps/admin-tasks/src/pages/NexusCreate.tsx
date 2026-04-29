// NexusCreate — wizard for a new endpoint. Form state lives in the
// nexus-state store (useNexusDraft) so navigation away preserves
// in-flight edits. Submits via Nexus.create then routes back to the
// list, which re-fetches and shows the new row.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, H1, H4, Input, Spinner, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Alert, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { ApiError, Namespaces, Nexus } from '../lib/api'
import type { ListNamespacesResponse } from '../lib/api'
import { useNexusDraft } from '../stores/nexus-state'
import {
  EMPTY_WORKER,
  NexusTargetEditor,
  parseTarget,
  serializeTarget,
  targetIsValid,
  type NexusTarget,
} from '../components/nexus/NexusTargetEditor'
import { AllowedCallersEditor } from '../components/nexus/AllowedCallersEditor'

export function NexusCreatePage() {
  const { ns } = useParams()
  const navigate = useNavigate()
  const { draft, set, start } = useNexusDraft()

  // Local target state — derived from draft.target (the wire string)
  // but kept separately so the discriminated union edits cleanly.
  const initialTarget = useMemo<NexusTarget>(
    () => (draft.target ? parseTarget(draft.target) : { ...EMPTY_WORKER }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )
  const [target, setTarget] = useState<NexusTarget>(initialTarget)

  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  // Pull namespaces for the worker target picker + caller suggestions.
  const { data: nsResp, error: nsErr, isLoading: nsLoading } = useFetch<ListNamespacesResponse>(
    Namespaces.listUrl(),
  )
  const allNamespaces = useMemo(
    () => (nsResp?.namespaces ?? []).map((n) => n.namespaceInfo?.name).filter((n): n is string => !!n),
    [nsResp],
  )

  // Reset draft on mount unless a draft is already in flight.
  useEffect(() => {
    if (!draft.name && !draft.target && draft.allowedCallerNamespaces.length === 0) {
      start()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSubmit = useCallback(async () => {
    setSubmitErr(null)
    if (!draft.name.trim()) {
      setSubmitErr('Endpoint name is required.')
      return
    }
    if (!targetIsValid(target)) {
      setSubmitErr('Target is incomplete.')
      return
    }
    if (draft.allowedCallerNamespaces.length === 0) {
      setSubmitErr('At least one allowed caller namespace is required.')
      return
    }
    setSubmitting(true)
    try {
      // ns is required by the route. For the top-level "/nexus/create"
      // entry-point, fall back to the worker target's namespace (worker
      // endpoints are scoped to that namespace) or the first available.
      const ownerNs =
        ns ||
        (target.kind === 'worker' ? target.namespace : allNamespaces[0]) ||
        'default'
      const wireTarget = serializeTarget(target)
      await Nexus.create(ownerNs, {
        name: draft.name.trim(),
        descriptionString: draft.description || undefined,
        target: wireTarget,
        allowedCallerNamespaces: draft.allowedCallerNamespaces,
      })
      start() // clear
      navigate(ns ? `/namespaces/${encodeURIComponent(ns)}/nexus` : '/nexus')
    } catch (e) {
      if (e instanceof ApiError) {
        setSubmitErr(e.status === 501 ? 'Backend does not yet implement nexus create (501).' : e.message)
      } else {
        setSubmitErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }, [draft, target, ns, allNamespaces, navigate, start])

  if (nsErr) return <ErrorState error={nsErr as Error} />
  if (nsLoading) return <LoadingState />

  const backHref = ns ? `/namespaces/${encodeURIComponent(ns)}/nexus` : '/nexus'

  return (
    <YStack gap="$4">
      <Link to={backHref} style={{ textDecoration: 'none' }}>
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            Back to endpoints
          </Text>
        </XStack>
      </Link>

      <H1 size="$8" color="$color">
        Create Nexus endpoint
      </H1>

      <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <YStack gap="$4">
          <YStack gap="$2">
            <H4 size="$3" color="$color">
              Name
            </H4>
            <Input
              value={draft.name}
              onChangeText={(t: string) => set({ name: t })}
              placeholder="my-endpoint"
              maxLength={200}
            />
            <Text fontSize="$1" color="$placeholderColor">
              Lowercase, alphanumeric and dashes. 3–200 chars.
            </Text>
          </YStack>

          <YStack gap="$2">
            <H4 size="$3" color="$color">
              Description
            </H4>
            <TextArea
              value={draft.description}
              onChangeText={(t: string) => set({ description: t })}
              minH={64}
              placeholder="What does this endpoint route?"
            />
          </YStack>

          <YStack gap="$2">
            <H4 size="$3" color="$color">
              Target
            </H4>
            <Text fontSize="$1" color="$placeholderColor">
              Where calls are dispatched. A worker target routes to a task queue in another namespace; an external target hits an HTTPS URL directly.
            </Text>
            <NexusTargetEditor value={target} namespaces={allNamespaces} onChange={setTarget} />
          </YStack>

          <YStack gap="$2">
            <H4 size="$3" color="$color">
              Allowed callers
            </H4>
            <Text fontSize="$1" color="$placeholderColor">
              Namespaces whose workflows may invoke this endpoint. Required.
            </Text>
            <AllowedCallersEditor
              value={draft.allowedCallerNamespaces}
              options={allNamespaces}
              onChange={(next) => set({ allowedCallerNamespaces: next })}
            />
          </YStack>
        </YStack>
      </Card>

      {submitErr ? (
        <Alert variant="destructive" title="Could not create endpoint">
          {submitErr}
        </Alert>
      ) : null}

      <XStack gap="$2" justify="flex-end">
        <Link to={backHref} style={{ textDecoration: 'none' }}>
          <Button chromeless>
            <Text fontSize="$2">Cancel</Text>
          </Button>
        </Link>
        <Button
          onPress={() => void onSubmit()}
          disabled={submitting}
          bg={'#f2f2f2' as never}
        >
          <XStack items="center" gap="$1.5">
            {submitting ? <Spinner size="small" /> : <Plus size={14} color="#070b13" />}
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {submitting ? 'Creating…' : 'Create endpoint'}
            </Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}
