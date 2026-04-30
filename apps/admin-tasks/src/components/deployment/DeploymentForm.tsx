// DeploymentForm — shared form for create/edit of a deployment series.
// Name is immutable on edit; the field is rendered read-only and copy
// styled (mono) so the operator can confirm what they're editing.
//
// Default compute spec lives on the deployment so new versions inherit
// it. Per-version overrides happen in VersionForm.

import { Card, H4, Input, Text, XStack, YStack } from 'hanzogui'
import type { ComputeSpec } from './ComputeBadge'

export interface DeploymentFormState {
  name: string
  description: string
  ownerEmail: string
  defaultCompute: Required<Omit<ComputeSpec, 'gpu' | 'region'>> &
    Partial<Pick<ComputeSpec, 'gpu' | 'region'>>
}

export const EMPTY_DEPLOYMENT_FORM: DeploymentFormState = {
  name: '',
  description: '',
  ownerEmail: '',
  defaultCompute: { type: 'k8s', cpu: '1', memory: '1Gi', gpu: '0', region: '' },
}

export interface DeploymentFormProps {
  value: DeploymentFormState
  onChange: (next: DeploymentFormState) => void
  // When editing, the deployment id is fixed.
  nameLocked?: boolean
}

export function DeploymentForm({ value, onChange, nameLocked }: DeploymentFormProps) {
  const set = <K extends keyof DeploymentFormState>(k: K, v: DeploymentFormState[K]) =>
    onChange({ ...value, [k]: v })
  const setCompute = <K extends keyof DeploymentFormState['defaultCompute']>(
    k: K,
    v: DeploymentFormState['defaultCompute'][K],
  ) => onChange({ ...value, defaultCompute: { ...value.defaultCompute, [k]: v } })

  return (
    <Card p="$4" bg="$background" borderColor="$borderColor" borderWidth={1}>
      <YStack gap="$4">
        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Name
          </H4>
          <Input
            value={value.name}
            onChangeText={(t: string) => set('name', t)}
            placeholder="my-deployment"
            disabled={nameLocked}
            maxLength={200}
          />
          <Text fontSize="$1" color="$placeholderColor">
            Lowercase, alphanumeric and dashes. 3–200 chars.{' '}
            {nameLocked ? 'Immutable after create.' : null}
          </Text>
        </YStack>

        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Description
          </H4>
          <Input
            value={value.description}
            onChangeText={(t: string) => set('description', t)}
            placeholder="What does this worker run?"
          />
        </YStack>

        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Owner email
          </H4>
          <Input
            value={value.ownerEmail}
            onChangeText={(t: string) => set('ownerEmail', t)}
            placeholder="owner@hanzo.ai"
          />
        </YStack>

        <YStack gap="$2">
          <H4 size="$3" color="$color">
            Default compute
          </H4>
          <Text fontSize="$1" color="$placeholderColor">
            New versions inherit these defaults; override per-version on creation.
          </Text>
          <XStack gap="$2" flexWrap="wrap">
            <Field label="Provider">
              <Input
                value={value.defaultCompute.type ?? ''}
                onChangeText={(t: string) => setCompute('type', t)}
                placeholder="k8s"
                width={140}
              />
            </Field>
            <Field label="CPU">
              <Input
                value={String(value.defaultCompute.cpu ?? '')}
                onChangeText={(t: string) => setCompute('cpu', t)}
                placeholder="1"
                width={100}
              />
            </Field>
            <Field label="Memory">
              <Input
                value={String(value.defaultCompute.memory ?? '')}
                onChangeText={(t: string) => setCompute('memory', t)}
                placeholder="1Gi"
                width={100}
              />
            </Field>
            <Field label="GPU">
              <Input
                value={String(value.defaultCompute.gpu ?? '0')}
                onChangeText={(t: string) => setCompute('gpu', t)}
                placeholder="0"
                width={80}
              />
            </Field>
            <Field label="Region">
              <Input
                value={value.defaultCompute.region ?? ''}
                onChangeText={(t: string) => setCompute('region', t)}
                placeholder="us-west-2"
                width={140}
              />
            </Field>
          </XStack>
        </YStack>
      </YStack>
    </Card>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <YStack gap="$1">
      <Text fontSize="$1" color="$placeholderColor" fontWeight="500">
        {label}
      </Text>
      {children}
    </YStack>
  )
}
