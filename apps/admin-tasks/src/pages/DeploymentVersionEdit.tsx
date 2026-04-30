// DeploymentVersionEdit — patch a version's metadata (description, image,
// env, compute). Build id is immutable.

import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Alert, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { ApiError, Deployments } from '../lib/api'
import type { VersionDetailResponse } from '../components/deployment/VersionRowDetails'
import {
  EMPTY_VERSION_FORM,
  envMapToRows,
  envRowsToMap,
  VersionForm,
  type VersionFormState,
} from '../components/deployment/VersionForm'
import { useSettings, canWriteNamespace } from '../stores/settings'

export function DeploymentVersionEditPage() {
  const { ns, name, buildId } = useParams()
  const namespace = ns!
  const series = decodeURIComponent(name!)
  const build = decodeURIComponent(buildId!)
  const navigate = useNavigate()
  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)

  const url = Deployments.versionDescribeUrl(namespace, series, build)
  const { data, error, isLoading } = useFetch<VersionDetailResponse>(url)

  const [form, setForm] = useState<VersionFormState>({
    ...EMPTY_VERSION_FORM,
    buildId: build,
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  useEffect(() => {
    if (!data) return
    const spec =
      data.spec ??
      data.workerDeploymentVersionInfo?.spec ??
      data.workerDeploymentVersionInfo?.computeConfig
    if (!spec) {
      setForm((f) => ({ ...f, buildId: build }))
      return
    }
    setForm({
      buildId: build,
      description: spec.description ?? '',
      image: spec.image ?? '',
      region: spec.region ?? '',
      computeType: spec.compute?.type ?? 'k8s',
      cpu: String(spec.compute?.cpu ?? '1'),
      memory: String(spec.compute?.memory ?? '1Gi'),
      gpu: String(spec.compute?.gpu ?? '0'),
      env: envMapToRows(
        Array.isArray(spec.env)
          ? Object.fromEntries(spec.env.map((e) => [e.name, e.value]))
          : (spec.env as Record<string, string> | undefined),
      ),
    })
  }, [data, build])

  const onSubmit = useCallback(async () => {
    setSubmitErr(null)
    setSubmitting(true)
    try {
      await Deployments.updateVersion(namespace, series, build, {
        description: form.description || undefined,
        image: form.image || undefined,
        region: form.region || undefined,
        compute: {
          type: form.computeType,
          cpu: form.cpu,
          memory: form.memory,
          gpu: form.gpu,
        },
        env: envRowsToMap(form.env),
      })
      navigate(
        `/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(series)}`,
      )
    } catch (e) {
      if (e instanceof ApiError) {
        setSubmitErr(
          e.status === 501
            ? 'Backend does not yet implement version update (501).'
            : e.message,
        )
      } else {
        setSubmitErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }, [form, namespace, series, build, navigate])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />

  const backHref = `/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(series)}`

  return (
    <YStack gap="$4">
      <Link to={backHref} style={{ textDecoration: 'none' }}>
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            Back to {series}
          </Text>
        </XStack>
      </Link>

      <H1 size="$8" color="$color">
        Edit version
      </H1>

      {!writeAllowed ? (
        <Alert variant="default" title="Read-only mode">
          Namespace writes are disabled.
        </Alert>
      ) : null}

      <VersionForm value={form} onChange={setForm} buildIdLocked />

      {submitErr ? (
        <Alert variant="destructive" title="Could not save">
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
          disabled={submitting || !writeAllowed}
          bg={'#f2f2f2' as never}
        >
          <XStack items="center" gap="$1.5">
            {submitting ? <Spinner size="small" /> : <Save size={14} color="#070b13" />}
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {submitting ? 'Saving…' : 'Save changes'}
            </Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}
