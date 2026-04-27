// ForgotPassword — three-step password reset flow.
//   1. Enter username (or email/phone). Backend resolves the user
//      and tells us which verification channels are available.
//   2. Receive code via email or phone. User submits it.
//   3. Enter new password. Backend re-checks the code, then sets it.
//
// Original at `~/work/hanzo/iam/web/src/auth/ForgetPage.tsx`.
//
// Security:
//   - never display the masked email/phone in the URL.
//   - the password field is `secureTextEntry` and `autoComplete="new-password"`.
//   - CSRF token is echoed.

import { useState } from 'react'
import { Eye, EyeOff } from '@hanzogui/lucide-icons-2/icons'
import { Input, Paragraph, Text, XStack, YStack } from 'hanzogui'
import type { AuthApplication, ForgetPayload } from './types'
import { readCsrfToken, scorePassword } from './util'

type Step = 'username' | 'code' | 'password' | 'done'

export interface ForgotPasswordProps {
  application: AuthApplication
  // Step 1 → step 2: caller resolves the user and either returns
  // the available verify methods or throws on unknown user.
  onResolveUser: (username: string) => Promise<{ email?: string; phone?: string }>
  // Step 2 → step 3: caller verifies the code with the backend.
  // The verifyType reflects which channel ('email' or 'phone') the
  // code was sent through.
  onVerifyCode: (input: { username: string; verifyType: 'email' | 'phone'; code: string }) => Promise<void>
  // Step 3: actually set the new password.
  onResetPassword: (payload: ForgetPayload) => Promise<void>
  onBackToLogin?: () => void
}

export function ForgotPassword({
  application,
  onResolveUser,
  onVerifyCode,
  onResetPassword,
  onBackToLogin,
}: ForgotPasswordProps) {
  const [step, setStep] = useState<Step>('username')
  const [username, setUsername] = useState('')
  const [resolved, setResolved] = useState<{ email?: string; phone?: string } | null>(null)
  const [verifyType, setVerifyType] = useState<'email' | 'phone'>('email')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [csrfToken] = useState(() => readCsrfToken())

  const score = scorePassword(newPassword)

  const submit = async () => {
    setError(null)
    setSubmitting(true)
    try {
      if (step === 'username') {
        const r = await onResolveUser(username.trim())
        setResolved(r)
        setVerifyType(r.email ? 'email' : 'phone')
        setStep('code')
      } else if (step === 'code') {
        await onVerifyCode({ username: username.trim(), verifyType, code })
        setStep('password')
      } else if (step === 'password') {
        const payload: ForgetPayload = {
          application: application.name,
          organization: application.organization || application.owner,
          username: username.trim(),
          newPassword,
          code,
          verifyType,
          csrfToken: csrfToken || undefined,
        }
        await onResetPassword(payload)
        setStep('done')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  if (step === 'done') {
    return (
      <YStack gap="$3" width="100%" maxWidth={400}>
        <Text fontSize="$8" fontWeight="700">
          Password updated
        </Text>
        <Paragraph color="$placeholderColor">
          You can now sign in with your new password.
        </Paragraph>
        {onBackToLogin ? (
          <Text
            tag="button"
            {...({ type: 'button', onClick: onBackToLogin } as never)}
            px="$4"
            py="$3"
            rounded="$3"
            bg={'#3b82f6' as never}
            color="#ffffff"
            text="center"
            cursor="pointer"
          >
            Back to sign in
          </Text>
        ) : null}
      </YStack>
    )
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
        Reset your password
      </Text>

      {step === 'username' ? (
        <YStack gap="$1">
          <Text fontSize="$2" color="$placeholderColor">
            Username, email, or phone
          </Text>
          <Input
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            {...({ autoComplete: 'username', name: 'username', required: true, spellCheck: false } as never)}
          />
        </YStack>
      ) : null}

      {step === 'code' ? (
        <YStack gap="$2">
          <Paragraph color="$placeholderColor" fontSize="$2">
            We sent a code to your{' '}
            {verifyType === 'email' ? resolved?.email : resolved?.phone}.
          </Paragraph>
          {resolved?.email && resolved?.phone ? (
            <XStack gap="$2">
              <Text
                tag="button"
                {...({ type: 'button', onClick: () => setVerifyType('email') } as never)}
                fontSize="$2"
                color={verifyType === 'email' ? '#60a5fa' : '$placeholderColor'}
                cursor="pointer"
              >
                Email
              </Text>
              <Text
                tag="button"
                {...({ type: 'button', onClick: () => setVerifyType('phone') } as never)}
                fontSize="$2"
                color={verifyType === 'phone' ? '#60a5fa' : '$placeholderColor'}
                cursor="pointer"
              >
                Phone
              </Text>
            </XStack>
          ) : null}
          <Input
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            {...({ autoComplete: 'one-time-code', inputMode: 'numeric', name: 'code' } as never)}
          />
        </YStack>
      ) : null}

      {step === 'password' ? (
        <YStack gap="$1">
          <Text fontSize="$2" color="$placeholderColor">New password *</Text>
          <XStack items="center" gap="$2">
            <Input
              flex={1}
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
              {...({
                type: showPassword ? 'text' : 'password',
                autoComplete: 'new-password',
                name: 'newPassword',
                required: true,
                minLength: 8,
              } as never)}
            />
            <Text
              tag="button"
              {...({ type: 'button', onClick: () => setShowPassword((s) => !s) } as never)}
              cursor="pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Text>
          </XStack>
          <Text fontSize="$1" color={score >= 3 ? '#86efac' : score >= 2 ? '#f59e0b' : '#fca5a5'}>
            {score >= 3 ? 'Strong.' : score >= 2 ? 'OK.' : 'Weak.'}
          </Text>
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
        {step === 'username'
          ? 'Continue'
          : step === 'code'
            ? 'Verify code'
            : 'Set new password'}
      </Text>

      {onBackToLogin ? (
        <Paragraph color="$placeholderColor" fontSize="$2" text="center">
          Remembered it?{' '}
          <Text
            tag="button"
            {...({ type: 'button', onClick: onBackToLogin } as never)}
            color="#60a5fa"
            cursor="pointer"
          >
            Back to sign in
          </Text>
        </Paragraph>
      ) : null}
    </YStack>
  )
}
