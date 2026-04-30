// DeploymentDetail — versions list with full CRUD: set current, edit,
// delete deployment, add/edit/delete version, validate connection. Drift
// (current vs latest) and ramping state are still surfaced.

import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, Card, H1, H3, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Badge,
  Empty,
  ErrorState,
  LoadingState,
  SummaryCard,
  formatTimestamp,
  useFetch,
} from '@hanzogui/admin'
import {
  Deployments,
  TaskQueues,
  ApiError,
  type Deployment,
  type ValidateConnectionResult,
} from '../lib/api'
import { VersionTable } from '../components/deployment/VersionTable'
import { SetCurrentDialog } from '../components/deployment/SetCurrentDialog'
import { DeleteDeploymentModal } from '../components/deployment/DeleteDeploymentModal'
import { DeleteVersionModal } from '../components/deployment/DeleteVersionModal'
import { ValidateConnectionModal } from '../components/deployment/ValidateConnectionModal'
import { useSettings, canWriteNamespace } from '../stores/settings'

interface TaskQueuesListResp {
  taskQueues?: Array<{ name: string; deployment?: string }>
}

export function DeploymentDetailPage() {
  const { ns, name } = useParams()
  const namespace = ns!
  const series = decodeURIComponent(name!)
  const navigate = useNavigate()
  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)

  const detailUrl = Deployments.describeUrl(namespace, series)
  const { data, error, isLoading, mutate } = useFetch<Deployment>(detailUrl)

  // Best-effort: pull task queues to estimate impact.
  const { data: queuesResp } = useFetch<TaskQueuesListResp>(TaskQueues.listUrl(namespace))

  const [pending, setPending] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const [dialogError, setDialogError] = useState<string | undefined>(undefined)

  // Delete-deployment modal state.
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteErr, setDeleteErr] = useState<string | undefined>(undefined)

  // Delete-version modal state.
  const [deleteVersion, setDeleteVersion] = useState<string | null>(null)
  const [deleteVersionBusy, setDeleteVersionBusy] = useState(false)
  const [deleteVersionErr, setDeleteVersionErr] = useState<string | undefined>(undefined)

  // Validate-connection modal state.
  const [validateBuild, setValidateBuild] = useState<string | null>(null)
  const [validateLoading, setValidateLoading] = useState(false)
  const [validateResult, setValidateResult] = useState<ValidateConnectionResult | null>(null)
  const [validateErr, setValidateErr] = useState<string | undefined>(undefined)

  const impactedQueues = useMemo(() => {
    const all = queuesResp?.taskQueues ?? []
    const matches = all.filter((q) => q.deployment === series).map((q) => q.name)
    return matches
  }, [queuesResp, series])

  const onSetCurrent = useCallback((buildId: string) => {
    setPending(buildId)
    setDialogError(undefined)
  }, [])

  const onConfirm = useCallback(async () => {
    if (!pending) return
    setBusy(true)
    setDialogError(undefined)
    try {
      await Deployments.setCurrent(namespace, series, pending)
      setPending(null)
      await mutate()
    } catch (e) {
      const msg = describeError(e, 'set-current')
      setDialogError(msg)
    } finally {
      setBusy(false)
    }
  }, [pending, namespace, series, mutate])

  const onCancel = useCallback(() => {
    if (busy) return
    setPending(null)
    setDialogError(undefined)
  }, [busy])

  const onUnsetCurrent = useCallback(async () => {
    if (!data?.defaultBuildId) return
    if (
      !confirm(
        `Clear current build "${data.defaultBuildId}" for ${series}? Routing falls back to the worker's default until you set another current.`,
      )
    )
      return
    setBusy(true)
    try {
      await Deployments.unsetCurrent(namespace, series)
      await mutate()
    } catch (e) {
      setDialogError(describeError(e, 'set-current'))
    } finally {
      setBusy(false)
    }
  }, [data?.defaultBuildId, namespace, series, mutate])

  // Delete deployment.
  const onDeleteDeployment = useCallback(
    async (force: boolean) => {
      setDeleteBusy(true)
      setDeleteErr(undefined)
      try {
        await Deployments.deleteDeployment(namespace, series, force)
        navigate(`/namespaces/${encodeURIComponent(namespace)}/deployments`)
      } catch (e) {
        setDeleteErr(describeError(e, 'delete'))
      } finally {
        setDeleteBusy(false)
      }
    },
    [namespace, series, navigate],
  )

  // Delete version.
  const onConfirmDeleteVersion = useCallback(async () => {
    if (!deleteVersion) return
    setDeleteVersionBusy(true)
    setDeleteVersionErr(undefined)
    try {
      await Deployments.deleteVersion(namespace, series, deleteVersion)
      setDeleteVersion(null)
      await mutate()
    } catch (e) {
      setDeleteVersionErr(describeError(e, 'delete-version'))
    } finally {
      setDeleteVersionBusy(false)
    }
  }, [deleteVersion, namespace, series, mutate])

  // Validate connection.
  const onValidate = useCallback(
    async (buildId: string) => {
      setValidateBuild(buildId)
      setValidateLoading(true)
      setValidateResult(null)
      setValidateErr(undefined)
      try {
        const r = await Deployments.validateVersion(namespace, series, buildId)
        setValidateResult(r)
      } catch (e) {
        setValidateErr(describeError(e, 'validate'))
      } finally {
        setValidateLoading(false)
      }
    },
    [namespace, series],
  )

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const buildIds = data.buildIds ?? []
  const ramping = buildIds.find((b) => String(b.state).includes('RAMPING') || String(b.state) === 'Ramping')
  const latest = buildIds.length > 0 ? buildIds[buildIds.length - 1] : undefined
  const drift = latest && data.defaultBuildId && latest.buildId !== data.defaultBuildId

  const editHrefBase = `/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(series)}/versions`

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}/deployments`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">deployments</Text>
        </XStack>
      </Link>

      <XStack items="flex-start" justify="space-between" gap="$3" flexWrap="wrap">
        <YStack gap="$1" flex={1}>
          <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
            DEPLOYMENT
          </Text>
          <XStack items="center" gap="$3" flexWrap="wrap">
            <H1 size="$7" color="$color" fontWeight="600">{data.seriesName}</H1>
            {ramping ? <Badge variant="warning">ramping</Badge> : null}
            {drift ? <Badge variant="info">drift</Badge> : null}
          </XStack>
          {data.createTime ? (
            <Text fontSize="$1" color="$placeholderColor">
              created {formatTimestamp(new Date(data.createTime))}
            </Text>
          ) : null}
        </YStack>

        <XStack gap="$2">
          <Link
            to={`${editHrefBase}/create`}
            style={{ textDecoration: 'none' }}
          >
            <Button size="$2" disabled={!writeAllowed}>
              <XStack items="center" gap="$1.5">
                <Plus size={14} color="#070b13" />
                <Text fontSize="$2">Add version</Text>
              </XStack>
            </Button>
          </Link>
          <Link
            to={`/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(series)}/edit`}
            style={{ textDecoration: 'none' }}
          >
            <Button size="$2" chromeless disabled={!writeAllowed}>
              <XStack items="center" gap="$1.5">
                <Pencil size={14} color="#7e8794" />
                <Text fontSize="$2">Edit</Text>
              </XStack>
            </Button>
          </Link>
          <Button
            size="$2"
            chromeless
            disabled={!writeAllowed}
            onPress={() => {
              setDeleteErr(undefined)
              setDeleteOpen(true)
            }}
          >
            <XStack items="center" gap="$1.5">
              <Trash2 size={14} color="#fca5a5" />
              <Text fontSize="$2" color={'#fca5a5' as never}>
                Delete
              </Text>
            </XStack>
          </Button>
        </XStack>
      </XStack>

      <XStack gap="$3" flexWrap="wrap">
        <SummaryCard label="Versions" value={buildIds.length} />
        <SummaryCard
          label="Current"
          value={data.defaultBuildId ? 1 : 0}
          accent={data.defaultBuildId ? 'success' : 'muted'}
        />
        <SummaryCard label="Ramping" value={ramping ? 1 : 0} accent={ramping ? 'success' : 'muted'} />
        <SummaryCard label="Task queues" value={impactedQueues.length} accent="default" />
      </XStack>

      <Section title={`Versions (${buildIds.length})`}>
        {buildIds.length === 0 ? (
          <Empty
            title="No build IDs registered"
            hint="A build ID lands when a worker connects with that series + version, or you can register one explicitly."
          />
        ) : (
          <VersionTable
            buildIds={buildIds}
            defaultBuildId={data.defaultBuildId}
            onSetCurrent={onSetCurrent}
            onUnsetCurrent={data.defaultBuildId ? onUnsetCurrent : undefined}
            onValidate={(b) => void onValidate(b)}
            onDelete={(b) => {
              setDeleteVersionErr(undefined)
              setDeleteVersion(b)
            }}
            editHrefBase={editHrefBase}
            writeDisabled={!writeAllowed}
            busy={busy}
          />
        )}
      </Section>

      {drift ? (
        <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1} gap="$1">
          <Text fontSize="$2" color="$color">
            Latest build differs from current.
          </Text>
          <Text fontSize="$1" color="$placeholderColor">
            current{' '}
            <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} color="$color">
              {data.defaultBuildId}
            </Text>{' '}
            ↔ latest{' '}
            <Text fontFamily={'ui-monospace, SFMono-Regular, monospace' as never} color="$color">
              {latest!.buildId}
            </Text>
          </Text>
        </Card>
      ) : null}

      <Section title={`Impacted task queues (${impactedQueues.length})`}>
        {impactedQueues.length === 0 ? (
          <Empty
            title="No task queues attached"
            hint="A task queue is impacted when a poller registers under this series."
          />
        ) : (
          <YStack gap="$2">
            {impactedQueues.map((q) => (
              <Link
                key={q}
                to={`/namespaces/${encodeURIComponent(namespace)}/task-queues/${encodeURIComponent(q)}`}
                style={{ textDecoration: 'none' }}
              >
                <Card
                  p="$3"
                  bg="$background"
                  borderColor="$borderColor"
                  borderWidth={1}
                  hoverStyle={{ background: 'rgba(255,255,255,0.04)' as never }}
                >
                  <Text fontSize="$2" color={'#86efac' as never}>{q}</Text>
                </Card>
              </Link>
            ))}
          </YStack>
        )}
      </Section>

      <SetCurrentDialog
        deploymentName={data.seriesName}
        currentBuildId={data.defaultBuildId}
        proposedBuildId={pending ?? ''}
        impactedTaskQueues={impactedQueues}
        open={pending !== null}
        busy={busy}
        error={dialogError}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <DeleteDeploymentModal
        deploymentName={data.seriesName}
        versionCount={buildIds.length}
        open={deleteOpen}
        busy={deleteBusy}
        error={deleteErr}
        onConfirm={(force) => void onDeleteDeployment(force)}
        onCancel={() => (deleteBusy ? undefined : setDeleteOpen(false))}
      />

      <DeleteVersionModal
        deploymentName={data.seriesName}
        buildId={deleteVersion ?? ''}
        isCurrent={deleteVersion !== null && deleteVersion === data.defaultBuildId}
        open={deleteVersion !== null}
        busy={deleteVersionBusy}
        error={deleteVersionErr}
        onConfirm={() => void onConfirmDeleteVersion()}
        onCancel={() => (deleteVersionBusy ? undefined : setDeleteVersion(null))}
      />

      <ValidateConnectionModal
        deploymentName={data.seriesName}
        buildId={validateBuild ?? ''}
        open={validateBuild !== null}
        loading={validateLoading}
        result={validateResult}
        error={validateErr}
        onClose={() => {
          if (validateLoading) return
          setValidateBuild(null)
          setValidateResult(null)
          setValidateErr(undefined)
        }}
      />
    </YStack>
  )
}

function describeError(e: unknown, op: string): string {
  if (e instanceof ApiError) {
    if (e.status === 501) return `Backend does not yet implement ${op} (501).`
    return e.message
  }
  if (e instanceof Error) return e.message
  return String(e)
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <YStack gap="$2">
      <H3 size="$5" color="$color" fontWeight="500">{title}</H3>
      {children}
    </YStack>
  )
}
