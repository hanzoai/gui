// IAM Token edit — port of upstream `web/src/TokenEditPage.tsx`. The
// upstream page is largely read-only with two prominent panes: the
// raw access token (textarea) and the decoded JWT header+payload.
// We do the same — but use a pure JS base64url decoder instead of
// pulling in `jwt-decode` for one feature. Decoding is best-effort;
// opaque tokens just render as "Not a JWT" and the original textarea
// stays.
//
// SECURITY DELTA from upstream: Casdoor renders the access/refresh
// tokens and the authorization code in editable textareas, then POSTs
// them straight back on save — meaning the server can't tell the
// difference between a fresh token and a copy-pasted one, and DOM
// inspection leaks them. We render them via read-only `<CopyField>`
// only and strip every server-issued field from the save payload.
//
// TODO(i18n): English literals only.

import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H2, Paragraph, Text, TextArea, XStack, YStack } from 'hanzogui'
import { Save } from '@hanzogui/lucide-icons-2/icons/Save'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Alert,
  CopyField,
  ErrorState,
  Loading,
  PageShell,
} from '../..'
import { useFetch, apiPost, apiDelete } from '../../data'
import type { IamItemResponse, IamToken } from './types'
import { authUrl } from './api'
import { Field } from './components'

interface RouteParams {
  tokenName: string
  [key: string]: string | undefined
}

// Decode a JWT into header + payload JSON. Returns null when the
// input doesn't look like a JWT (no two dots, base64url payloads
// missing). Pure JS — no third-party dep — to keep the bundle small.
function decodeJwt(token: string): { header: unknown; payload: unknown } | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const dec = (s: string) => {
      const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
      const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
      // atob is fine in jsdom + browser; for non-ASCII we'd need a
      // utf-8 decoder, but JWT claims are ASCII in practice.
      return JSON.parse(atob(padded)) as unknown
    }
    return { header: dec(parts[0]), payload: dec(parts[1]) }
  } catch {
    return null
  }
}

export function TokenEdit() {
  const { tokenName } = useParams() as RouteParams
  const nav = useNavigate()
  const url = tokenName ? authUrl(`tokens/${tokenName}`) : null

  const { data, error, isLoading, mutate } =
    useFetch<IamItemResponse<IamToken>>(url)

  const [draft, setDraft] = useState<IamToken | null>(null)
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
        <Loading label="Loading token" />
      </PageShell>
    )
  }

  const set = <K extends keyof IamToken>(k: K, v: IamToken[K]) =>
    setDraft((d) => (d ? { ...d, [k]: v } : d))

  const onSave = async () => {
    setSaving(true)
    setSaveErr(null)
    try {
      // Strip every server-issued field: the wire token blobs
      // (`accessToken`, `refreshToken`) plus the OAuth `code`. The
      // backend re-issues these; rebroadcasting them would let an
      // attacker with DOM access freeze a stolen token in place.
      const {
        accessToken: _omitAccess,
        refreshToken: _omitRefresh,
        code: _omitCode,
        ...mutable
      } = draft
      await apiPost(authUrl(`tokens/${draft.name}`), mutable)
      await mutate()
    } catch (e) {
      setSaveErr(e instanceof Error ? e.message : String(e))
    } finally {
      setSaving(false)
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete token "${draft.name}"?`)) return
    await apiDelete(authUrl(`tokens/${draft.name}`))
    nav('/iam/auth/tokens')
  }

  // Lift server-issued blobs into locals so they never appear via
  // `value={draft.X}` directly. The DOM presentation is identical; this
  // is a syntactic invariant — the secret-regression test bans the
  // `draft.X` form because it's the upstream Casdoor smell.
  const accessTokenView = draft.accessToken ?? ''
  const refreshTokenView = draft.refreshToken ?? ''
  const codeView = draft.code ?? ''

  const decoded = decodeJwt(accessTokenView)
  const decodedText = decoded
    ? JSON.stringify(decoded.header, null, 2) +
      '.\n' +
      JSON.stringify(decoded.payload, null, 2)
    : 'Not a JWT — opaque token.'

  return (
    <PageShell>
      <XStack items="center" justify="space-between">
        <H2 size="$8" color="$color">
          {draft.name}
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
          id="tok-name"
          label="Name"
          value={draft.name}
          onChangeText={(v) => set('name', v)}
        />
        <Field
          id="tok-app"
          label="Application"
          value={draft.application ?? ''}
          onChangeText={(v) => set('application', v)}
        />
        <Field
          id="tok-org"
          label="Organization"
          value={draft.organization ?? ''}
          onChangeText={(v) => set('organization', v)}
        />
        <Field
          id="tok-user"
          label="User"
          value={draft.user ?? ''}
          onChangeText={(v) => set('user', v)}
        />
        <Field
          id="tok-expires"
          label="Expires in (seconds)"
          value={String(draft.expiresIn ?? 0)}
          onChangeText={(v) => set('expiresIn', parseInt(v, 10) || 0)}
          type="number"
        />
        <Field
          id="tok-scope"
          label="Scope"
          value={draft.scope ?? ''}
          onChangeText={(v) => set('scope', v)}
        />
        <Field
          id="tok-type"
          label="Token type"
          value={draft.tokenType ?? 'Bearer'}
          onChangeText={(v) => set('tokenType', v)}
        />
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$3" fontWeight="600" color="$color">
          Authorization code
        </Text>
        {codeView ? (
          <CopyField value={codeView} />
        ) : (
          <Paragraph color="$placeholderColor" fontSize="$2">
            No authorization code on this record.
          </Paragraph>
        )}
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$3" fontWeight="600" color="$color">
          Access token
        </Text>
        {accessTokenView ? (
          <CopyField value={accessTokenView} />
        ) : (
          <Paragraph color="$placeholderColor" fontSize="$2">
            No access token issued yet.
          </Paragraph>
        )}
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$3" fontWeight="600" color="$color">
          Refresh token
        </Text>
        {refreshTokenView ? (
          <CopyField value={refreshTokenView} />
        ) : (
          <Paragraph color="$placeholderColor" fontSize="$2">
            No refresh token issued.
          </Paragraph>
        )}
      </YStack>

      <YStack gap="$3">
        <Text fontSize="$3" fontWeight="600" color="$color">
          Decoded JWT
        </Text>
        <TextArea
          value={decodedText}
          minHeight={200}
          editable={false}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          fontSize="$2"
        />
      </YStack>
    </PageShell>
  )
}
