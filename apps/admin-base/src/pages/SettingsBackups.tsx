// SettingsBackups — list / create / restore / delete database backups
// + auto-backup cron + S3 storage options. Replaces the legacy
// ui-react/Tailwind page with Hanzo GUI v7 + @hanzogui/admin DataTable.

import { useState } from 'react'
import { Button, Card, Input, Text, XStack, YStack } from 'hanzogui'
import {
  DataTable,
  Empty,
  ErrorState,
  LoadingState,
  useFetch,
  type DataTableColumn,
} from '@hanzogui/admin'
import {
  authedFetcher,
  createBackup,
  deleteBackup,
  getBackupDownloadURL,
  getFileToken,
  restoreBackup,
  updateSettings,
  type BackupModel,
} from '../lib/api'
import { SectionCard } from '../components/SectionCard'

interface S3Settings {
  enabled?: boolean
  endpoint?: string
  bucket?: string
  region?: string
  accessKey?: string
  secret?: string
  forcePathStyle?: boolean
}

interface BackupsSettings {
  cron?: string
  cronMaxKeep?: number
  s3?: S3Settings
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

const tableCols: DataTableColumn[] = [
  { key: 'name', label: 'Name', flex: 3 },
  { key: 'size', label: 'Size', flex: 1 },
  { key: 'actions', label: '', flex: 2 },
]

export function SettingsBackups() {
  const settings = useFetch<{ backups?: BackupsSettings }>(
    '/api/settings',
    { fetcher: authedFetcher as never },
  )
  const backups = useFetch<BackupModel[]>('/api/backups', {
    fetcher: authedFetcher as never,
  })

  // Backup creation
  const [newName, setNewName] = useState('')
  const [creating, setCreating] = useState(false)
  const [createErr, setCreateErr] = useState('')

  // Restore confirmation
  const [restoreTarget, setRestoreTarget] = useState<string | null>(null)
  const [restoring, setRestoring] = useState(false)
  const [restoreErr, setRestoreErr] = useState('')

  // Options form
  const [showOptions, setShowOptions] = useState(false)
  const initial = settings.data?.backups
  const initialS3 = initial?.s3 ?? {}

  const [optForm, setOptForm] = useState<BackupsSettings | null>(null)
  const optVals: BackupsSettings = optForm ?? {
    cron: initial?.cron ?? '',
    cronMaxKeep: initial?.cronMaxKeep ?? 5,
    s3: {
      enabled: initialS3.enabled ?? false,
      endpoint: initialS3.endpoint ?? '',
      bucket: initialS3.bucket ?? '',
      region: initialS3.region ?? '',
      accessKey: initialS3.accessKey ?? '',
      secret: initialS3.secret ?? '',
      forcePathStyle: initialS3.forcePathStyle ?? false,
    },
  }
  const s3Vals: S3Settings = optVals.s3 ?? {}

  const optDirty = optForm !== null

  function setOpt<K extends keyof BackupsSettings>(k: K, v: BackupsSettings[K]) {
    setOptForm({ ...optVals, [k]: v })
  }
  function setS3<K extends keyof S3Settings>(k: K, v: S3Settings[K]) {
    setOptForm({ ...optVals, s3: { ...s3Vals, [k]: v } })
  }

  const [savingOpts, setSavingOpts] = useState(false)
  const [saveErr, setSaveErr] = useState('')
  const [savedAt, setSavedAt] = useState(0)

  async function handleCreate() {
    setCreating(true)
    setCreateErr('')
    try {
      await createBackup(newName || `backup-${Date.now()}.zip`)
      setNewName('')
      await backups.mutate()
    } catch (err) {
      setCreateErr((err as Error)?.message ?? 'Create failed')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete(key: string) {
    if (!confirm(`Delete backup "${key}"?`)) return
    try {
      await deleteBackup(key)
      await backups.mutate()
    } catch (err) {
      alert((err as Error)?.message ?? 'Delete failed')
    }
  }

  async function handleRestore(key: string) {
    setRestoring(true)
    setRestoreErr('')
    try {
      await restoreBackup(key)
      setRestoreTarget(null)
    } catch (err) {
      setRestoreErr((err as Error)?.message ?? 'Restore failed')
    } finally {
      setRestoring(false)
    }
  }

  async function handleDownload(key: string) {
    try {
      const token = await getFileToken()
      window.open(getBackupDownloadURL(key, token), '_blank')
    } catch (err) {
      alert((err as Error)?.message ?? 'Download failed')
    }
  }

  async function saveOptions() {
    setSavingOpts(true)
    setSaveErr('')
    try {
      // Don't resend secret if unchanged.
      const s3Payload: S3Settings = { ...s3Vals }
      if (s3Payload.secret === initialS3.secret) delete s3Payload.secret
      await updateSettings({
        backups: {
          cron: optVals.cron,
          cronMaxKeep: optVals.cronMaxKeep,
          s3: s3Payload,
        },
      })
      await settings.mutate()
      setOptForm(null)
      setSavedAt(Date.now())
    } catch (err) {
      setSaveErr((err as Error)?.message ?? 'Save failed')
    } finally {
      setSavingOpts(false)
    }
  }

  if (settings.isLoading) return <LoadingState />
  if (settings.error) return <ErrorState error={settings.error as Error} />

  const sortedBackups = [...(backups.data ?? [])].sort((a, b) =>
    a.key < b.key ? 1 : -1,
  )

  return (
    <YStack gap="$4">
      <SectionCard
        title="Backups"
        description="Create, restore, download, or delete database backups."
      >
        <XStack gap="$2" items="center">
          <Input
            flex={1}
            size="$3"
            value={newName}
            onChangeText={setNewName}
            placeholder="backup-name.zip"
          />
          <Button
            size="$3"
            disabled={creating}
            onPress={handleCreate}
            bg={'#f2f2f2' as never}
            hoverStyle={{ background: '#ffffff' as never }}
          >
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {creating ? 'Creating…' : 'New backup'}
            </Text>
          </Button>
          <Button size="$3" onPress={() => backups.mutate()}>
            <Text fontSize="$2">Refresh</Text>
          </Button>
        </XStack>
        {createErr ? (
          <Text fontSize="$1" color="$red10">
            {createErr}
          </Text>
        ) : null}

        {backups.isLoading ? (
          <LoadingState />
        ) : backups.error ? (
          <ErrorState error={backups.error as Error} />
        ) : sortedBackups.length === 0 ? (
          <Empty title="No backups yet" hint="Create one above." />
        ) : (
          <DataTable
            columns={tableCols}
            rows={sortedBackups}
            rowKey={(b) => b.key}
            emptyState={{ title: 'No backups yet' }}
            renderRow={(b) => [
              <Text
                key="n"
                fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                fontSize="$1"
                color="$color"
                numberOfLines={1}
              >
                {b.key}
              </Text>,
              <Text key="s" fontSize="$2" color="$placeholderColor">
                {formatBytes(b.size)}
              </Text>,
              <XStack key="a" gap="$2" justify="flex-end" items="center">
                <Button size="$2" chromeless onPress={() => handleDownload(b.key)}>
                  <Text fontSize="$1" color={'$blue10' as never}>
                    Download
                  </Text>
                </Button>
                {restoreTarget === b.key ? (
                  <>
                    <Text fontSize="$1" color={'$yellow10' as never}>
                      Confirm?
                    </Text>
                    <Button
                      size="$2"
                      chromeless
                      disabled={restoring}
                      onPress={() => handleRestore(b.key)}
                    >
                      <Text fontSize="$1" color={'$yellow10' as never}>
                        Yes
                      </Text>
                    </Button>
                    <Button size="$2" chromeless onPress={() => setRestoreTarget(null)}>
                      <Text fontSize="$1" color="$placeholderColor">
                        No
                      </Text>
                    </Button>
                  </>
                ) : (
                  <Button size="$2" chromeless onPress={() => setRestoreTarget(b.key)}>
                    <Text fontSize="$1" color={'$yellow10' as never}>
                      Restore
                    </Text>
                  </Button>
                )}
                <Button size="$2" theme="red" onPress={() => handleDelete(b.key)}>
                  <Text fontSize="$1">Delete</Text>
                </Button>
              </XStack>,
            ]}
          />
        )}
        {restoreErr ? (
          <Text fontSize="$1" color="$red10">
            {restoreErr}
          </Text>
        ) : null}
      </SectionCard>

      <SectionCard
        title="Backup options"
        description="Configure auto backups and S3 storage."
      >
        <XStack>
          <Button size="$3" onPress={() => setShowOptions(!showOptions)}>
            <Text fontSize="$2">{showOptions ? 'Hide options' : 'Show options'}</Text>
          </Button>
        </XStack>

        {showOptions ? (
          <YStack gap="$3" pt="$2">
            <XStack gap="$3" flexWrap="wrap">
              <YStack gap="$1.5" flex={1} minW={260}>
                <Text fontSize="$2" color="$placeholderColor">
                  Cron expression (UTC)
                </Text>
                <Input
                  value={String(optVals.cron ?? '')}
                  onChangeText={(v: string) => setOpt('cron', v)}
                  placeholder="0 0 * * *"
                  fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
                />
                <Text fontSize="$1" color="$placeholderColor">
                  Leave empty to disable auto backups
                </Text>
              </YStack>
              <YStack gap="$1.5" width={200}>
                <Text fontSize="$2" color="$placeholderColor">
                  Max auto backups
                </Text>
                <Input
                  value={String(optVals.cronMaxKeep ?? 5)}
                  onChangeText={(v: string) => setOpt('cronMaxKeep', Math.max(1, Number(v) || 1))}
                  keyboardType="number-pad"
                />
              </YStack>
            </XStack>

            <XStack items="center" gap="$2">
              <Button
                size="$2"
                onPress={() => setS3('enabled', !s3Vals.enabled)}
                bg={s3Vals.enabled ? ('#f2f2f2' as never) : 'transparent'}
                borderWidth={1}
                borderColor={s3Vals.enabled ? ('#f2f2f2' as never) : '$borderColor'}
              >
                <Text fontSize="$2" color={s3Vals.enabled ? ('#070b13' as never) : '$color'}>
                  {s3Vals.enabled ? 'S3 backup enabled' : 'S3 backup disabled'}
                </Text>
              </Button>
            </XStack>

            {s3Vals.enabled ? (
              <Card bg="$background" borderColor="$borderColor" borderWidth={1} p="$4" gap="$3">
                <YStack gap="$1.5">
                  <Text fontSize="$2" color="$placeholderColor">
                    Endpoint
                  </Text>
                  <Input
                    value={String(s3Vals.endpoint ?? '')}
                    onChangeText={(v: string) => setS3('endpoint', v)}
                    autoCapitalize="none"
                  />
                </YStack>
                <XStack gap="$3" flexWrap="wrap">
                  <YStack gap="$1.5" flex={1} minW={220}>
                    <Text fontSize="$2" color="$placeholderColor">
                      Bucket
                    </Text>
                    <Input
                      value={String(s3Vals.bucket ?? '')}
                      onChangeText={(v: string) => setS3('bucket', v)}
                      autoCapitalize="none"
                    />
                  </YStack>
                  <YStack gap="$1.5" flex={1} minW={220}>
                    <Text fontSize="$2" color="$placeholderColor">
                      Region
                    </Text>
                    <Input
                      value={String(s3Vals.region ?? '')}
                      onChangeText={(v: string) => setS3('region', v)}
                      autoCapitalize="none"
                    />
                  </YStack>
                </XStack>
                <XStack gap="$3" flexWrap="wrap">
                  <YStack gap="$1.5" flex={1} minW={220}>
                    <Text fontSize="$2" color="$placeholderColor">
                      Access key
                    </Text>
                    <Input
                      value={String(s3Vals.accessKey ?? '')}
                      onChangeText={(v: string) => setS3('accessKey', v)}
                      autoCapitalize="none"
                    />
                  </YStack>
                  <YStack gap="$1.5" flex={1} minW={220}>
                    <Text fontSize="$2" color="$placeholderColor">
                      Secret
                    </Text>
                    <Input
                      value={String(s3Vals.secret ?? '')}
                      onChangeText={(v: string) => setS3('secret', v)}
                      secureTextEntry
                      autoComplete="off"
                    />
                  </YStack>
                </XStack>
                <XStack items="center" gap="$2">
                  <Button
                    size="$2"
                    onPress={() => setS3('forcePathStyle', !s3Vals.forcePathStyle)}
                    bg={s3Vals.forcePathStyle ? ('#f2f2f2' as never) : 'transparent'}
                    borderWidth={1}
                    borderColor={s3Vals.forcePathStyle ? ('#f2f2f2' as never) : '$borderColor'}
                  >
                    <Text fontSize="$1" color={s3Vals.forcePathStyle ? ('#070b13' as never) : '$color'}>
                      {s3Vals.forcePathStyle ? 'Force path-style on' : 'Force path-style off'}
                    </Text>
                  </Button>
                </XStack>
              </Card>
            ) : null}

            <XStack gap="$2" items="center" pt="$2">
              <Button
                size="$3"
                disabled={!optDirty || savingOpts}
                onPress={saveOptions}
                bg={'#f2f2f2' as never}
                hoverStyle={{ background: '#ffffff' as never }}
              >
                <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
                  {savingOpts ? 'Saving…' : 'Save options'}
                </Text>
              </Button>
              {savedAt > 0 && !optDirty ? (
                <Text fontSize="$1" color="$green10">
                  Saved.
                </Text>
              ) : null}
              {saveErr ? (
                <Text fontSize="$1" color="$red10">
                  {saveErr}
                </Text>
              ) : null}
            </XStack>
          </YStack>
        ) : null}
      </SectionCard>
    </YStack>
  )
}
