// SMTP settings — sender meta + SMTP server config + test email.
// Source-of-truth: settings.smtp + settings.meta in the Base store.

import { useState } from 'react'
import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import { authedFetcher, testEmail, updateSettings } from '../lib/api'
import { SectionCard } from '../components/SectionCard'

interface SmtpSettings {
  enabled?: boolean
  host?: string
  port?: number
  username?: string
  password?: string
  authMethod?: string
  tls?: boolean
  localName?: string
}

interface MetaSettings {
  senderName?: string
  senderAddress?: string
}

const tlsOptions = [
  { value: 'auto', label: 'Auto' },
  { value: 'always', label: 'Always' },
] as const

const authMethods = ['PLAIN', 'LOGIN'] as const

const templateOptions = [
  'verification',
  'password-reset',
  'email-change',
  'otp',
  'login-alert',
] as const

export function SettingsSmtp() {
  const settingsRes = useFetch<{ smtp?: SmtpSettings; meta?: MetaSettings }>(
    '/api/settings',
    { fetcher: authedFetcher as never },
  )

  const smtp = settingsRes.data?.smtp
  const meta = settingsRes.data?.meta

  const [smtpForm, setSmtpForm] = useState<SmtpSettings | null>(null)
  const [metaForm, setMetaForm] = useState<MetaSettings | null>(null)

  const smtpVals: SmtpSettings = smtpForm ?? {
    enabled: smtp?.enabled ?? false,
    host: smtp?.host ?? '',
    port: smtp?.port ?? 587,
    username: smtp?.username ?? '',
    password: smtp?.password ?? '',
    authMethod: smtp?.authMethod ?? 'PLAIN',
    tls: smtp?.tls ?? false,
    localName: smtp?.localName ?? '',
  }

  const metaVals: MetaSettings = metaForm ?? {
    senderName: meta?.senderName ?? '',
    senderAddress: meta?.senderAddress ?? '',
  }

  const dirty = smtpForm !== null || metaForm !== null

  function setSmtp<K extends keyof SmtpSettings>(k: K, v: SmtpSettings[K]) {
    setSmtpForm({ ...smtpVals, [k]: v })
  }
  function setMeta<K extends keyof MetaSettings>(k: K, v: MetaSettings[K]) {
    setMetaForm({ ...metaVals, [k]: v })
  }

  const [saving, setSaving] = useState(false)
  const [savedAt, setSavedAt] = useState(0)
  const [saveError, setSaveError] = useState('')

  async function save() {
    setSaving(true)
    setSaveError('')
    try {
      const smtpPayload: SmtpSettings = { ...smtpVals }
      if (smtpPayload.password === smtp?.password) delete smtpPayload.password
      await updateSettings({
        smtp: smtpPayload,
        meta: {
          senderName: metaVals.senderName,
          senderAddress: metaVals.senderAddress,
        },
      })
      await settingsRes.mutate()
      setSmtpForm(null)
      setMetaForm(null)
      setSavedAt(Date.now())
    } catch (err) {
      setSaveError((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  // Test email state
  const [testOpen, setTestOpen] = useState(false)
  const [testTo, setTestTo] = useState('')
  const [testTemplate, setTestTemplate] = useState<string>(templateOptions[0])
  const [testCollection, setTestCollection] = useState('_superusers')
  const [testStatus, setTestStatus] = useState('')
  const [testError, setTestError] = useState(false)
  const [testing, setTesting] = useState(false)

  async function sendTest() {
    setTesting(true)
    setTestError(false)
    setTestStatus('')
    try {
      await testEmail(testCollection, testTo, testTemplate)
      setTestStatus('Test email sent.')
    } catch (err) {
      setTestError(true)
      setTestStatus((err as Error)?.message ?? 'Send failed.')
    } finally {
      setTesting(false)
    }
  }

  if (settingsRes.isLoading) return <LoadingState />
  if (settingsRes.error) return <ErrorState error={settingsRes.error as Error} />

  return (
    <YStack gap="$4">
      <SectionCard
        title="Sender"
        description="Default sender name and address for outgoing emails."
      >
        <XStack gap="$3" flexWrap="wrap">
          <YStack gap="$1.5" flex={1} minW={220}>
            <Text fontSize="$2" color="$placeholderColor">
              Sender name
            </Text>
            <Input
              value={String(metaVals.senderName ?? '')}
              onChangeText={(v: string) => setMeta('senderName', v)}
            />
          </YStack>
          <YStack gap="$1.5" flex={1} minW={220}>
            <Text fontSize="$2" color="$placeholderColor">
              Sender address
            </Text>
            <Input
              value={String(metaVals.senderAddress ?? '')}
              onChangeText={(v: string) => setMeta('senderAddress', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>
        </XStack>
      </SectionCard>

      <SectionCard
        title="SMTP"
        description="Configure SMTP mail server for sending emails."
      >
        <XStack items="center" gap="$2">
          <Button
            size="$2"
            onPress={() => setSmtp('enabled', !smtpVals.enabled)}
            bg={smtpVals.enabled ? ('#f2f2f2' as never) : 'transparent'}
            borderWidth={1}
            borderColor={smtpVals.enabled ? ('#f2f2f2' as never) : '$borderColor'}
          >
            <Text fontSize="$2" color={smtpVals.enabled ? ('#070b13' as never) : '$color'}>
              {smtpVals.enabled ? 'SMTP enabled' : 'SMTP disabled'}
            </Text>
          </Button>
          <Text fontSize="$1" color="$placeholderColor">
            (recommended over local sendmail)
          </Text>
        </XStack>

        {smtpVals.enabled ? (
          <YStack gap="$3">
            <XStack gap="$3" flexWrap="wrap">
              <YStack gap="$1.5" flex={2} minW={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  Host
                </Text>
                <Input
                  value={String(smtpVals.host ?? '')}
                  onChangeText={(v: string) => setSmtp('host', v)}
                />
              </YStack>
              <YStack gap="$1.5" width={120}>
                <Text fontSize="$2" color="$placeholderColor">
                  Port
                </Text>
                <Input
                  value={String(smtpVals.port ?? 587)}
                  onChangeText={(v: string) => setSmtp('port', Number(v) || 0)}
                  keyboardType="number-pad"
                />
              </YStack>
              <YStack gap="$1.5" width={180}>
                <Text fontSize="$2" color="$placeholderColor">
                  TLS
                </Text>
                <XStack gap="$1.5">
                  {tlsOptions.map((o) => {
                    const active = (o.value === 'always') === Boolean(smtpVals.tls)
                    return (
                      <Button
                        key={o.value}
                        size="$2"
                        onPress={() => setSmtp('tls', o.value === 'always')}
                        bg={active ? ('#f2f2f2' as never) : 'transparent'}
                        borderWidth={1}
                        borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
                      >
                        <Text fontSize="$2" color={active ? ('#070b13' as never) : '$color'}>
                          {o.label}
                        </Text>
                      </Button>
                    )
                  })}
                </XStack>
              </YStack>
            </XStack>

            <XStack gap="$3" flexWrap="wrap">
              <YStack gap="$1.5" flex={1} minW={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  Username
                </Text>
                <Input
                  value={String(smtpVals.username ?? '')}
                  onChangeText={(v: string) => setSmtp('username', v)}
                  autoCapitalize="none"
                />
              </YStack>
              <YStack gap="$1.5" flex={1} minW={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  Password
                </Text>
                <Input
                  value={String(smtpVals.password ?? '')}
                  onChangeText={(v: string) => setSmtp('password', v)}
                  secureTextEntry
                  autoComplete="off"
                />
              </YStack>
            </XStack>

            <XStack gap="$3" flexWrap="wrap">
              <YStack gap="$1.5" width={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  AUTH method
                </Text>
                <XStack gap="$1.5">
                  {authMethods.map((m) => {
                    const active = m === smtpVals.authMethod
                    return (
                      <Button
                        key={m}
                        size="$2"
                        onPress={() => setSmtp('authMethod', m)}
                        bg={active ? ('#f2f2f2' as never) : 'transparent'}
                        borderWidth={1}
                        borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
                      >
                        <Text fontSize="$2" color={active ? ('#070b13' as never) : '$color'}>
                          {m}
                        </Text>
                      </Button>
                    )
                  })}
                </XStack>
              </YStack>
              <YStack gap="$1.5" flex={1} minW={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  EHLO/HELO domain
                </Text>
                <Input
                  value={String(smtpVals.localName ?? '')}
                  onChangeText={(v: string) => setSmtp('localName', v)}
                  placeholder="localhost"
                />
              </YStack>
            </XStack>
          </YStack>
        ) : null}

        <XStack gap="$2" items="center" pt="$2">
          <Button
            size="$3"
            disabled={!dirty || saving}
            onPress={save}
            bg={'#f2f2f2' as never}
            hoverStyle={{ background: '#ffffff' as never }}
          >
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {saving ? 'Saving…' : 'Save changes'}
            </Text>
          </Button>
          {savedAt > 0 && !dirty ? (
            <Text fontSize="$1" color="$green10">
              Saved.
            </Text>
          ) : null}
          {saveError ? (
            <Text fontSize="$1" color="$red10">
              {saveError}
            </Text>
          ) : null}
        </XStack>
      </SectionCard>

      <SectionCard
        title="Test email"
        description="Send a test email to verify your SMTP configuration."
      >
        <XStack>
          <Button size="$3" onPress={() => setTestOpen(!testOpen)}>
            {testOpen ? 'Hide test form' : 'Send test email'}
          </Button>
        </XStack>
        {testOpen ? (
          <YStack gap="$3">
            <XStack gap="$3" flexWrap="wrap">
              <YStack gap="$1.5" flex={1} minW={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  To email
                </Text>
                <Input
                  value={testTo}
                  onChangeText={setTestTo}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </YStack>
              <YStack gap="$1.5" flex={1} minW={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  Auth collection
                </Text>
                <Input value={testCollection} onChangeText={setTestCollection} />
              </YStack>
            </XStack>
            <YStack gap="$1.5">
              <Text fontSize="$2" color="$placeholderColor">
                Template
              </Text>
              <XStack gap="$1.5" flexWrap="wrap">
                {templateOptions.map((t) => {
                  const active = t === testTemplate
                  return (
                    <Button
                      key={t}
                      size="$2"
                      onPress={() => setTestTemplate(t)}
                      bg={active ? ('#f2f2f2' as never) : 'transparent'}
                      borderWidth={1}
                      borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
                    >
                      <Text fontSize="$2" color={active ? ('#070b13' as never) : '$color'}>
                        {t}
                      </Text>
                    </Button>
                  )
                })}
              </XStack>
            </YStack>
            <XStack gap="$2" items="center">
              <Button
                size="$3"
                disabled={testing}
                onPress={sendTest}
                bg={'#f2f2f2' as never}
                hoverStyle={{ background: '#ffffff' as never }}
              >
                <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                  {testing ? 'Sending…' : 'Send'}
                </Text>
              </Button>
              {testStatus ? (
                <Text fontSize="$1" color={testError ? '$red10' : '$green10'}>
                  {testStatus}
                </Text>
              ) : null}
            </XStack>
          </YStack>
        ) : null}
      </SectionCard>
    </YStack>
  )
}
