// Login — unguarded route. On success, push to /collections.

import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, Card, H2, Input, Text, YStack } from 'hanzogui'
import { authWithPassword } from '../lib/api'

export function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname ?? '/collections'

  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit() {
    if (submitting) return
    setError('')
    setSubmitting(true)
    try {
      await authWithPassword(identity, password)
      navigate(from, { replace: true })
    } catch (err) {
      setError((err as Error)?.message ?? 'Sign-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <YStack flex={1} items="center" justify="center" minH="100vh" bg="$background" p="$4">
      <Card
        width={360}
        p="$6"
        gap="$4"
        bg="$background"
        borderColor="$borderColor"
        borderWidth={1}
      >
        <H2 size="$6" color="$color">
          Sign in to Base
        </H2>
        <YStack gap="$3">
          <YStack gap="$1">
            <Text fontSize="$2" color="$placeholderColor">
              Email
            </Text>
            <Input
              value={identity}
              onChangeText={setIdentity}
              autoComplete="email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>
          <YStack gap="$1">
            <Text fontSize="$2" color="$placeholderColor">
              Password
            </Text>
            <Input
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="current-password"
              onSubmitEditing={handleSubmit}
            />
          </YStack>
          {error ? (
            <Text fontSize="$2" color="$red10">
              {error}
            </Text>
          ) : null}
          <Button onPress={handleSubmit} disabled={submitting} themeInverse>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </YStack>
      </Card>
    </YStack>
  )
}
