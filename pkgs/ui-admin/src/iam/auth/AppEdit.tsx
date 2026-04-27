// IAM Application edit — port of upstream `web/src/ApplicationEditPage.tsx`.
// Casdoor's edit page has 80+ fields organized into Ant Design `<Tabs>`:
// basic / signin / signup / appearance / providers / scopes / saml.
// We port a single flat form covering the OAuth/OIDC core that 95% of
// admins touch; the rest of the fields round-trip through the draft
// state and aren't re-rendered.
//
// Covered: name, displayName, category, type, logo, homepageUrl,
// description, cert, clientId, clientSecret, redirectUris, grantTypes,
// scopes, tokenFormat, expireInHours, refreshExpireInHours, the
// password/signup feature flags. The provider-row table, signup-item
// table, theme editor, SAML attributes, and HTML preview pane are
// out-of-scope and surfaced via TODO blocks.
//
// TODO(i18n): English literals only.

import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Paragraph, Text, TextArea, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Alert,
  CopyField,
  Empty,
  ErrorState,
  Loading,
  PageShell,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamApplication, IamItemResponse } from './types'
import { authUrl } from './api'
import { Field, SelectField, ToggleField } from './components'

interface RouteParams {
  organizationName: string
  applicationName: string
  [key: string]: string | undefined
}

const PROTECTED_APP = 'app-hanzo'

const APP_TYPES: Array<{ value: string; label: string }> = [
  { value: 'All', label: 'All' },
  { value: 'Web', label: 'Web' },
  { value: 'Native', label: 'Native' },
  { value: 'Single-Page', label: 'Single-Page' },
  { value: 'Machine-to-Machine', label: 'Machine-to-Machine' },
]

const CATEGORIES: Array<{ value: string; label: string }> = [
  { value: 'Default', label: 'Default' },
  { value: 'Agent', label: 'Agent' },
]

const TOKEN_FORMATS: Array<{ value: string; label: string }> = [
  { value: 'JWT', label: 'JWT (RS256, signed)' },
  { value: 'JWT-Empty', label: 'JWT-Empty (no payload)' },
  { value: 'Access-Token', label: 'Access-Token (opaque)' },
]

// Casdoor's grant-types are checkboxes upstream; we use a comma-list
// string in the UI so the field stays one row. Round-trips as an
// array on the wire.
function csvToArr(s: string): string[] {
  return s
    .split(',')
    .map((x) => x.trim())
    .filter((x) => x.length > 0)
}

function arrToCsv(a: string[] | undefined): string {
  return (a ?? []).join(', ')
}

