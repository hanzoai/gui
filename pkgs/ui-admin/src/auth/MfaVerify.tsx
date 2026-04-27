// MfaVerify — second-factor challenge during sign-in. The first
// factor (password / SSO) has succeeded; the backend has signalled
// "MFA required" and listed the available types.
//
// Original at `~/work/hanzo/iam/web/src/auth/mfa/MfaVerifyForm.tsx`.

import { useEffect, useState, type FormEvent } from 'react'
import { Button, Card, Input, Label, Paragraph, Switch, Text, XStack, YStack } from 'hanzogui'
import type { MfaVerifyPayload } from './types'

export interface MfaVerifyProps {
  available: Array<'app' | 'sms' | 'email' | 'recovery'>
  maskedDest?: { sms?: string; email?: string }
  onSubmit: (payload: MfaVerifyPayload) => Promise<void>
  onResend?: (mfaType: 'sms' | 'email') => Promise<void>
  onUseRecovery?: () => void
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
  const [mfaType, setMfaType] = useState<'app' | 'sms' | 'email' | 'recovery'>(
    available[0] ?? 'app'
  )
  const [passcode, setPasscode] = useState('')
  const [remember, setRemember] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    setPasscode('')
  }, [mfaType])

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (submitting || !passcode) return
    setSubmitting(true)
    try {
      await onSubmit({
        mfaType,
        passcode,
        enableMfaRemember: remember,
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={submit} autoComplete="on" noValidate>
      <YStack gap="$3" width="100%" maxW={400}>
        <Text fontSize="$8" fontWeight="700">
          Verify it's you
        </Text>

        {available.length > 1 ? (
          <XStack gap="$2" flexWrap="wrap">
            {available.map((t) => (
              <Button
                key={t}
                size="$2"
                chromeless
                theme={mfaType === t ? 'blue' : undefined}
                onPress={() => setMfaType(t)}
              >
                {t === 'app'
                  ? 'Authenticator'
                  : t === 'sms'
                    ? 'SMS'
                    : t === 'email'
                      ? 'Email'
                      : 'Recovery code'}
              </Button>
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
          <Label htmlFor="mfa-passcode">
            {mfaType === 'recovery' ? 'Recovery code' : 'Code'}
          </Label>
          <Input
            id="mfa-passcode"
            value={passcode}
            onChangeText={setPasscode}
            keyboardType={mfaType === 'recovery' ? 'default' : 'numeric'}
            autoCapitalize="none"
          />
        </YStack>

        {mfaType !== 'recovery' && rememberHours ? (
          <Card p="$2" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <XStack items="center" gap="$2">
              <Switch
                checked={remember}
                onCheckedChange={(v) => setRemember(Boolean(v))}
                size="$2"
              >
                <Switch.Thumb />
              </Switch>
              <Text fontSize="$2">
                Remember this device for {rememberHours} hours
              </Text>
            </XStack>
          </Card>
        ) : null}

        {(mfaType === 'sms' || mfaType === 'email') && onResend ? (
          <Button
            size="$2"
            chromeless
            onPress={() => void onResend(mfaType as 'sms' | 'email')}
          >
            Resend code
          </Button>
        ) : null}

        {error ? (
          <Paragraph color="#fca5a5" fontSize="$2">
            {error}
          </Paragraph>
        ) : null}

        <Button
          size="$4"
          theme="blue"
          disabled={submitting || !passcode}
          onPress={() => void submit()}
        >
          {submitting ? 'Verifying…' : 'Verify'}
        </Button>

        {onUseRecovery && mfaType !== 'recovery' && available.includes('recovery') ? (
          <Button size="$2" chromeless onPress={onUseRecovery}>
            Use a recovery code instead
          </Button>
        ) : null}
      </YStack>
    </form>
  )
}
