// DeploymentVersionCreate — register a new version (build id) under an
// existing deployment series. Submits via Deployments.createVersion.

import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Alert } from '@hanzogui/admin'
import { ApiError, Deployments } from '../lib/api'
import {
  EMPTY_VERSION_FORM,
  VersionForm,
  envRowsToMap,
  type VersionFormState,
} from '../components/deployment/VersionForm'
import { useSettings, canWriteNamespace } from '../stores/settings'

export function DeploymentVersionCreatePage() {
  const { ns, name } = useParams()
  const namespace = ns!
  const series = decodeURIComponent(name!)
  const navigate = useNavigate()
  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)

  const [form, setForm] = useState<VersionFormState>(EMPTY_VERSION_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const onSubmit = useCallback(async () => {
    setSubmitErr(null)
    if (!form.buildId.trim()) {
      setSubmitErr('Build ID is required.')
      return
    }
    setSubmitting(true)
    try {
      await Deployments.createVersion(namespace, series, {
        buildId: form.buildId.trim(),
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
            ? 'Backend does not yet implement version create (501).'
            : e.message,
        )
      } else {
        setSubmitErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }, [form, namespace, series, navigate])

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
        Add version
      </H1>

      {!writeAllowed ? (
        <Alert variant="default" title="Read-only mode">
          Namespace writes are disabled.
        </Alert>
      ) : null}

      <VersionForm value={form} onChange={setForm} />

      {submitErr ? (
        <Alert variant="destructive" title="Could not create version">
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
            {submitting ? <Spinner size="small" /> : <Plus size={14} color="#070b13" />}
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {submitting ? 'Creating…' : 'Create version'}
            </Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}
