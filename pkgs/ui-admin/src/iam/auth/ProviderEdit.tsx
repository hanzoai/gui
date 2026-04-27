// IAM Provider edit — port of upstream `web/src/ProviderEditPage.tsx`.
//
// Casdoor's provider edit page is the single biggest form in the
// admin: 50+ field permutations across OAuth, OIDC, SAML, LDAP,
// Email, SMS, Captcha, MFA, Payment, Web3, Storage. Per the bucket
// spec we cover OAuth + OIDC well and stub the rest with an `<Empty>`
// scaffold that round-trips state via the form draft. Operators
// editing a SAML/LDAP/etc provider on this page will see a TODO
// notice; for now they should use the upstream Casdoor UI for those
// categories.
//
// TODO(i18n): English literals only.

import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Alert,
  Empty,
  ErrorState,
  Loading,
  PageShell,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamItemResponse, IamProvider, ProviderCategory } from './types'
import { authUrl } from './api'
import { Field, SelectField, ToggleField } from './components'

interface RouteParams {
  organizationName: string
  providerName: string
  [key: string]: string | undefined
}

const CATEGORIES: Array<{ value: ProviderCategory; label: string }> = [
  { value: 'OAuth', label: 'OAuth 2.0' },
  { value: 'OIDC', label: 'OIDC' },
  { value: 'SAML', label: 'SAML' },
  { value: 'LDAP', label: 'LDAP' },
  { value: 'Email', label: 'Email' },
  { value: 'SMS', label: 'SMS' },
  { value: 'Captcha', label: 'Captcha' },
  { value: 'MFA', label: 'MFA' },
  { value: 'Payment', label: 'Payment' },
  { value: 'Web3', label: 'Web3' },
  { value: 'Storage', label: 'Storage' },
  { value: 'Notification', label: 'Notification' },
  { value: 'Face ID', label: 'Face ID' },
  { value: 'ID Verification', label: 'ID Verification' },
]

// Common upstream OAuth provider types — full upstream list is 40+.
// We surface the ones we actually use; "Custom" lets ops paste their
// own type label for everything else without blocking the save.
const OAUTH_TYPES: Array<{ value: string; label: string }> = [
  { value: 'GitHub', label: 'GitHub' },
  { value: 'Google', label: 'Google' },
  { value: 'Apple', label: 'Apple' },
  { value: 'Microsoft', label: 'Microsoft' },
  { value: 'GitLab', label: 'GitLab' },
  { value: 'LinkedIn', label: 'LinkedIn' },
  { value: 'Custom', label: 'Custom' },
]

