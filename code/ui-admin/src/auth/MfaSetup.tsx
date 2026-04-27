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

import { useState, type ComponentType } from 'react'
import { Card, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { QrCode } from './QrCode'
import type { MfaProps } from './types'

export interface MfaSetupProps {
  // Step 1: verify the current password. Caller submits to backend
  // and resolves on success / rejects with an error message.
  onVerifyPassword: (password: string) => Promise<void>
  // Step 1 → 2: caller initiates MFA setup (POSTs to
  // /v1/iam/mfa/setup/initiate) and returns the props.
  onInitiate: (mfaType: 'app' | 'sms' | 'email') => Promise<MfaProps>
  // Step 2 → 3: caller submits the first user-typed passcode to
  // confirm enrolment.
  onConfirm: (input: { mfaType: 'app' | 'sms' | 'email'; passcode: string }) => Promise<void>
  defaultMfaType?: 'app' | 'sms' | 'email'
  // Optional QR renderer for client-side QR rendering.
  QrRenderer?: ComponentType<{ value: string; size: number }>
  // Called once enrolment succeeds.
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

  const submit = async () => {
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
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done') {
    return (
      <YStack gap="$3" width="100%" maxWidth={480}>
        <Text fontSize="$8" fontWeight="700">MFA enabled</Text>
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
    <YStack
      tag="form"
      gap="$3"
      width="100%"
      maxWidth={480}
      {...({
        onSubmit: (e: React.FormEvent) => {
          e.preventDefault()
          void submit()
        },
        autoComplete: 'on',
        noValidate: true,
      } as never)}
    >
      <Text fontSize="$8" fontWeight="700">
        {step === 'password' ? 'Confirm your password' : 'Set up authenticator'}
      </Text>

      {step === 'password' ? (
        <YStack gap="$2">
          <YStack gap="$1">
            <Text fontSize="$2" color="$placeholderColor">Password</Text>
            <Text
              tag="input"
              {...({
                type: 'password',
                value: password,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value),
                autoComplete: 'current-password',
                name: 'password',
                required: true,
              } as never)}
              px="$2"
              py="$2"
              rounded="$2"
              borderWidth={1}
              borderColor="$borderColor"
              bg="$background"
              color="$color"
            />
          </YStack>
          <XStack gap="$2">
            {(['app', 'sms', 'email'] as const).map((t) => (
              <Text
                key={t}
                tag="button"
                {...({ type: 'button', onClick: () => setMfaType(t) } as never)}
                fontSize="$2"
                color={mfaType === t ? '#60a5fa' : '$placeholderColor'}
                cursor="pointer"
              >
                {t === 'app' ? 'Authenticator app' : t === 'sms' ? 'SMS' : 'Email'}
              </Text>
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
                <Paragraph fontSize="$2" fontFamily={'ui-monospace, monospace' as never}>
                  Secret: {mfa.secret}
                </Paragraph>
              ) : null}
              <Paragraph color="$placeholderColor" fontSize="$2" text="center">
                Scan the QR with your authenticator app, then enter the 6-digit code.
              </Paragraph>
            </YStack>
          ) : (
            <Paragraph color="$placeholderColor" fontSize="$2">
              We sent a code to your {mfaType === 'sms' ? 'phone' : 'email'}.
            </Paragraph>
          )}
          <YStack gap="$1">
            <Text fontSize="$2" color="$placeholderColor">Code</Text>
            <Text
              tag="input"
              {...({
                inputMode: 'numeric',
                autoComplete: 'one-time-code',
                value: passcode,
                onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasscode(e.target.value),
                name: 'passcode',
                pattern: '[0-9]*',
                required: true,
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
        </YStack>
      ) : null}

      {error ? (
        <Paragraph color="#fca5a5" fontSize="$2">
          {error}
        </Paragraph>
      ) : null}

      <Text
        tag="button"
        {...({ type: 'submit', disabled: submitting } as never)}
        px="$4"
        py="$3"
        rounded="$3"
        bg={'#3b82f6' as never}
        color="#ffffff"
        text="center"
        cursor={submitting ? 'progress' : 'pointer'}
        opacity={submitting ? 0.6 : 1}
      >
        {step === 'password' ? 'Continue' : 'Verify & enable'}
      </Text>
    </YStack>
  )
}
