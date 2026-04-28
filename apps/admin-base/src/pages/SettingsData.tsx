// SettingsData — export collection schemas as JSON, import to create
// or update collections in bulk. Replaces the legacy ui-react Tailwind
// implementation with Hanzo GUI v7 + @hanzogui/admin useFetch.

import { useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Button, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import {
  authedFetcher,
  importCollections,
  type CollectionModel,
  type ListResult,
} from '../lib/api'
import { SectionCard } from '../components/SectionCard'

export function SettingsData() {
  const fileRef = useRef<HTMLInputElement | null>(null)

  const collections = useFetch<ListResult<CollectionModel>>(
    `/api/collections?perPage=200&sort=name`,
    { fetcher: authedFetcher as never },
  )

  const all = useMemo(() => collections.data?.items ?? [], [collections.data])

  const [selected, setSelected] = useState<Set<string>>(new Set())
  const allSelected = selected.size === all.length && all.length > 0

  function toggleAll() {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(all.map((c) => c.id)))
  }

  function toggleOne(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function buildExport(): CollectionModel[] {
    return all
      .filter((c) => selected.has(c.id))
      .map((c) => {
        const { created: _c, updated: _u, ...rest } = c as Record<string, unknown>
        // Keep the structural type — exporting strips computed timestamps.
        return rest as unknown as CollectionModel
      })
  }

  function exportJson() {
    const data = buildExport()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'collections-schema.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function copyExport() {
    void navigator.clipboard.writeText(JSON.stringify(buildExport(), null, 2))
  }

  // Import state
  const [importJson, setImportJson] = useState('')
  const [importParsed, setImportParsed] = useState<CollectionModel[]>([])
  const [importError, setImportError] = useState('')
  const [importing, setImporting] = useState(false)
  const [importedAt, setImportedAt] = useState(0)
  const [importErr, setImportErr] = useState('')

  function parseImport(text: string) {
    setImportError('')
    if (!text.trim()) {
      setImportParsed([])
      return
    }
    try {
      const parsed = JSON.parse(text)
      if (!Array.isArray(parsed)) {
        setImportError('Expected a JSON array.')
        setImportParsed([])
        return
      }
      setImportParsed(parsed as CollectionModel[])
    } catch {
      setImportError('Invalid JSON.')
      setImportParsed([])
    }
  }

  function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = (ev.target?.result as string) ?? ''
      setImportJson(text)
      parseImport(text)
    }
    reader.readAsText(file)
  }

  const existingById = useMemo(
    () => new Map(all.map((c) => [c.id, c] as const)),
    [all],
  )
  const toAdd = importParsed.filter((c) => !existingById.has(c.id))
  const toUpdate = importParsed.filter((c) => existingById.has(c.id))

  async function applyImport() {
    setImporting(true)
    setImportErr('')
    try {
      await importCollections(importParsed)
      await collections.mutate()
      setImportJson('')
      setImportParsed([])
      setImportedAt(Date.now())
    } catch (err) {
      setImportErr((err as Error)?.message ?? 'Import failed')
    } finally {
      setImporting(false)
    }
  }

  if (collections.isLoading) return <LoadingState />
  if (collections.error) return <ErrorState error={collections.error as Error} />

  return (
    <YStack gap="$4">
      <SectionCard
        title="Export collections"
        description="Download your collection schemas as JSON."
      >
        <XStack items="center" gap="$2">
          <Button
            size="$2"
            onPress={toggleAll}
            bg={allSelected ? ('#f2f2f2' as never) : 'transparent'}
            borderWidth={1}
            borderColor={allSelected ? ('#f2f2f2' as never) : '$borderColor'}
          >
            <Text fontSize="$1" color={allSelected ? ('#070b13' as never) : '$color'}>
              Select all ({all.length})
            </Text>
          </Button>
        </XStack>

        <XStack gap="$1.5" flexWrap="wrap">
          {all.map((c) => {
            const active = selected.has(c.id)
            return (
              <Button
                key={c.id}
                size="$2"
                onPress={() => toggleOne(c.id)}
                bg={active ? ('rgba(99,102,241,0.15)' as never) : 'transparent'}
                borderWidth={1}
                borderColor={active ? ('rgba(99,102,241,0.6)' as never) : '$borderColor'}
              >
                <Text fontSize="$1" color={active ? ('$blue10' as never) : '$placeholderColor'}>
                  {c.name}
                </Text>
              </Button>
            )
          })}
        </XStack>

        <XStack gap="$2" pt="$2">
          <Button
            size="$3"
            disabled={selected.size === 0}
            onPress={exportJson}
            bg={'#f2f2f2' as never}
            hoverStyle={{ background: '#ffffff' as never }}
          >
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              Download JSON
            </Text>
          </Button>
          <Button size="$3" disabled={selected.size === 0} onPress={copyExport}>
            <Text fontSize="$2">Copy to clipboard</Text>
          </Button>
        </XStack>
      </SectionCard>

      <SectionCard
        title="Import collections"
        description="Upload a JSON schema to create or update collections."
      >
        <XStack gap="$2" items="center">
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            onChange={handleFile}
            style={{ display: 'none' }}
          />
          <Button size="$3" onPress={() => fileRef.current?.click()}>
            <Text fontSize="$2">Load from file</Text>
          </Button>
          <Text fontSize="$1" color="$placeholderColor">
            or paste JSON below
          </Text>
        </XStack>

        <YStack gap="$1.5">
          <Text fontSize="$2" color="$placeholderColor">
            Schema JSON
          </Text>
          <TextArea
            value={importJson}
            onChangeText={(v: string) => {
              setImportJson(v)
              parseImport(v)
            }}
            rows={10}
            spellCheck={false}
            placeholder='[{ "id": "...", "name": "...", ... }]'
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$1"
          />
        </YStack>

        {importError ? (
          <Text fontSize="$1" color="$red10">
            {importError}
          </Text>
        ) : null}

        {importParsed.length > 0 ? (
          <YStack gap="$1.5" pt="$2">
            <Text
              fontSize="$1"
              color="$placeholderColor"
              letterSpacing={1}
              textTransform={'uppercase' as never}
            >
              Detected changes
            </Text>
            {toAdd.map((c) => (
              <XStack key={'add:' + c.id} items="center" gap="$2">
                <YStack
                  px="$2"
                  py="$1"
                  bg={'rgba(34,197,94,0.18)' as never}
                  rounded="$1"
                >
                  <Text fontSize="$1" color={'$green10' as never}>
                    Add
                  </Text>
                </YStack>
                <Text fontSize="$2" color="$color">
                  {c.name}
                </Text>
              </XStack>
            ))}
            {toUpdate.map((c) => (
              <XStack key={'upd:' + c.id} items="center" gap="$2">
                <YStack
                  px="$2"
                  py="$1"
                  bg={'rgba(234,179,8,0.18)' as never}
                  rounded="$1"
                >
                  <Text fontSize="$1" color={'$yellow10' as never}>
                    Update
                  </Text>
                </YStack>
                <Text fontSize="$2" color="$color">
                  {c.name}
                </Text>
              </XStack>
            ))}
          </YStack>
        ) : null}

        <XStack gap="$2" items="center" pt="$2">
          <Button
            size="$3"
            disabled={importParsed.length === 0 || importing}
            onPress={applyImport}
            bg={'#eab308' as never}
            hoverStyle={{ background: '#facc15' as never }}
          >
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {importing ? 'Importing…' : 'Apply import'}
            </Text>
          </Button>
          {importJson ? (
            <Button
              size="$3"
              chromeless
              onPress={() => {
                setImportJson('')
                setImportParsed([])
                setImportError('')
              }}
            >
              <Text fontSize="$1" color="$placeholderColor">
                Clear
              </Text>
            </Button>
          ) : null}
          {importedAt > 0 ? (
            <Text fontSize="$1" color="$green10">
              Imported.
            </Text>
          ) : null}
          {importErr ? (
            <Text fontSize="$1" color="$red10">
              {importErr}
            </Text>
          ) : null}
        </XStack>
      </SectionCard>
    </YStack>
  )
}
