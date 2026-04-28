// IAM Cert edit — port of upstream `web/src/CertEditPage.tsx`.
//
// SECURITY DELTA from upstream: Casdoor renders BOTH the certificate
// (public PEM) and the private key in editable textareas. We render
// only the public PEM. Private keys belong in KMS, not in an admin
// form. The on-wire `privateKey` field round-trips through the draft
// state so saves don't accidentally clear it, but it is never
// rendered or exposed to the UI. New private keys are generated
// server-side at creation time; rotation goes through KMS.
//
// TODO(i18n): English literals only.

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Paragraph, Text, TextArea, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Lock } from '@hanzogui/lucide-icons-2/icons/Lock'
import {
  Alert,
  CopyField,
  ErrorState,
  Loading,
  PageShell,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamCert, IamItemResponse } from './types'
import { authUrl } from './api'
import { Field, SelectField } from './components'

interface RouteParams {
  organizationName: string
  certName: string
  [key: string]: string | undefined
}

const CERT_TYPES: Array<{ value: string; label: string }> = [
  { value: 'x509', label: 'x509 (JWT signing)' },
  { value: 'SSL', label: 'SSL (custom domain TLS)' },
  { value: 'Payment', label: 'Payment' },
]

const SCOPE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'JWT', label: 'JWT' },
]

const JWT_ALGORITHMS: Array<{ value: string; label: string }> = [
  { value: 'RS256', label: 'RS256 (RSA + SHA-256)' },
  { value: 'RS384', label: 'RS384 (RSA + SHA-384)' },
  { value: 'RS512', label: 'RS512 (RSA + SHA-512)' },
  { value: 'ES256', label: 'ES256 (ECDSA P-256)' },
  { value: 'ES384', label: 'ES384 (ECDSA P-384)' },
  { value: 'ES512', label: 'ES512 (ECDSA P-521)' },
  { value: 'PS256', label: 'PS256 (RSASSA-PSS SHA-256)' },
  { value: 'PS384', label: 'PS384 (RSASSA-PSS SHA-384)' },
  { value: 'PS512', label: 'PS512 (RSASSA-PSS SHA-512)' },
]

const SSL_ALGORITHMS: Array<{ value: string; label: string }> = [
  { value: 'RSA', label: 'RSA' },
  { value: 'ECC', label: 'ECC' },
]

const RSA_BITS: Array<{ value: string; label: string }> = [
  { value: '1024', label: '1024' },
  { value: '2048', label: '2048' },
  { value: '4096', label: '4096' },
]

export function CertEdit() {
  const { organizationName, certName } = useParams() as RouteParams
  const nav = useNavigate()
  const url =
    organizationName && certName
      ? authUrl(`certs/${organizationName}/${certName}`)
      : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<IamCert>>(url)

  const [draft, setDraft] = useState<IamCert | null>(null)
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
        <Loading label="Loading cert" />
      </PageShell>
    )
  }

  const set = <K extends keyof IamCert>(k: K, v: IamCert[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    setSaving(true)
    setSaveErr(null)
    try {
      await apiPost(authUrl(`certs/${draft.owner}/${draft.name}`), draft)
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete cert "${draft.name}"?`)) return
    await apiDelete(authUrl(`certs/${draft.owner}/${draft.name}`))
    nav('/iam/auth/certs')
  }

  const isSsl = draft.type === 'SSL'
  const isEcc = (draft.cryptoAlgorithm || '').startsWith('ES')

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
          id="cert-name"
          label="Name"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          required
        />
        <Field
          id="cert-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
        />
        <SelectField
          id="cert-scope"
          label="Scope"
          value={draft.scope}
          onChange={(v) => set('scope', v)}
          options={SCOPE_OPTIONS}
        />
        <SelectField
          id="cert-type"
          label="Type"
          value={draft.type}
          onChange={(v) => set('type', v)}
          options={CERT_TYPES}
        />
        <SelectField
          id="cert-algo"
          label="Crypto algorithm"
          value={draft.cryptoAlgorithm}
          onChange={(v) => set('cryptoAlgorithm', v)}
          options={isSsl ? SSL_ALGORITHMS : JWT_ALGORITHMS}
        />
        {!isEcc && !isSsl ? (
          <SelectField
            id="cert-bits"
            label="Bit size"
            value={String(draft.bitSize ?? 2048)}
            onChange={(v) => set('bitSize', parseInt(v, 10))}
            options={RSA_BITS}
          />
        ) : null}
        {!isSsl ? (
          <Field
            id="cert-expire-y"
            label="Expire in years"
            value={String(draft.expireInYears ?? 20)}
            onChangeText={(v) => set('expireInYears', parseInt(v, 10) || 0)}
            type="number"
          />
        ) : null}
        {isSsl ? (
          <YStack gap="$3">
            <Field
              id="cert-expire-t"
              label="Expire time"
              value={draft.expireTime ?? ''}
              onChangeText={() => {
                /* read-only — server-managed */
              }}
              disabled
              hint="Server-managed for SSL certs."
            />
            <Field
              id="cert-domain-expire"
              label="Domain expire"
              value={draft.domainExpireTime ?? ''}
              onChangeText={() => {
                /* read-only — server-managed */
              }}
              disabled
            />
          </YStack>
        ) : null}
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$3" fontWeight="600" color="$color">
          Public certificate (PEM)
        </Text>
        {draft.certificate ? (
          <CopyField value={draft.certificate} />
        ) : (
          <Paragraph color="$placeholderColor" fontSize="$2">
            No certificate generated yet — save with a populated
            algorithm to generate.
          </Paragraph>
        )}
        <TextArea
          value={draft.certificate ?? ''}
          onChangeText={(v) => set('certificate', v)}
          height={240}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$2"
          placeholder="-----BEGIN CERTIFICATE-----"
        />
      </YStack>

      <Alert variant="default" title="Private key (not shown)">
        <XStack gap="$2" items="flex-start">
          <Lock size={14} />
          <Paragraph color="$placeholderColor" fontSize="$2">
            The private key is never rendered in this admin. Casdoor&apos;s
            upstream UI shows it; we deliberately do not. New keys are
            generated server-side on save; rotate via the IAM API or KMS.
            If you need the private key for a one-shot bootstrap (e.g.
            seeding a JWKS in another deployment), use the IAM CLI with
            operator credentials — it is logged.
          </Paragraph>
        </XStack>
      </Alert>
    </PageShell>
  )
}