export function ProviderEdit() {
  const { organizationName, providerName } = useParams() as RouteParams
  const nav = useNavigate()
  const url =
    organizationName && providerName
      ? authUrl(`providers/${organizationName}/${providerName}`)
      : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<IamProvider>>(url)

  const [draft, setDraft] = useState<IamProvider | null>(null)
  // Write-only — the OAuth/OIDC client secret is held here and never
  // hydrated from the server. An empty string means "leave the stored
  // value alone"; any non-empty string is sent on save and then
  // cleared. Upstream Casdoor echoed the secret straight back into
  // the input — that regression is closed here.
  const [clientSecretEdit, setClientSecretEdit] = useState('')
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) setDraft({ ...data.data })
  }, [data?.data])

  if (error) {
    return (
      <PageShell>
        <ErrorState error={error} />
      </PageShell>
    )
  }

  if (isLoading || !draft) {
    return (
      <PageShell>
        <Loading label="Loading provider" />
      </PageShell>
    )
  }

  const set = <K extends keyof IamProvider>(k: K, v: IamProvider[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    setSaving(true)
    setSaveErr(null)
    try {
      // Send the secret only when the user actually typed one; otherwise
      // omit the field entirely so the server keeps the stored value.
      const payload: IamProvider | Omit<IamProvider, 'clientSecret'> = clientSecretEdit
        ? { ...draft, clientSecret: clientSecretEdit }
        : (() => {
            const { clientSecret: _omit, ...rest } = draft
            return rest
          })()
      await apiPost(authUrl(`providers/${draft.owner}/${draft.name}`), payload)
      setClientSecretEdit('')
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete provider "${draft.name}"?`)) return
    await apiDelete(authUrl(`providers/${draft.owner}/${draft.name}`))
    nav('/iam/auth/providers')
  }

  return (
    <PageShell>
      <XStack items="center" justify="space-between">
        <H2 size="$8" color="$color">
          {draft.displayName || draft.name}
        </H2>
        <XStack gap="$2">
          <Button
            size="$3"
            onPress={onSave}
            disabled={saving}
            icon={<Save size={14} />}
          >
            {saving ? 'Saving…' : 'Save'}
          </Button>
          <Button
            size="$3"
            chromeless
            onPress={onDelete}
            icon={<Trash2 size={14} />}
          >
            Delete
          </Button>
        </XStack>
      </XStack>

      {saveErr ? (
        <Alert variant="destructive" title="Could not save">
          {saveErr}
        </Alert>
      ) : null}

      <YStack gap="$4" maxW={720}>
        <Field
          id="prov-name"
          label="Name"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          required
        />
        <Field
          id="prov-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
        />
        <SelectField
          id="prov-category"
          label="Category"
          value={draft.category as string}
          onChange={(v) => set('category', v as ProviderCategory)}
          options={CATEGORIES}
          hint="Selects which provider sub-form is rendered below."
        />
        <ToggleField
          id="prov-signup"
          label="Allow signup"
          value={draft.enableSignUp ?? true}
          onChange={(v) => set('enableSignUp', v)}
        />
      </YStack>

      <CategoryPanel
        draft={draft}
        onChange={(patch) => setDraft((d) => (d ? { ...d, ...patch } : d))}
        clientSecretEdit={clientSecretEdit}
        onClientSecretEdit={setClientSecretEdit}
      />
    </PageShell>
  )
}

interface CategoryPanelProps {
  draft: IamProvider
  onChange: (patch: Partial<IamProvider>) => void
  clientSecretEdit: string
  onClientSecretEdit: (next: string) => void
}

function CategoryPanel({
  draft,
  onChange,
  clientSecretEdit,
  onClientSecretEdit,
}: CategoryPanelProps): ReactNode {
  switch (draft.category) {
    case 'OAuth':
      return (
        <OAuthFields
          draft={draft}
          onChange={onChange}
          clientSecretEdit={clientSecretEdit}
          onClientSecretEdit={onClientSecretEdit}
        />
      )
    case 'OIDC':
      return (
        <OIDCFields
          draft={draft}
          onChange={onChange}
          clientSecretEdit={clientSecretEdit}
          onClientSecretEdit={onClientSecretEdit}
        />
      )
    case 'SAML':
      return (
        <ScaffoldEmpty
          category="SAML"
          hint="SAML 2.0 IdP configuration — entityId, IDP metadata, signing certs, name-ID format. Use the legacy admin until the SAML form is ported."
        />
      )
    case 'LDAP':
      return (
        <ScaffoldEmpty
          category="LDAP"
          hint="LDAP/AD bind config — host, port, baseDN, bind DN, TLS. The federation bucket already has a richer LDAP editor; link it here once the routes converge."
        />
      )
    case 'Email':
    case 'SMS':
    case 'Captcha':
    case 'MFA':
    case 'Payment':
    case 'Web3':
    case 'Storage':
    case 'Notification':
    case 'Face ID':
    case 'ID Verification':
      return (
        <ScaffoldEmpty
          category={String(draft.category)}
          hint={`The ${draft.category} provider sub-form isn't part of this bucket. Edit via the upstream admin or add the form in a follow-up port.`}
        />
      )
    default:
      return (
        <ScaffoldEmpty
          category="Unknown"
          hint={`Unknown category "${String(draft.category)}". The auth bucket only ports OAuth + OIDC well; everything else is a scaffold.`}
        />
      )
  }
}

