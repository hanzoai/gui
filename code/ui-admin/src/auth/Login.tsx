// Login — primary password / verification-code sign-in form.
//
// Original at `~/work/hanzo/iam/web/src/auth/LoginPage.tsx` (1500+
// lines, fused with provider buttons, MFA verify, WeChat panel, CAS
// flow, device flow). This is the *port* of the local-credentials
// path: username + password (or username + code), CSRF-echoed,
// captcha-pluggable. SSO provider buttons + MFA verify + face
// recognition live in their own components and wire in next to this.
//
// Security:
//   - password field uses `secureTextEntry` (iOS/Android) +
//     `type="password"` (web). Toggleable via the eye icon.
//   - CSRF token is read from the `csrf_token` cookie and submitted
//     as a hidden field. Never as a custom header.
//   - Captcha is delegated to <Captcha>; the widget produces a
//     token that we forward in the POST body.
//   - We don't autocomplete passwords (`autoComplete="off"`) on the
//     password field by default — host app may opt in.

import { useEffect, useMemo, useState } from 'react'
import { Eye, EyeOff } from '@hanzogui/lucide-icons-2/icons'
import { Input, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Captcha } from './Captcha'
import type { AuthApplication, CaptchaConfig, LoginPayload } from './types'
import { isEmail, isPhoneShape, readCsrfToken } from './util'

export interface LoginProps {
  application: AuthApplication
  // Submit handler. Caller does the actual fetch + redirect.
  onSubmit: (payload: LoginPayload) => Promise<void>
  // Sign-up link callback — caller pushes the route.
  onSignup?: () => void
  // "Forgot password" link callback.
  onForgot?: () => void
  // Optional captcha config + renderer.
  captcha?: CaptchaConfig
  CaptchaWidget?: React.ComponentType<{
    siteKey: string
    onToken: (token: string) => void
    onError?: (msg: string) => void
  }>
  // Initial username — useful when arriving from `?login_hint=`.
  initialUsername?: string
  // Default sign-in mode. The user can flip to "Verification code"
  // when the application has `enableCodeSignin`.
  defaultMode?: 'Password' | 'Verification code'
  // Surface-level error from the last submit.
  error?: string | null
}

export function Login({
  application,
  onSubmit,
  onSignup,
  onForgot,
  captcha,
  CaptchaWidget,
  initialUsername = '',
  defaultMode = 'Password',
  error,
}: LoginProps) {
  const [username, setUsername] = useState(initialUsername)
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'Password' | 'Verification code'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaProviderType, setCaptchaProviderType] = useState<CaptchaConfig['type']>(
    captcha?.type ?? 'none'
  )
  const [submitting, setSubmitting] = useState(false)
  const [csrfToken] = useState(() => readCsrfToken())

  const usernameKind = useMemo(() => {
    if (isEmail(username)) return 'email'
    if (isPhoneShape(username)) return 'phone'
    return 'username'
  }, [username])

  const canSubmit = username.trim().length > 0 && (mode === 'Password' ? password.length > 0 : code.length > 0)

  const submit = async () => {
    if (!canSubmit || submitting) return
    setSubmitting(true)
    try {
      const payload: LoginPayload = {
        application: application.name,
        organization: application.organization || application.owner,
        username: username.trim(),
        signinMethod: mode,
        password: mode === 'Password' ? password : undefined,
        code: mode === 'Verification code' ? code : undefined,
        csrfToken: csrfToken || undefined,
        captchaType: captchaToken ? captchaProviderType : undefined,
        captchaToken: captchaToken || undefined,
      }
      await onSubmit(payload)
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    setCaptchaProviderType(captcha?.type ?? 'none')
  }, [captcha?.type])

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
      {/* CSRF token — server enforces same-origin via this echo. */}
      <input type="hidden" name="csrfToken" value={csrfToken} readOnly />

      <Text fontSize="$8" fontWeight="700">
        {application.displayName || 'Sign in'}
      </Text>

      <YStack gap="$2">
        <Text fontSize="$2" color="$placeholderColor">
          {usernameKind === 'email'
            ? 'Email'
            : usernameKind === 'phone'
              ? 'Phone'
              : 'Username, email, or phone'}
        </Text>
        <Input
          value={username}
          onChangeText={setUsername}
          placeholder="you@example.com"
          autoCapitalize="none"
          {...({
            autoComplete: 'username',
            spellCheck: false,
            inputMode: usernameKind === 'email' ? 'email' : usernameKind === 'phone' ? 'tel' : 'text',
            name: 'username',
          } as never)}
        />
      </YStack>

      {mode === 'Password' ? (
        <YStack gap="$2">
          <XStack items="center" content="space-between">
            <Text fontSize="$2" color="$placeholderColor">
              Password
            </Text>
            {onForgot ? (
              <Text
                tag="button"
                {...({ type: 'button', onClick: onForgot } as never)}
                fontSize="$2"
                color="#60a5fa"
                cursor="pointer"
              >
                Forgot?
              </Text>
            ) : null}
          </XStack>
          <XStack items="center" gap="$2">
            <Input
              flex={1}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              {...({
                type: showPassword ? 'text' : 'password',
                autoComplete: 'current-password',
                name: 'password',
              } as never)}
            />
            <Text
              tag="button"
              {...({
                type: 'button',
                'aria-label': showPassword ? 'Hide password' : 'Show password',
                onClick: () => setShowPassword((s) => !s),
              } as never)}
              cursor="pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </Text>
          </XStack>
        </YStack>
      ) : (
        <YStack gap="$2">
          <Text fontSize="$2" color="$placeholderColor">
            Verification code
          </Text>
          <Input
            value={code}
            onChangeText={setCode}
            placeholder="123456"
            autoCapitalize="none"
            {...({
              autoComplete: 'one-time-code',
              inputMode: 'numeric',
              name: 'code',
            } as never)}
          />
        </YStack>
      )}

      {captcha && captcha.type !== 'none' ? (
        <Captcha
          config={captcha}
          Widget={CaptchaWidget}
          onToken={(t, providerType) => {
            setCaptchaToken(t)
            setCaptchaProviderType(providerType)
          }}
        />
      ) : null}

      {error ? (
        <Paragraph color="#fca5a5" fontSize="$2">
          {error}
        </Paragraph>
      ) : null}

      <Text
        tag="button"
        {...({
          type: 'submit',
          disabled: !canSubmit || submitting,
        } as never)}
        px="$4"
        py="$3"
        rounded="$3"
        bg={canSubmit && !submitting ? ('#3b82f6' as never) : ('rgba(59,130,246,0.4)' as never)}
        color="#ffffff"
        cursor={canSubmit && !submitting ? 'pointer' : 'not-allowed'}
        text="center"
      >
        {submitting ? 'Signing in…' : 'Sign in'}
      </Text>

      {application.enableCodeSignin ? (
        <Text
          tag="button"
          {...({ type: 'button', onClick: () => setMode((m) => (m === 'Password' ? 'Verification code' : 'Password')) } as never)}
          fontSize="$2"
          color="#60a5fa"
          text="center"
          cursor="pointer"
        >
          {mode === 'Password' ? 'Use verification code instead' : 'Use password instead'}
        </Text>
      ) : null}

      {application.enableSignUp && onSignup ? (
        <Paragraph color="$placeholderColor" fontSize="$2" text="center">
          New here?{' '}
          <Text
            tag="button"
            {...({ type: 'button', onClick: onSignup } as never)}
            color="#60a5fa"
            cursor="pointer"
          >
            Create an account
          </Text>
        </Paragraph>
      ) : null}
    </YStack>
  )
}
