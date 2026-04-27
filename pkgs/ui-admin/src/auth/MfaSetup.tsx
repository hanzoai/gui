// MfaSetup — three-step MFA enrolment.
//   1. Verify the user's password (proof-of-possession before we
//      hand out a TOTP secret).
//   2. Show the secret + QR + collect the first valid code.
//   3. Confirm — backend flips the flag and emits recovery codes.
//
// Original at `~/work/hanzo/iam/web/src/auth/MfaSetupPage.tsx`.
//
// Security:
//   - the secret never lives in URL params; it's returned in the
//     response body of step 1 → step 2.
//   - recovery codes are shown exactly once and the host app must
//     prompt the user to save them before progressing.

import { useState, type ComponentType, type FormEvent } from 'react'
import { Button, Card, Input, Label, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { QrCode } from './QrCode'
import type { MfaProps } from './types'

export interface MfaSetupProps {
  onVerifyPassword: (password: string) => Promise<void>
  onInitiate: (mfaType: 'app' | 'sms' | 'email') => Promise<MfaProps>
  onConfirm: (input: {
    mfaType: 'app' | 'sms' | 'email'
    passcode: string
  }) => Promise<void>
  defaultMfaType?: 'app' | 'sms' | 'email'
  QrRenderer?: ComponentType<{ value: string; size: number }>
  onComplete?: () => void
}

type Step = 'password' | 'verify' | 'done'

export function MfaSetup({
  onVerifyPassword,
  onInitiate,
  onConfirm,
  defaultMfaType = 'app',
  QrRenderer,
  onComplete,
}: MfaSetupProps) {
  const [step, setStep] = useState<Step>('password')
  const [mfaType, setMfaType] = useState<'app' | 'sms' | 'email'>(defaultMfaType)
  const [password, setPassword] = useState('')
  const [passcode, setPasscode] = useState('')
  const [mfa, setMfa] = useState<MfaProps | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (step === 'password') {
        await onVerifyPassword(password)
        const props = await onInitiate(mfaType)
        setMfa(props)
        setPassword('')
        setStep('verify')
      } else if (step === 'verify') {
        await onConfirm({ mfaType, passcode })
        setStep('done')
        onComplete?.()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done') {
    return (
      <YStack gap="$3" width="100%" maxW={480}>
        <Text fontSize="$8" fontWeight="700">
          MFA enabled
        </Text>
        <Paragraph color="$placeholderColor">
          Save your recovery codes somewhere safe. They won't be shown again.
        </Paragraph>
        {mfa?.recoveryCodes?.length ? (
          <Card p="$3" bg="$background" borderColor="$borderColor" borderWidth={1}>
            <YStack gap="$1">
              {mfa.recoveryCodes.map((c) => (
                <Text key={c} fontFamily={'ui-monospace, monospace' as never} fontSize="$3">
                  {c}
                </Text>
              ))}
            </YStack>
          </Card>
        ) : null}
      </YStack>
    )
  }

  return (
    <form onSubmit={submit} autoComplete="on" noValidate>
      <YStack gap="$3" width="100%" maxW={480}>
        <Text fontSize="$8" fontWeight="700">
          {step === 'password' ? 'Confirm your password' : 'Set up authenticator'}
        </Text>

        {step === 'password' ? (
          <YStack gap="$3">
            <YStack gap="$1">
              <Label htmlFor="mfa-password">Password</Label>
              <Input
                id="mfa-password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </YStack>
            <XStack gap="$2">
              {(['app', 'sms', 'email'] as const).map((t) => (
                <Button
                  key={t}
                  size="$2"
                  chromeless
                  theme={mfaType === t ? 'blue' : undefined}
                  onPress={() => setMfaType(t)}
                >
                  {t === 'app' ? 'Authenticator app' : t === 'sms' ? 'SMS' : 'Email'}
                </Button>
              ))}
            </XStack>
          </YStack>
        ) : null}

        {step === 'verify' && mfa ? (
          <YStack gap="$3">
            {mfaType === 'app' ? (
              <YStack gap="$2" items="center">
                {mfa.qrCodeDataUrl || mfa.url ? (
                  <QrCode dataUrl={mfa.qrCodeDataUrl} value={mfa.url} Renderer={QrRenderer} />
                ) : null}
                {mfa.secret ? (
                  <Paragraph
                    fontSize="$2"
                    fontFamily={'ui-monospace, monospace' as never}
                  >
                    Secret: {mfa.secret}
                  </Paragraph>
                ) : null}
                <Paragraph color="$placeholderColor" fontSize="$2">
                  Scan the QR with your authenticator app, then enter the 6-digit code.
                </Paragraph>
              </YStack>
            ) : (
              <Paragraph color="$placeholderColor" fontSize="$2">
                We sent a code to your {mfaType === 'sms' ? 'phone' : 'email'}.
              </Paragraph>
            )}
            <YStack gap="$1">
              <Label htmlFor="mfa-passcode">Code</Label>
              <Input
                id="mfa-passcode"
                value={passcode}
                onChangeText={setPasscode}
                keyboardType="numeric"
              />
            </YStack>
          </YStack>
        ) : null}

        {error ? (
          <Paragraph color="#fca5a5" fontSize="$2">
            {error}
          </Paragraph>
        ) : null}

        <Button
          size="$4"
          theme="blue"
          disabled={submitting}
          onPress={() => void submit()}
        >
          {step === 'password' ? 'Continue' : 'Verify & enable'}
        </Button>
      </YStack>
    </form>
  )
}
