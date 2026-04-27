// IAM organization — edit view. Ports the shape of
// `web/src/OrganizationEditPage.tsx` (Ant Design `<Form>` + `<Tabs>`)
// to a flat Hanzo GUI form. Upstream had multi-tab editing for
// account-items, theme, MFA, etc — we only port the identity-core
// fields here and surface the rest as a TODO panel. Anything beyond
// these basics belongs in a follow-up porting bucket.
//
// Form state is `useState<Organization|null>` populated from
// `useFetch`. Submit POSTs the full object back. No `<Form>` wrapper
// — controls bind directly via `value` + setters. Validation is
// inline: name+displayName are required, websiteUrl must parse.

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { Alert, ErrorState, Loading } from '../../primitives'
import { PageShell } from '../../shell'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamItemResponse, Organization } from './types'
import { iamUrl } from './api'
import { Field, ToggleField } from './Field'

interface RouteParams {
  orgName: string
  // react-router v7 typed routes hand back a Record; we cast through
  // `unknown` to keep `any` out of this file.
  [key: string]: string | undefined
}

interface FormErrors {
  name?: string
  displayName?: string
  websiteUrl?: string
}

function validate(o: Organization): FormErrors {
  const errs: FormErrors = {}
  if (!o.name.trim()) errs.name = 'Name is required'
  if (!o.displayName.trim()) errs.displayName = 'Display name is required'
  if (o.websiteUrl) {
    try {
      // Empty url is fine; only validate when present.
      // eslint-disable-next-line no-new
      new URL(o.websiteUrl)
    } catch {
      errs.websiteUrl = 'Must be a valid URL'
    }
  }
  return errs
}

export function OrgEdit() {
  const { orgName } = useParams() as RouteParams
  const nav = useNavigate()
  const url = orgName ? iamUrl(`organizations/${orgName}`) : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<Organization>>(url)

  const [draft, setDraft] = useState<Organization | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState<string | null>(null)
  const [errs, setErrs] = useState<FormErrors>({})

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
        <Loading label="Loading organization" />
      </PageShell>
    )
  }

  const set = <K extends keyof Organization>(k: K, v: Organization[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    const v = validate(draft)
    setErrs(v)
    if (Object.keys(v).length > 0) return
    setSaving(true)
    setSaveErr(null)
    try {
      await apiPost(iamUrl(`organizations/${draft.name}`), draft)
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete "${draft.displayName || draft.name}"?`)) return
    await apiDelete(iamUrl(`organizations/${draft.name}`))
    nav('/iam/orgs')
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
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            size="$3"
            chromeless
            onPress={onDelete}
            disabled={draft.name === 'built-in'}
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
          id="org-name"
          label="Name (slug)"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
          error={errs.name}
          required
        />
        <Field
          id="org-display"
          label="Display name"
          value={draft.displayName}
          onChangeText={(v) => set('displayName', v)}
          error={errs.displayName}
          required
        />
        <Field
          id="org-website"
          label="Website URL"
          value={draft.websiteUrl}
          onChangeText={(v) => set('websiteUrl', v)}
          type="url"
          error={errs.websiteUrl}
          placeholder="https://example.com"
        />
        <Field
          id="org-favicon"
          label="Favicon URL"
          value={draft.favicon ?? ''}
          onChangeText={(v) => set('favicon', v)}
          type="url"
        />
        <Field
          id="org-pw-type"
          label="Password type"
          value={draft.passwordType}
          onChangeText={(v) => set('passwordType', v)}
          hint="argon2id is preferred. Never bcrypt, never plaintext."
        />
        <Field
          id="org-default-app"
          label="Default application"
          value={draft.defaultApplication ?? ''}
          onChangeText={(v) => set('defaultApplication', v)}
        />
        <Field
          id="org-balance-currency"
          label="Balance currency"
          value={draft.balanceCurrency ?? 'USD'}
          onChangeText={(v) => set('balanceCurrency', v)}
        />
        <ToggleField
          id="org-soft-deletion"
          label="Enable soft deletion"
          value={draft.enableSoftDeletion ?? false}
          onChange={(v) => set('enableSoftDeletion', v)}
        />
        <ToggleField
          id="org-disable-signin"
          label="Disable sign-in"
          value={draft.disableSignin ?? false}
          onChange={(v) => set('disableSignin', v)}
        />
        <ToggleField
          id="org-public-profile"
          label="Public profile"
          value={draft.isProfilePublic ?? true}
          onChange={(v) => set('isProfilePublic', v)}
        />
      </YStack>

      <Alert title="Advanced settings TODO">
        <Paragraph color="$placeholderColor" fontSize="$2">
          Account items, themes, MFA policies, country codes, languages,
          and LDAP/SAML integration aren&apos;t in this bucket yet — the
          upstream Ant Design page is multi-tabbed. Port them in a
          follow-up alongside `AccountTable`, `MfaTable`, and
          `LdapTable`.
        </Paragraph>
        <Text fontSize="$1" color="$placeholderColor" mt="$2">
          Owner: {draft.owner} | Created: {draft.createdTime}
        </Text>
      </Alert>
    </PageShell>
  )
}
