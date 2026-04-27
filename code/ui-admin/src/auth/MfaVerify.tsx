// MfaVerify — second-factor challenge during sign-in. The first
// factor (password / SSO) has succeeded; the backend has signalled
// "MFA required" and listed the available types.
//
// Original at `~/work/hanzo/iam/web/src/auth/mfa/MfaVerifyForm.tsx`.

import { useEffect, useState } from 'react'
import { Card, Paragraph, Text, XStack, YStack } from 'hanzogui'
import type { MfaVerifyPayload } from './types'
import { readCsrfToken } from './util'

export interface MfaVerifyProps {
  // Available MFA channels for this account. Order matters — first
  // is the default selection.
  available: Array<'app' | 'sms' | 'email' | 'recovery'>
  // For SMS / email channels: how the destination is masked when
  // the user looks at the form (e.g. `+1•••••••1234` or
  // `j••@example.com`). Caller computes this; we never reformat.
  maskedDest?: { sms?: string; email?: string }
  // Submit handler. Caller posts to /v1/iam/mfa/auth/verify and
  // resolves on success. The `enableMfaRemember` flag is only
  // honoured when the application is configured for it.
  onSubmit: (payload: MfaVerifyPayload) => Promise<void>
  // For SMS / email: caller dispatches a fresh code. Throttled by
  // the backend; we just expose a "Resend" button.
  onResend?: (mfaType: 'sms' | 'email') => Promise<void>
  // Called when the user taps "Use a recovery code instead".
  onUseRecovery?: () => void
  // Optional remember-me window in hours, surfaced on the toggle.
  rememberHours?: number
  error?: string | null
}

export function MfaVerify({
  available,
  maskedDest,
  onSubmit,
  onResend,
  onUseRecovery,
  rememberHours,
  error,
}: MfaVerifyProps) {
  const [mfaType, setMfaType] = useState<'app' | 'sms' | 'email' | 'recovery'>(available[0] ?? 'app')
  const [passcode, setPasscode] = useState('')
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [csrfToken] = useState(() => readCsrfToken())

  useEffect(() => {
    setPasscode('')
  }, [mfaType])

  const submit = async () => {
    if (submitting || !passcode) return
    setSubmitting(true)
    try {
      await onSubmit({
        mfaType,
        passcode,
        enableMfaRemember: remember,
        csrfToken: csrfToken || undefined,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <YStack
      tag="form"
      gap="$3"
      width="100%"
      maxWidth={400}
      {...({
        onSubmit: (e: React.FormEvent) => {
          e.preventDefault()
          void submit()
        },
        autoComplete: 'on',
        noValidate: true,
      } as never)}
    >
      <input type="hidden" name="csrfToken" value={csrfToken} readOnly />
      <Text fontSize="$8" fontWeight="700">
        Verify it's you
      </Text>

      {available.length > 1 ? (
        <XStack gap="$2" flexWrap="wrap">
          {available.map((t) => (
            <Text
              key={t}
              tag="button"
              {...({ type: 'button', onClick: () => setMfaType(t) } as never)}
              fontSize="$2"
              color={mfaType === t ? '#60a5fa' : '$placeholderColor'}
              cursor="pointer"
            >
              {t === 'app'
                ? 'Authenticator'
                : t === 'sms'
                  ? 'SMS'
                  : t === 'email'
                    ? 'Email'
                    : 'Recovery code'}
            </Text>
          ))}
        </XStack>
      ) : null}

      {mfaType === 'sms' && maskedDest?.sms ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          Code sent to {maskedDest.sms}
        </Paragraph>
      ) : null}
      {mfaType === 'email' && maskedDest?.email ? (
        <Paragraph color="$placeholderColor" fontSize="$2">
          Code sent to {maskedDest.email}
        </Paragraph>
      ) : null}

      <YStack gap="$1">
        <Text fontSize="$2" color="$placeholderColor">
          {mfaType === 'recovery' ? 'Recovery code' : 'Code'}
        </Text>
        <Text
          tag="input"
          {...({
            inputMode: mfaType === 'recovery' ? 'text' : 'numeric',
            autoComplete: 'one-time-code',
            value: passcode,
            onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasscode(e.target.value),
            name: 'passcode',
            required: true,
            spellCheck: false,
            autoCapitalize: 'none',
          } as never)}
          px="$2"
          py="$2"
          rounded="$2"
          borderWidth={1}
          borderColor="$borderColor"
          bg="$background"
          color="$color"
          fontFamily={'ui-monospace, monospace' as never}
          fontSize="$5"
        />
      </YStack>

      {mfaType !== 'recovery' && rememberHours ? (
        <Card p="$2" bg="$background" borderColor="$borderColor" borderWidth={1}>
          <XStack items="center" gap="$2">
            <Text
              tag="input"
              {...({
                type: 'checkbox',
                checked: remember,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked),
                name: 'enableMfaRemember',
              } as never)}
            />
            <Text fontSize="$2">Remember this device for {rememberHours} hours</Text>
          </XStack>
        </Card>
      ) : null}

      {(mfaType === 'sms' || mfaType === 'email') && onResend ? (
        <Text
          tag="button"
          {...({ type: 'button', onClick: () => void onResend(mfaType) } as never)}
          fontSize="$2"
          color="#60a5fa"
          cursor="pointer"
        >
          Resend code
        </Text>
      ) : null}

      {error ? (
        <Paragraph color="#fca5a5" fontSize="$2">
          {error}
        </Paragraph>
      ) : null}

      <Text
        tag="button"
        {...({ type: 'submit', disabled: submitting || !passcode } as never)}
        px="$4"
        py="$3"
        rounded="$3"
        bg={passcode && !submitting ? ('#3b82f6' as never) : ('rgba(59,130,246,0.4)' as never)}
        color="#ffffff"
        text="center"
        cursor={passcode && !submitting ? 'pointer' : 'not-allowed'}
      >
        {submitting ? 'Verifying…' : 'Verify'}
      </Text>

      {onUseRecovery && mfaType !== 'recovery' && available.includes('recovery') ? (
        <Text
          tag="button"
          {...({ type: 'button', onClick: onUseRecovery } as never)}
          fontSize="$2"
          color="$placeholderColor"
          text="center"
          cursor="pointer"
        >
          Use a recovery code instead
        </Text>
      ) : null}
    </YStack>
  )
}
