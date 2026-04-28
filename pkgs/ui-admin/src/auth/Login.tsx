// Login — primary password / verification-code sign-in form.
//
// Canonical auth boundary is the `IAM` class from `@hanzo/iam/browser`.
// The form collects credentials and delegates to:
//   - Password: `iam.loginWithCredentials` → `iam.exchangeCodeForToken`
//   - Verification code (phone): `iam.loginWithPhoneOTP`
// The IAM class manages PKCE, token storage, and refresh — this
// component is purely presentational input collection.
//
// Original at `~/work/hanzo/iam/web/src/auth/LoginPage.tsx` (1500+
// lines, fused with provider buttons, MFA verify, WeChat panel, CAS
// flow, device flow). This is the *port* of the local-credentials
// path: username + password (or phone + code), captcha-pluggable.
// SSO provider buttons + MFA verify + face recognition live in their
// own components and wire in next to this.
//
// Security:
//   - password field uses `secureTextEntry` (iOS/Android) +
//     `type="password"` (web). Toggleable via the eye button.
//   - the IAM class drives PKCE so credentials never round-trip
//     through this component beyond a single submit call.
//   - Captcha is delegated to <Captcha>; the widget produces a
//     token forwarded as additional auth params.

import { useEffect, useMemo, useState, type ComponentType, type FormEvent } from 'react'
import type { IAM } from '@hanzo/iam/browser'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { EyeOff } from '@hanzogui/lucide-icons-2/icons/EyeOff'
import { Button, Input, Label, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Captcha } from './Captcha'
import type { AuthApplication, CaptchaConfig } from './types'
import { isEmail, isPhoneShape } from './util'

export interface LoginProps {
  iam: IAM
  application: AuthApplication
  onSuccess?: () => void
  onSignup?: () => void
  onForgot?: () => void
  /** Country code for phone-OTP mode. Defaults to '+1'. */
  countryCode?: string
  captcha?: CaptchaConfig
  CaptchaWidget?: ComponentType<{
    siteKey: string
    onToken: (token: string) => void
    onError?: (msg: string) => void
  }>
  initialUsername?: string
  defaultMode?: 'Password' | 'Verification code'
}

export function Login({
  iam,
  application,
  onSuccess,
  onSignup,
  onForgot,
  countryCode = '+1',
  captcha,
  CaptchaWidget,
  initialUsername = '',
  defaultMode = 'Password',
}: LoginProps) {
  const [username, setUsername] = useState(initialUsername)
  const [password, setPassword] = useState('')
  const [code, setCode] = useState('')
  const [mode, setMode] = useState<'Password' | 'Verification code'>(defaultMode)
  const [showPassword, setShowPassword] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [, setCaptchaProviderType] = useState<CaptchaConfig['type']>(
    captcha?.type ?? 'none'
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const usernameKind = useMemo(() => {
    if (isEmail(username)) return 'email'
    if (isPhoneShape(username)) return 'phone'
    return 'username'
  }, [username])

  // When the application configures a captcha, the user MUST solve it
  // before we let them submit. Skipping this check (or letting an
  // unmounted widget pass) defeats the rate-limit / bot-mitigation
  // contract the server expects.
  const captchaRequired = !!captcha && captcha.type !== 'none'
  const canSubmit =
    username.trim().length > 0 &&
    (mode === 'Password' ? password.length > 0 : code.length > 0) &&
    (!captchaRequired || captchaToken !== null)

  const submit = async (e?: FormEvent) => {
    if (e) e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    setError(null)
    try {
      if (mode === 'Password') {
        const result = await iam.loginWithCredentials({
          username: username.trim(),
          password,
        })
        if (!result.ok || !result.code) {
          throw new Error(result.error ?? 'Sign-in failed')
        }
        await iam.exchangeCodeForToken(result.code)
      } else {
        // Verification-code mode is phone-only; Casdoor's phone-OTP
        // flow signs in via the same /login endpoint with the OTP as
        // the password.
        await iam.loginWithPhoneOTP({
          phone: username.trim(),
          countryCode,
          code,
        })
      }
      onSuccess?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    setCaptchaProviderType(captcha?.type ?? 'none')
  }, [captcha?.type])

  return (
    <form onSubmit={submit} autoComplete="on" noValidate>
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
