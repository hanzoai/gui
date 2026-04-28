// RecordEdit — full record editor for a single collection row.
// Replaces the legacy ui-react/Wouter version with react-router + Hanzo
// GUI v7 + @hanzogui/admin useFetch. Supports auth fields (email +
// optional password update + verified/visibility) on auth collections,
// and per-field-type rendering for text/number/bool/email/url/editor/
// select/date/json/file/relation/password/geoPoint.
//
// Route: /records/:collection/:id  where :id="_new" creates a new row.

import { useCallback, useMemo, useRef, useState, type ChangeEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Button, H1, Input, Text, TextArea, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import {
  authedFetcher,
  createRecord,
  deleteRecord,
  updateRecord,
  type CollectionField,
  type CollectionModel,
  type RecordModel,
} from '../lib/api'

type FormValues = Record<string, unknown>

const AUTH_SKIP = new Set(['email', 'emailVisibility', 'verified', 'tokenKey', 'password'])

function defaultForType(type: string): unknown {
  switch (type) {
    case 'number':
      return 0
    case 'bool':
      return false
    default:
      return ''
  }
}

export function RecordEdit() {
  const navigate = useNavigate()
  const { collection: collectionParam, id: recordId } = useParams<{
    collection: string
    id: string
  }>()
  if (!collectionParam || !recordId) return null
  const isNew = recordId === '_new'

  const collectionUrl = `/api/collections/${encodeURIComponent(collectionParam)}`
  const collection = useFetch<CollectionModel>(collectionUrl, {
    fetcher: authedFetcher as never,
  })

  const collectionName = collection.data?.name ?? collectionParam
  const recordUrl =
    !isNew && collection.data
      ? `/api/collections/${encodeURIComponent(collectionName)}/records/${encodeURIComponent(
          recordId,
        )}`
      : null
  const record = useFetch<RecordModel>(recordUrl, { fetcher: authedFetcher as never })

  const editableFields: CollectionField[] = useMemo(() => {
    if (!collection.data) return []
    return collection.data.fields.filter(
      (f) => f.type !== 'autodate' && f.name !== 'id',
    )
  }, [collection.data])

  const [formValues, setFormValues] = useState<FormValues | null>(null)
  const fileUploads = useRef<Record<string, File[]>>({})

  const defaults: FormValues = useMemo(() => {
    const vals: FormValues = {}
    for (const f of editableFields) {
      vals[f.name] = record.data?.[f.name] ?? defaultForType(f.type)
    }
    return vals
  }, [editableFields, record.data])

  const values = formValues ?? defaults

  function setValue(name: string, value: unknown) {
    setFormValues({ ...values, [name]: value })
  }

  const isAuth = collection.data?.type === 'auth'
  const isSuperusers = collection.data?.name === '_superusers'

  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')
  const [deleting, setDeleting] = useState(false)

  function buildFormData(): FormData {
    const fd = new FormData()
    for (const field of editableFields) {
      if (field.type === 'autodate') continue
      if (isAuth && field.type === 'password') continue
      if (field.type === 'file') continue

      const val = values[field.name]
      if (field.type === 'json' && typeof val === 'string' && val.trim()) {
        // Validate JSON before submit — surface invalid JSON early.
        JSON.parse(val)
        fd.append(field.name, val)
      } else if (val !== undefined && val !== null) {
        fd.append(field.name, String(val))
      }
    }
    if (isAuth) {
      const pw = values['password']
      if (typeof pw === 'string' && pw) {
        fd.append('password', pw)
        fd.append('passwordConfirm', String(values['passwordConfirm'] ?? pw))
      }
    }
    for (const [fieldName, files] of Object.entries(fileUploads.current)) {
      for (const file of files) fd.append(fieldName, file)
    }
    return fd
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    setSaveErr('')
    try {
      const fd = buildFormData()
      if (isNew) await createRecord(collectionName, fd)
      else await updateRecord(collectionName, recordId, fd)
      navigate(`/collections/${collectionParam}/records`)
    } catch (err) {
      setSaveErr((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
    // Reading values inside a callback closure — eslint-react would
    // pick this up; fine here since each click reads the latest.
  }, [
    buildFormData,
    collectionName,
    collectionParam,
    isNew,
    navigate,
    recordId,
  ])

  const handleDelete = useCallback(async () => {
    if (!confirm('Delete this record?')) return
    setDeleting(true)
    try {
      await deleteRecord(collectionName, recordId)
      navigate(`/collections/${collectionParam}/records`)
    } catch (err) {
      alert((err as Error)?.message ?? 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }, [collectionName, collectionParam, navigate, recordId])

  if (collection.isLoading) return <LoadingState />
  if (collection.error) return <ErrorState error={collection.error as Error} />
  if (!isNew && record.isLoading) return <LoadingState />
  if (!isNew && record.error) return <ErrorState error={record.error as Error} />

  return (
    <YStack gap="$4" flex={1} px="$6" py="$5">
      <XStack items="center" gap="$3">
        <Link
          to={`/collections/${collectionParam}/records`}
          style={{ textDecoration: 'none' }}
        >
          <Text fontSize="$3" color="$placeholderColor">
            {collectionName}
          </Text>
        </Link>
        <Text fontSize="$3" color="$placeholderColor">
          /
        </Text>
        <H1 size="$8" fontWeight="600" color="$color">
          {isNew ? 'New record' : `Edit ${recordId}`}
        </H1>
        <XStack ml="auto" gap="$2">
          {!isNew ? (
            <Button size="$3" theme="red" disabled={deleting} onPress={handleDelete}>
              <Text fontSize="$2">{deleting ? 'Deleting…' : 'Delete'}</Text>
            </Button>
          ) : null}
          <Button
            size="$3"
            disabled={saving}
            onPress={handleSave}
            bg={'#f2f2f2' as never}
            hoverStyle={{ background: '#ffffff' as never }}
          >
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {saving ? 'Saving…' : isNew ? 'Create' : 'Save'}
            </Text>
          </Button>
        </XStack>
      </XStack>

      {saveErr ? (
        <Text fontSize="$2" color="$red10">
          {saveErr}
        </Text>
      ) : null}

      {!isNew && record.data ? (
        <YStack gap="$1.5">
          <Text fontSize="$1" color="$placeholderColor">
            id
          </Text>
          <YStack
            px="$3"
            py="$2"
            bg={'rgba(255,255,255,0.04)' as never}
            rounded="$2"
            self="flex-start"
          >
            <Text
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              fontSize="$2"
              color="$color"
            >
              {record.data.id}
            </Text>
          </YStack>
        </YStack>
      ) : null}

      {isAuth ? (
        <YStack
          gap="$3"
          p="$4"
          borderWidth={1}
          borderColor="$borderColor"
          rounded="$3"
        >
          <Text
            fontSize="$1"
            color="$placeholderColor"
            letterSpacing={1}
            textTransform={'uppercase' as never}
          >
            Auth fields
          </Text>
          <YStack gap="$1.5">
            <Text fontSize="$2" color="$placeholderColor">
              Email
            </Text>
            <Input
              value={String(values['email'] ?? '')}
              onChangeText={(v: string) => setValue('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </YStack>
          {!isSuperusers ? (
            <>
              <XStack items="center" gap="$2">
                <Button
                  size="$2"
                  onPress={() => setValue('emailVisibility', !values['emailVisibility'])}
                  bg={values['emailVisibility'] ? ('#f2f2f2' as never) : 'transparent'}
                  borderWidth={1}
                  borderColor={
                    values['emailVisibility'] ? ('#f2f2f2' as never) : '$borderColor'
                  }
                >
                  <Text
                    fontSize="$1"
                    color={values['emailVisibility'] ? ('#070b13' as never) : '$color'}
                  >
                    {values['emailVisibility'] ? 'Email visible' : 'Email hidden'}
                  </Text>
                </Button>
                <Button
                  size="$2"
                  onPress={() => setValue('verified', !values['verified'])}
                  bg={values['verified'] ? ('#f2f2f2' as never) : 'transparent'}
                  borderWidth={1}
                  borderColor={values['verified'] ? ('#f2f2f2' as never) : '$borderColor'}
                >
                  <Text
                    fontSize="$1"
                    color={values['verified'] ? ('#070b13' as never) : '$color'}
                  >
                    {values['verified'] ? 'Verified' : 'Unverified'}
                  </Text>
                </Button>
              </XStack>
            </>
          ) : null}
          <YStack gap="$1.5">
            <Text fontSize="$2" color="$placeholderColor">
              {isNew ? 'Password' : 'New password (leave blank to keep)'}
            </Text>
            <Input
              value={String(values['password'] ?? '')}
              onChangeText={(v: string) => setValue('password', v)}
              secureTextEntry
              autoComplete="new-password"
            />
          </YStack>
        </YStack>
      ) : null}

      {editableFields
        .filter((f) => !(isAuth && AUTH_SKIP.has(f.name)))
        .map((f) => (
          <SchemaField
            key={f.name}
            field={f}
            value={values[f.name]}
            onChange={(v) => setValue(f.name, v)}
            onFileChange={(files) => {
              fileUploads.current[f.name] = files ? Array.from(files) : []
            }}
          />
        ))}

      {!isNew && record.data && collection.data
        ? collection.data.fields
            .filter((f) => f.type === 'autodate')
            .map((f) => (
              <YStack key={f.name} gap="$1">
                <Text fontSize="$1" color="$placeholderColor">
                  {f.name}
                </Text>
                <Text fontSize="$2" color="$placeholderColor">
                  {String(record.data?.[f.name] ?? '—')}
                </Text>
              </YStack>
            ))
        : null}
    </YStack>
  )
}

interface SchemaFieldProps {
  field: CollectionField
  value: unknown
  onChange: (v: unknown) => void
  onFileChange: (files: FileList | null) => void
}

function SchemaField({ field, value, onChange, onFileChange }: SchemaFieldProps) {
  const label = (
    <XStack items="center" gap="$1.5">
      <Text fontSize="$2" color="$placeholderColor">
        {field.name}
      </Text>
      <Text fontSize="$1" color="$placeholderColor">
        ({field.type})
      </Text>
      {field.system ? (
        <Text fontSize="$1" color="$placeholderColor">
          system
        </Text>
      ) : null}
    </XStack>
  )

  switch (field.type) {
    case 'text':
    case 'email':
    case 'url':
      return (
        <YStack gap="$1.5">
          {label}
          <Input
            value={String(value ?? '')}
            onChangeText={(v: string) => onChange(v)}
            keyboardType={field.type === 'email' ? 'email-address' : 'default'}
            autoCapitalize={field.type === 'email' || field.type === 'url' ? 'none' : 'sentences'}
          />
        </YStack>
      )
    case 'editor':
      return (
        <YStack gap="$1.5">
          {label}
          <TextArea
            value={String(value ?? '')}
            onChangeText={(v: string) => onChange(v)}
            rows={6}
          />
        </YStack>
      )
    case 'number':
      return (
        <YStack gap="$1.5">
          {label}
          <Input
            value={String(value ?? 0)}
            onChangeText={(v: string) => onChange(Number(v))}
            keyboardType="decimal-pad"
          />
        </YStack>
      )
    case 'bool':
      return (
        <XStack items="center" gap="$2">
          <Button
            size="$2"
            onPress={() => onChange(!value)}
            bg={value ? ('#f2f2f2' as never) : 'transparent'}
            borderWidth={1}
            borderColor={value ? ('#f2f2f2' as never) : '$borderColor'}
          >
            <Text fontSize="$1" color={value ? ('#070b13' as never) : '$color'}>
              {value ? 'true' : 'false'}
            </Text>
          </Button>
          {label}
        </XStack>
      )
    case 'select':
      return (
        <YStack gap="$1.5">
          {label}
          <Input
            value={String(value ?? '')}
            onChangeText={(v: string) => onChange(v)}
            placeholder="value (or comma-separated)"
          />
        </YStack>
      )
    case 'date':
      return (
        <YStack gap="$1.5">
          {label}
          {/* Hanzo GUI Input doesn't support type="datetime-local" — fall
              back to a raw input for the chrome's native picker. */}
          <input
            value={String(value ?? '')}
            onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
            type="datetime-local"
            style={{
              padding: '8px 10px',
              fontSize: 13,
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'transparent',
              color: 'inherit',
              borderRadius: 6,
            }}
          />
        </YStack>
      )
    case 'json':
      return (
        <YStack gap="$1.5">
          {label}
          <TextArea
            value={String(value ?? '')}
            onChangeText={(v: string) => onChange(v)}
            rows={4}
            placeholder="{}"
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
            fontSize="$1"
          />
        </YStack>
      )
    case 'file':
      return (
        <YStack gap="$1.5">
          {label}
          <input
            type="file"
            multiple={Boolean((field as Record<string, unknown>).maxSelect !== 1)}
            onChange={(e) => onFileChange(e.target.files)}
            style={{ fontSize: 13 }}
          />
        </YStack>
      )
    case 'relation':
      return (
        <YStack gap="$1.5">
          {label}
          <Input
            value={String(value ?? '')}
            onChangeText={(v: string) => onChange(v)}
            placeholder="Record ID (or comma-separated)"
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          />
        </YStack>
      )
    case 'password':
      return (
        <YStack gap="$1.5">
          {label}
          <Input
            value={String(value ?? '')}
            onChangeText={(v: string) => onChange(v)}
            secureTextEntry
            autoComplete="new-password"
          />
        </YStack>
      )
    case 'geoPoint':
      return (
        <YStack gap="$1.5">
          {label}
          <Input
            value={String(value ?? '')}
            onChangeText={(v: string) => onChange(v)}
            placeholder='{"lon": 0, "lat": 0}'
            fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
          />
        </YStack>
      )
    default:
      return (
        <YStack gap="$1.5">
          {label}
          <Input value={String(value ?? '')} onChangeText={(v: string) => onChange(v)} />
        </YStack>
      )
  }
}
