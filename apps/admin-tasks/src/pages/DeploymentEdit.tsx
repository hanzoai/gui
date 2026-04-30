// DeploymentEdit — patch deployment metadata (description, owner,
// default compute). Name is immutable. Hydrates the form once the
// existing deployment resolves.

import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Alert, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { ApiError, Deployments, type Deployment } from '../lib/api'
import {
  DeploymentForm,
  EMPTY_DEPLOYMENT_FORM,
  type DeploymentFormState,
} from '../components/deployment/DeploymentForm'
import { useSettings, canWriteNamespace } from '../stores/settings'

interface DeploymentEnvelope extends Deployment {
  description?: string
  ownerEmail?: string
  defaultCompute?: {
    type?: string
    cpu?: string | number
    memory?: string | number
    gpu?: string | number
    region?: string
  }
}

export function DeploymentEditPage() {
  const { ns, name } = useParams()
  const namespace = ns!
  const series = decodeURIComponent(name!)
  const navigate = useNavigate()
  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)

  const url = Deployments.describeUrl(namespace, series)
  const { data, error, isLoading } = useFetch<DeploymentEnvelope>(url)

  const [form, setForm] = useState<DeploymentFormState>(EMPTY_DEPLOYMENT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  useEffect(() => {
    if (!data) return
    setForm({
      name: data.seriesName,
      description: data.description ?? '',
      ownerEmail: data.ownerEmail ?? '',
      defaultCompute: {
        type: data.defaultCompute?.type ?? 'k8s',
        cpu: String(data.defaultCompute?.cpu ?? '1'),
        memory: String(data.defaultCompute?.memory ?? '1Gi'),
        gpu: String(data.defaultCompute?.gpu ?? '0'),
        region: data.defaultCompute?.region ?? '',
      },
    })
  }, [data])

  const onSubmit = useCallback(async () => {
    setSubmitErr(null)
    setSubmitting(true)
    try {
      await Deployments.update(namespace, series, {
        description: form.description || undefined,
        ownerEmail: form.ownerEmail || undefined,
        defaultCompute: {
          type: form.defaultCompute.type,
          cpu: form.defaultCompute.cpu,
          memory: form.defaultCompute.memory,
          gpu: form.defaultCompute.gpu,
          region: form.defaultCompute.region || undefined,
        },
      })
      navigate(
        `/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(series)}`,
      )
    } catch (e) {
      if (e instanceof ApiError) {
        setSubmitErr(
          e.status === 501
            ? 'Backend does not yet implement deployment update (501).'
            : e.message,
        )
      } else {
        setSubmitErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }, [form, namespace, series, navigate])

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

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
        Edit deployment
      </H1>

      {!writeAllowed ? (
        <Alert variant="default" title="Read-only mode">
          Namespace writes are disabled.
        </Alert>
      ) : null}

      <DeploymentForm value={form} onChange={setForm} nameLocked />

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
