// Settings — currently a stub that shows the gateway-trusted org and
// user. The legacy Next.js settings page bound to @hanzo/iam/react;
// under gateway-trust the SPA reads identity from /v1/auth/whoami,
// which the gateway populates with the validated session claims.

import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { Card, H1, H3, Input, Text, XStack, YStack } from 'hanzogui'

interface WhoAmI {
  org?: string
  userId?: string
  email?: string
  permissions?: string[]
}

export function SettingsPage() {
  const { data, error, isLoading } = useFetch<WhoAmI>('/v1/auth/whoami')

  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <H1 size="$8" color="$color">
          Settings
        </H1>
        <Text fontSize="$3" color="$placeholderColor">
          Identity is proven by hanzoai/gateway and surfaced via the standard X-* headers.
        </Text>
      </YStack>

      <Card p="$5" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <H3 size="$5" color="$color">
          Identity
        </H3>
        {error ? (
          <ErrorState error={error as Error} />
        ) : isLoading ? (
          <LoadingState />
        ) : (
          <YStack gap="$3" mt="$3">
            <Field label="Org">{data?.org ?? '—'}</Field>
            <Field label="User ID">{data?.userId ?? '—'}</Field>
            <Field label="Email">{data?.email ?? '—'}</Field>
            <Field label="Permissions">{(data?.permissions ?? []).join(', ') || '—'}</Field>
          </YStack>
        )}
      </Card>

      <Card p="$5" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <H3 size="$5" color="$color">
          Storefront
        </H3>
        <Text fontSize="$2" color="$placeholderColor" mt="$2">
          Storefront branding, payment providers, and webhooks are managed at
          /_/commerce/tenants. CRUD lives there; this page renders read-only summaries.
        </Text>
        <YStack gap="$3" mt="$3">
          <Field label="Default currency">
            <Input value="USD" disabled size="$3" />
          </Field>
          <Field label="Webhook origin">
            <Input value="https://commerce.hanzo.ai" disabled size="$3" />
          </Field>
        </YStack>
      </Card>
    </YStack>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <XStack items="center" gap="$3">
      <Text fontSize="$2" color="$placeholderColor" width={140}>
        {label}
      </Text>
      <YStack flex={1}>
        {typeof children === 'string' ? (
          <Text fontSize="$2" color="$color" fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}>
            {children}
          </Text>
        ) : (
          children
        )}
      </YStack>
    </XStack>
  )
}
