// DeploymentCreate — register a new worker deployment series in a
// namespace. Submits via Deployments.create and routes to the new
// detail page on success.

import { useCallback, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, H1, Spinner, Text, XStack, YStack } from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Alert } from '@hanzogui/admin'
import { ApiError, Deployments } from '../lib/api'
import {
  DeploymentForm,
  EMPTY_DEPLOYMENT_FORM,
  type DeploymentFormState,
} from '../components/deployment/DeploymentForm'
import { useSettings, canWriteNamespace } from '../stores/settings'

export function DeploymentCreatePage() {
  const { ns } = useParams()
  const namespace = ns!
  const navigate = useNavigate()
  const { settings } = useSettings()
  const writeAllowed = canWriteNamespace(settings)

  const [form, setForm] = useState<DeploymentFormState>(EMPTY_DEPLOYMENT_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr] = useState<string | null>(null)

  const onSubmit = useCallback(async () => {
    setSubmitErr(null)
    if (!form.name.trim()) {
      setSubmitErr('Deployment name is required.')
      return
    }
    setSubmitting(true)
    try {
      await Deployments.create(namespace, {
        name: form.name.trim(),
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
        `/namespaces/${encodeURIComponent(namespace)}/deployments/${encodeURIComponent(form.name.trim())}`,
      )
    } catch (e) {
      if (e instanceof ApiError) {
        setSubmitErr(
          e.status === 501
            ? 'Backend does not yet implement deployment create (501).'
            : e.message,
        )
      } else {
        setSubmitErr(e instanceof Error ? e.message : String(e))
      }
    } finally {
      setSubmitting(false)
    }
  }, [form, namespace, navigate])

  const backHref = `/namespaces/${encodeURIComponent(namespace)}/deployments`

  return (
    <YStack gap="$4">
      <Link to={backHref} style={{ textDecoration: 'none' }}>
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            Back to deployments
          </Text>
        </XStack>
      </Link>

      <H1 size="$8" color="$color">
        Create deployment
      </H1>

      {!writeAllowed ? (
        <Alert variant="default" title="Read-only mode">
          Namespace writes are disabled. This form is shown for reference.
        </Alert>
      ) : null}

      <DeploymentForm value={form} onChange={setForm} />

      {submitErr ? (
        <Alert variant="destructive" title="Could not create deployment">
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
              {submitting ? 'Creating…' : 'Create deployment'}
            </Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}
