// CollectionEdit — schema editor for one collection (name + type +
// fields CRUD). Recovered from the legacy ui-react/CollectionDetail.tsx.
//
// Scope of this port:
//   - schema (name) edit
//   - fields tab (add / rename / retype / hidden / presentable / remove)
//
// DEFERRED for follow-up (these were also in the legacy editor but are
// independent surfaces and significantly broader to port):
//   - indexes tab (list + free-text SQL CRUD)
//   - API rules tab (filter expression CRUD per CRUD verb)
// Both can read & write through the existing updateCollection() API,
// but they need their own UX pass to be safe (rule expressions are a
// trap for the unwary). Tracked on the recovery checklist.
//
// Route: /collections/:name/edit  (matches main.tsx).

import { useCallback, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Button, H1, Input, Text, XStack, YStack } from 'hanzogui'
import { ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import {
  authedFetcher,
  deleteCollection,
  updateCollection,
  type CollectionField,
  type CollectionModel,
} from '../lib/api'

const FIELD_TYPES = [
  'text', 'number', 'bool', 'email', 'url', 'editor',
  'date', 'select', 'json', 'file', 'relation', 'password',
  'autodate', 'geoPoint',
] as const

interface FieldEntry extends CollectionField {
  _toDelete?: boolean
}

interface FormValues {
  name: string
  type: string
  fields: FieldEntry[]
}

function toFormValues(c: CollectionModel): FormValues {
  return {
    name: c.name,
    type: c.type,
    fields: (c.fields ?? []).map((f) => ({ ...f })),
  }
}

export function CollectionEdit() {
  const navigate = useNavigate()
  const { name } = useParams<{ name: string }>()
  if (!name) return null

  const collectionUrl = `/api/collections/${encodeURIComponent(name)}`
  const collection = useFetch<CollectionModel>(collectionUrl, {
    fetcher: authedFetcher as never,
  })

  const [form, setForm] = useState<FormValues | null>(null)
  const [dirty, setDirty] = useState(false)

  const values = useMemo<FormValues | null>(() => {
    if (form) return form
    if (collection.data) return toFormValues(collection.data)
    return null
  }, [form, collection.data])

  function update(patch: Partial<FormValues>) {
    if (!values) return
    setForm({ ...values, ...patch })
    setDirty(true)
  }

  function updateField(idx: number, patch: Partial<FieldEntry>) {
    if (!values) return
    const fields = [...values.fields]
    fields[idx] = { ...fields[idx], ...patch }
    update({ fields })
  }

  const [saving, setSaving] = useState(false)
  const [saveErr, setSaveErr] = useState('')
  const [deleting, setDeleting] = useState(false)

  const handleSave = useCallback(async () => {
    if (!values || !collection.data) return
    setSaving(true)
    setSaveErr('')
    try {
      const payload = {
        ...values,
        fields: values.fields.filter((f) => !f._toDelete),
      }
      await updateCollection(collection.data.id, payload)
      await collection.mutate()
      setDirty(false)
      setForm(null)
    } catch (err) {
      setSaveErr((err as Error)?.message ?? 'Save failed')
    } finally {
      setSaving(false)
    }
  }, [collection, values])

  const handleDelete = useCallback(async () => {
    if (!collection.data) return
    if (!confirm(`Delete collection "${collection.data.name}"?`)) return
    setDeleting(true)
    try {
      await deleteCollection(collection.data.id)
      navigate('/collections')
    } catch (err) {
      alert((err as Error)?.message ?? 'Delete failed')
    } finally {
      setDeleting(false)
    }
  }, [collection.data, navigate])

  if (collection.isLoading) return <LoadingState />
  if (collection.error) return <ErrorState error={collection.error as Error} />
  if (!values || !collection.data) return null

  const isSystem = collection.data.system
  const isView = collection.data.type === 'view'

  return (
    <YStack gap="$4" flex={1} px="$6" py="$5">
      <XStack items="center" gap="$3" flexWrap="wrap">
        <H1 size="$8" fontWeight="600" color="$color">
          Edit collection
        </H1>
        <Input
          size="$3"
          value={values.name}
          onChangeText={(v: string) => update({ name: v })}
          disabled={isSystem}
          maxW={280}
        />
        <YStack
          px="$2"
          py="$1"
          bg={'rgba(255,255,255,0.06)' as never}
          rounded="$2"
        >
          <Text fontSize="$1" color="$placeholderColor">
            {collection.data.type}
          </Text>
        </YStack>
        <XStack ml="auto" gap="$2">
          <Button
            size="$3"
            onPress={() => collection.data && navigate(`/collections/${collection.data.id}/records`)}
          >
            <Text fontSize="$2">Records</Text>
          </Button>
          {!isSystem ? (
            <Button size="$3" theme="red" disabled={deleting} onPress={handleDelete}>
              <Text fontSize="$2">{deleting ? 'Deleting…' : 'Delete'}</Text>
            </Button>
          ) : null}
          <Button
            size="$3"
            disabled={!dirty || saving}
            onPress={handleSave}
            bg={'#f2f2f2' as never}
            hoverStyle={{ background: '#ffffff' as never }}
          >
            <Text fontSize="$2" fontWeight="500" color={'#070b13' as never}>
              {saving ? 'Saving…' : 'Save'}
            </Text>
          </Button>
        </XStack>
      </XStack>

      {saveErr ? (
        <Text fontSize="$2" color="$red10">
          {saveErr}
        </Text>
      ) : null}

      <YStack gap="$1">
        <Text
          fontSize="$1"
          color="$placeholderColor"
          letterSpacing={1}
          textTransform={'uppercase' as never}
        >
          {isView ? 'Query (read-only here)' : 'Fields'}
        </Text>
      </YStack>

      <YStack gap="$2">
        {values.fields.map((field, idx) => {
          if (field._toDelete) return null
          return (
            <XStack
              key={field.id || `new-${idx}`}
              items="center"
              gap="$2"
              p="$2"
              borderWidth={1}
              borderColor="$borderColor"
              rounded="$2"
              flexWrap="wrap"
            >
              <Input
                size="$2"
                width={180}
                value={field.name}
                onChangeText={(v: string) => updateField(idx, { name: v })}
                disabled={field.system}
                placeholder="Field name"
              />
              <XStack gap="$1" flexWrap="wrap">
                {FIELD_TYPES.map((t) => {
                  const active = field.type === t
                  return (
                    <Button
                      key={t}
                      size="$1"
                      onPress={() => !field.system && updateField(idx, { type: t })}
                      disabled={field.system}
                      bg={active ? ('#f2f2f2' as never) : 'transparent'}
                      borderWidth={1}
                      borderColor={active ? ('#f2f2f2' as never) : '$borderColor'}
                    >
                      <Text fontSize="$1" color={active ? ('#070b13' as never) : '$color'}>
                        {t}
                      </Text>
                    </Button>
                  )
                })}
              </XStack>
              <Button
                size="$1"
                disabled={field.system}
                onPress={() => updateField(idx, { hidden: !field.hidden })}
                bg={field.hidden ? ('#f2f2f2' as never) : 'transparent'}
                borderWidth={1}
                borderColor={field.hidden ? ('#f2f2f2' as never) : '$borderColor'}
              >
                <Text fontSize="$1" color={field.hidden ? ('#070b13' as never) : '$placeholderColor'}>
                  Hidden
                </Text>
              </Button>
              <Button
                size="$1"
                disabled={field.system}
                onPress={() => updateField(idx, { presentable: !field.presentable })}
                bg={field.presentable ? ('#f2f2f2' as never) : 'transparent'}
                borderWidth={1}
                borderColor={field.presentable ? ('#f2f2f2' as never) : '$borderColor'}
              >
                <Text fontSize="$1" color={field.presentable ? ('#070b13' as never) : '$placeholderColor'}>
                  Presentable
                </Text>
              </Button>
              {field.system ? (
                <Text fontSize="$1" color="$placeholderColor">
                  system
                </Text>
              ) : (
                <Button
                  size="$1"
                  ml="auto"
                  chromeless
                  onPress={() => {
                    if (field.id) {
                      // Existing field — mark for delete; backend will
                      // drop it on save.
                      updateField(idx, { _toDelete: true })
                    } else {
                      // Local-only — yank it from the array.
                      const fields = values.fields.filter((_, i) => i !== idx)
                      update({ fields })
                    }
                  }}
                >
                  <Text fontSize="$1" color={'$red10' as never}>
                    Remove
                  </Text>
                </Button>
              )}
            </XStack>
          )
        })}
        {!isView ? (
          <Button
            size="$3"
            onPress={() => {
              const placeholder = `field${values.fields.length + 1}`
              update({
                fields: [
                  ...values.fields,
                  {
                    id: '',
                    name: placeholder,
                    type: 'text',
                    system: false,
                    hidden: false,
                    presentable: false,
                  },
                ],
              })
            }}
          >
            <Text fontSize="$2">+ Add field</Text>
          </Button>
        ) : null}
      </YStack>

      <YStack
        gap="$1"
        p="$3"
        bg={'rgba(255,255,255,0.02)' as never}
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
          Deferred
        </Text>
        <Text fontSize="$2" color="$placeholderColor">
          Indexes and API rules editing is recovered separately. Edit them
          via the JSON import on Settings → Data for now.
        </Text>
      </YStack>
    </YStack>
  )
}
