import { useState } from 'react'
import { Button, Card, Input, Label, Stack, Text } from '@hanzo/gui'

export type SignInFormProps = {
  onSubmit: (values: { email: string; password: string }) => Promise<void> | void
  title?: string
}

export function SignInForm({ onSubmit, title = 'Sign in' }: SignInFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async () => {
    setError(null)
    if (!email || !password) {
      setError('Email and password are required.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({ email, password })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Sign-in failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card padding="$4" gap="$3" width={360}>
      <Text fontSize="$6" fontWeight="700">{title}</Text>
      <Stack gap="$2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
      </Stack>
      <Stack gap="$2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </Stack>
      {error && <Text color="$red10">{error}</Text>}
      <Button onPress={handleSubmit} disabled={submitting}>
        {submitting ? 'Signing in…' : 'Sign in'}
      </Button>
    </Card>
  )
}