export function AppEdit() {
  const { organizationName, applicationName } = useParams() as RouteParams
  const nav = useNavigate()
  const url =
    organizationName && applicationName
      ? authUrl(`applications/${organizationName}/${applicationName}`)
      : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<IamApplication>>(url)

  const [draft, setDraft] = useState<IamApplication | null>(null)
  // Write-only — the OAuth client secret is held here and never
  // hydrated from the server. An empty string means "leave the stored
  // value alone"; any non-empty string is sent on save and then
  // cleared. Same pattern as ProviderEdit / WebhookEdit.
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
        <Loading label="Loading application" />
      </PageShell>
    )
  }

  const set = <K extends keyof IamApplication>(
    k: K,
    v: IamApplication[K],
  ): void => setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async (): Promise<void> => {
    setSaving(true)
    setSaveErr(null)
    try {
      const payload: IamApplication | Omit<IamApplication, 'clientSecret'> =
        clientSecretEdit
          ? { ...draft, clientSecret: clientSecretEdit }
          : (() => {
              const { clientSecret: _omit, ...rest } = draft
              return rest
            })()
      await apiPost(
        authUrl(`applications/${draft.owner}/${draft.name}`),
        payload,
      )
      setClientSecretEdit('')
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async (): Promise<void> => {
    if (draft.name === PROTECTED_APP) return
    if (!window.confirm(`Delete application "${draft.name}"?`)) return
    await apiDelete(authUrl(`applications/${draft.owner}/${draft.name}`))
    nav('/iam/auth/applications')
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
            disabled={draft.name === PROTECTED_APP}
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

      <YStack gap="$4" maxW={760}>
        <Text fontSize="$5" fontWeight="600" color="$color">
          Basic
        </Text>
        <Field
          id="app-name"
          label="Name"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          required
          disabled={draft.name === PROTECTED_APP}
          hint="Format: <org>-<app>. Cannot be changed for app-hanzo."
        />
        <Field
          id="app-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
          required
        />
        <SelectField
          id="app-category"
          label="Category"
          value={draft.category ?? 'Default'}
          onChange={(v) => set('category', v)}
          options={CATEGORIES}
        />
        <SelectField
          id="app-type"
          label="Type"
          value={draft.type ?? 'All'}
          onChange={(v) => set('type', v)}
          options={APP_TYPES}
        />
        <Field
          id="app-org"
          label="Organization"
          value={draft.organization}
          onChangeText={(v) => set('organization', v)}
          hint="The org this app belongs to. Multi-tenant scope key."
        />
        <Field
          id="app-logo"
          label="Logo URL"
          value={draft.logo ?? ''}
          onChangeText={(v) => set('logo', v)}
          type="url"
        />
        <Field
          id="app-home"
          label="Homepage URL"
          value={draft.homepageUrl ?? ''}
          onChangeText={(v) => set('homepageUrl', v)}
          type="url"
        />
        <YStack gap="$2">
          <Text fontSize="$3" color="$color">
            Description
          </Text>
          <TextArea
            value={draft.description ?? ''}
            onChangeText={(v) => set('description', v)}
            minHeight={80}
          />
        </YStack>
      </YStack>

      <YStack gap="$4" maxW={760}>
        <Text fontSize="$5" fontWeight="600" color="$color">
          OAuth / OIDC
        </Text>
        <YStack gap="$2">
          <Text fontSize="$3" color="$color">
            Client ID
          </Text>
          {draft.clientId ? (
            <CopyField value={draft.clientId} />
          ) : (
            <Text color="$placeholderColor" fontSize="$2">
              Server generates on first save.
            </Text>
          )}
        </YStack>
        <Field
          id="app-secret"
          label="Client secret"
          value={clientSecretEdit}
          onChangeText={setClientSecretEdit}
          placeholder={draft.clientSecret ? '••••••••' : 'Set client secret'}
          type="password"
          hint="Leave empty to keep the current secret. Stored encrypted at rest; rotate via KMS when compromised."
        />
        <Field
          id="app-cert"
          label="Cert (signing key)"
          value={draft.cert ?? ''}
          onChangeText={(v) => set('cert', v)}
          hint="Name of an IAM Cert (scope=JWT). Determines the JWKS keys for issued tokens."
        />
        <SelectField
          id="app-token-format"
          label="Token format"
          value={draft.tokenFormat ?? 'JWT'}
          onChange={(v) => set('tokenFormat', v)}
          options={TOKEN_FORMATS}
        />
        <Field
          id="app-redirect"
          label="Redirect URIs"
          value={arrToCsv(draft.redirectUris)}
          onChangeText={(v) => set('redirectUris', csvToArr(v))}
          placeholder="https://app.example.com/callback, https://localhost:3000/callback"
          hint="Comma-separated. Exact-match required by spec."
        />
        <Field
          id="app-grants"
          label="Grant types"
          value={arrToCsv(draft.grantTypes)}
          onChangeText={(v) => set('grantTypes', csvToArr(v))}
          placeholder="authorization_code, refresh_token, client_credentials"
          hint="Comma-separated."
        />
        <Field
          id="app-scopes"
          label="Scopes"
          value={arrToCsv(draft.scopes)}
          onChangeText={(v) => set('scopes', csvToArr(v))}
          placeholder="openid, profile, email"
          hint="Comma-separated."
        />
        <Field
          id="app-expire"
          label="Access token TTL (hours)"
          value={String(draft.expireInHours ?? 168)}
          onChangeText={(v) => set('expireInHours', parseInt(v, 10) || 0)}
          type="number"
        />
        <Field
          id="app-refresh-expire"
          label="Refresh token TTL (hours)"
          value={String(draft.refreshExpireInHours ?? 168)}
          onChangeText={(v) =>
            set('refreshExpireInHours', parseInt(v, 10) || 0)
          }
          type="number"
        />
      </YStack>

      <YStack gap="$4" maxW={760}>
        <Text fontSize="$5" fontWeight="600" color="$color">
          Sign-in / sign-up flags
        </Text>
        <ToggleField
          id="app-pw"
          label="Enable password sign-in"
          value={draft.enablePassword ?? true}
          onChange={(v) => set('enablePassword', v)}
        />
        <ToggleField
          id="app-signup"
          label="Enable sign-up"
          value={draft.enableSignUp ?? true}
          onChange={(v) => set('enableSignUp', v)}
        />
        <ToggleField
          id="app-codesignin"
          label="Enable code sign-in"
          value={draft.enableCodeSignin ?? false}
          onChange={(v) => set('enableCodeSignin', v)}
          hint="One-time code via email/SMS without a password."
        />
        <ToggleField
          id="app-disable-signin"
          label="Disable sign-in"
          value={draft.disableSignin ?? false}
          onChange={(v) => set('disableSignin', v)}
          hint="Use to lock an application without deleting it."
        />
        <ToggleField
          id="app-saml-compress"
          label="Enable SAML compression"
          value={draft.enableSamlCompress ?? false}
          onChange={(v) => set('enableSamlCompress', v)}
        />
      </YStack>

      <ProvidersTodo />
    </PageShell>
  )
}

function ProvidersTodo(): ReactNode {
  return (
    <Empty
      title="Provider table TODO"
      hint="Casdoor's app edit page has an inline ProviderTable for linking IdPs to this application (canSignIn / canSignUp / canUnlink / signupGroup / rule per provider). Port that as a follow-up — for now use the upstream admin to wire providers."
      action={
        <Paragraph color="$placeholderColor" fontSize="$2">
          The auth bucket also stubs Signup-items, SAML-attributes, Token-attributes, and the live HTML preview. The list page covers 95% of operator workflows; deep-edit goes upstream.
        </Paragraph>
      }
    />
  )
}
