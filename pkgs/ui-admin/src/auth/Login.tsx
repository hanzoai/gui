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
//     `type="password"` (web). Toggleable via the eye button.
//   - CSRF token is read from the `csrf_token` cookie and submitted
//     as a hidden form field. Never as a custom header.
//   - Captcha is delegated to <Captcha>; the widget produces a
//     token that we forward in the POST body.

import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from 'react'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { EyeOff } from '@hanzogui/lucide-icons-2/icons/EyeOff'
import { Button, Input, Label, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Captcha } from './Captcha'
import type { AuthApplication, CaptchaConfig, LoginPayload } from './types'
import { isEmail, isPhoneShape, readCsrfToken } from './util'

export interface LoginProps {
  application: AuthApplication
  onSubmit: (payload: LoginPayload) => Promise<void>
  onSignup?: () => void
  onForgot?: () => void
  captcha?: CaptchaConfig
  CaptchaWidget?: ComponentType<{
    siteKey: string
    onToken: (token: string) => void
    onError?: (msg: string) => void
  }>
  initialUsername?: string
  defaultMode?: 'Password' | 'Verification code'
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

  const canSubmit =
    username.trim().length > 0 &&
    (mode === 'Password' ? password.length > 0 : code.length > 0)

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
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
    <form onSubmit={submit} autoComplete="on" noValidate>
      {/* CSRF token — server enforces same-origin via this echo. */}
      <input type="hidden" name="csrfToken" value={csrfToken} readOnly />

      <YStack gap="$3" width="100%" maxW={400}>
        <Text fontSize="$8" fontWeight="700">
          {application.displayName || 'Sign in'}
        </Text>

        <YStack gap="$1">
          <Label htmlFor="login-username">
            {usernameKind === 'email'
              ? 'Email'
              : usernameKind === 'phone'
                ? 'Phone'
                : 'Username, email, or phone'}
          </Label>
          <Input
            id="login-username"
            value={username}
            onChangeText={setUsername}
            placeholder="you@example.com"
            autoCapitalize="none"
          />
        </YStack>

        {mode === 'Password' ? (
          <YStack gap="$1">
            <XStack items="center" justify="space-between">
              <Label htmlFor="login-password">Password</Label>
              {onForgot ? (
                <Button size="$1" chromeless onPress={onForgot}>
                  Forgot?
                </Button>
              ) : null}
            </XStack>
            <XStack items="center" gap="$2">
              <Input
                id="login-password"
                flex={1}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                secureTextEntry={!showPassword}
              />
              <Button
                size="$2"
                chromeless
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                onPress={() => setShowPassword((s) => !s)}
                icon={showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              />
            </XStack>
          </YStack>
        ) : (
          <YStack gap="$1">
            <Label htmlFor="login-code">Verification code</Label>
            <Input
              id="login-code"
              value={code}
              onChangeText={setCode}
              placeholder="123456"
              autoCapitalize="none"
              keyboardType="numeric"
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

        <Button
          size="$4"
          theme="blue"
          disabled={!canSubmit || submitting}
          onPress={() => void submit()}
        >
          {submitting ? 'Signing in…' : 'Sign in'}
        </Button>

        {application.enableCodeSignin ? (
          <Button
            size="$2"
            chromeless
            onPress={() =>
              setMode((m) => (m === 'Password' ? 'Verification code' : 'Password'))
            }
          >
            {mode === 'Password' ? 'Use verification code instead' : 'Use password instead'}
          </Button>
        ) : null}

        {application.enableSignUp && onSignup ? (
          <XStack gap="$2" justify="center">
            <Paragraph color="$placeholderColor" fontSize="$2">
              New here?
            </Paragraph>
            <Button size="$2" chromeless onPress={onSignup}>
              Create an account
            </Button>
          </XStack>
        ) : null}
      </YStack>
    </form>
  )
}