function OAuthFields({
  draft,
  onChange,
  clientSecretEdit,
  onClientSecretEdit,
}: CategoryPanelProps): ReactNode {
  return (
    <YStack gap="$4" maxW={720}>
      <Text fontSize="$5" fontWeight="600" color="$color">
        OAuth 2.0 settings
      </Text>
      <SelectField
        id="oauth-type"
        label="Provider type"
        value={draft.type}
        onChange={(v) => onChange({ type: v })}
        options={OAUTH_TYPES}
      />
      <Field
        id="oauth-client-id"
        label="Client ID"
        value={draft.clientId ?? ''}
        onChangeText={(v) => onChange({ clientId: v })}
        required
      />
      <Field
        id="oauth-client-secret"
        label="Client secret"
        value={clientSecretEdit}
        onChangeText={onClientSecretEdit}
        placeholder={draft.clientSecret ? '••••••••' : 'Set client secret'}
        type="password"
        hint="Leave empty to keep the current secret. Stored encrypted at rest; rotate via KMS when compromised."
      />
      <Field
        id="oauth-scopes"
        label="Scopes"
        value={draft.scopes ?? ''}
        onChangeText={(v) => onChange({ scopes: v })}
        placeholder="profile,email"
      />
      <Field
        id="oauth-provider-url"
        label="Provider console URL"
        value={draft.providerUrl ?? ''}
        onChangeText={(v) => onChange({ providerUrl: v })}
        type="url"
        hint="Where ops manage this app at the upstream provider."
      />
    </YStack>
  )
}

function OIDCFields({
  draft,
  onChange,
  clientSecretEdit,
  onClientSecretEdit,
}: CategoryPanelProps): ReactNode {
  return (
    <YStack gap="$4" maxW={720}>
      <Text fontSize="$5" fontWeight="600" color="$color">
        OIDC settings
      </Text>
      <Field
        id="oidc-client-id"
        label="Client ID"
        value={draft.clientId ?? ''}
        onChangeText={(v) => onChange({ clientId: v })}
        required
      />
      <Field
        id="oidc-client-secret"
        label="Client secret"
        value={clientSecretEdit}
        onChangeText={onClientSecretEdit}
        placeholder={draft.clientSecret ? '••••••••' : 'Set client secret'}
        type="password"
        hint="Leave empty to keep the current secret."
      />
      <Field
        id="oidc-issuer"
        label="Issuer / discovery URL"
        value={draft.providerUrl ?? ''}
        onChangeText={(v) => onChange({ providerUrl: v })}
        type="url"
        placeholder="https://example.com/.well-known/openid-configuration"
        hint="If set, authorize/token/userinfo URLs are auto-discovered. Leaving them blank below uses discovery."
      />
      <Field
        id="oidc-auth-url"
        label="Authorize URL (override)"
        value={draft.customAuthUrl ?? ''}
        onChangeText={(v) => onChange({ customAuthUrl: v })}
        type="url"
      />
      <Field
        id="oidc-token-url"
        label="Token URL (override)"
        value={draft.customTokenUrl ?? ''}
        onChangeText={(v) => onChange({ customTokenUrl: v })}
        type="url"
      />
      <Field
        id="oidc-userinfo-url"
        label="UserInfo URL (override)"
        value={draft.customUserInfoUrl ?? ''}
        onChangeText={(v) => onChange({ customUserInfoUrl: v })}
        type="url"
      />
      <Field
        id="oidc-scopes"
        label="Scopes"
        value={draft.scopes ?? ''}
        onChangeText={(v) => onChange({ scopes: v })}
        placeholder="openid profile email"
      />
    </YStack>
  )
}

interface ScaffoldEmptyProps {
  category: string
  hint: string
}

function ScaffoldEmpty({ category, hint }: ScaffoldEmptyProps): ReactNode {
  return (
    <Empty
      title={`${category} configuration not ported`}
      hint={hint}
      action={
        <Paragraph color="$placeholderColor" fontSize="$2">
          The category dropdown and base fields are saved; provider-specific
          fields round-trip through the API but aren&apos;t editable here.
        </Paragraph>
      }
    />
  )
}
