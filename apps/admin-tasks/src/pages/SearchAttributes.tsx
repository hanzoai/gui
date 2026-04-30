// SearchAttributes — list system + custom search attributes for the
// active namespace and add new custom attributes (admin-gated).
//
// Layout matches the namespace-detail panel: two stacked tables (built-in
// up top, then custom). Add form is a small inline row above the custom
// table. Backend currently 501s on POST — we surface that error in place
// so the form clears only on success.

import { useCallback, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Button,
  Card,
  H1,
  H4,
  Input,
  Select,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  Alert,
  Badge,
  Empty,
  ErrorState,
  LoadingState,
  useFetch,
} from '@hanzogui/admin'
import {
  ApiError,
  Search,
  type SearchAttributesResponse,
} from '../lib/api'
import { SEARCH_ATTRIBUTE_TYPE, type SearchAttributeType } from '../lib/types'
import { canAddSearchAttribute, useSettings } from '../stores/settings'

const TYPE_OPTIONS: SearchAttributeType[] = [
  SEARCH_ATTRIBUTE_TYPE.KEYWORD,
  SEARCH_ATTRIBUTE_TYPE.TEXT,
  SEARCH_ATTRIBUTE_TYPE.INT,
  SEARCH_ATTRIBUTE_TYPE.DOUBLE,
  SEARCH_ATTRIBUTE_TYPE.BOOL,
  SEARCH_ATTRIBUTE_TYPE.DATETIME,
  SEARCH_ATTRIBUTE_TYPE.KEYWORDLIST,
]

export function SearchAttributesPage() {
  const { ns } = useParams()
  const namespace = ns!
  const url = Search.attributesUrl(namespace)
  const { data, error, isLoading, mutate } = useFetch<SearchAttributesResponse>(url)
  const { settings } = useSettings()
  const advancedOn = canAddSearchAttribute(settings)

  if (error) return <ErrorState error={error as Error} />
  if (isLoading || !data) return <LoadingState />

  const system = data.systemAttributes ?? {}
  const custom = data.customAttributes ?? {}

  return (
    <YStack gap="$5">
      <Link
        to={`/namespaces/${encodeURIComponent(namespace)}`}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <XStack items="center" gap="$1.5" hoverStyle={{ opacity: 0.8 }}>
          <ChevronLeft size={14} color="#7e8794" />
          <Text fontSize="$2" color="$placeholderColor">
            namespace
          </Text>
        </XStack>
      </Link>

      <YStack gap="$1">
        <Text fontSize="$1" color="$placeholderColor" fontWeight="600" letterSpacing={0.4}>
          SEARCH ATTRIBUTES
        </Text>
        <H1 size="$7" color="$color" fontWeight="600">
          {namespace}
        </H1>
      </YStack>

      <Section title="Built-in" hint="System attributes — read-only.">
        <AttributeTable ns={namespace} schema={system} readOnly onChanged={() => mutate()} />
      </Section>

      <Section title="Custom" hint="Application-specific keys you can filter workflows by.">
        <AddAttributeForm
          ns={namespace}
          disabled={!advancedOn}
          onAdded={() => mutate()}
        />
        <AttributeTable ns={namespace} schema={custom} onChanged={() => mutate()} />
      </Section>
    </YStack>
  )
}

function Section({
  title,
  hint,
  children,
}: {
  title: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <YStack gap="$2">
      <YStack gap="$1">
        <H4 fontSize="$4" fontWeight="500" color="$color">
          {title}
        </H4>
        {hint ? (
          <Text fontSize="$1" color="$placeholderColor">
            {hint}
          </Text>
        ) : null}
      </YStack>
      {children}
    </YStack>
  )
}

function AttributeTable({
  ns,
  schema,
  readOnly = false,
  onChanged,
}: {
  ns: string
  schema: Record<string, string>
  readOnly?: boolean
  onChanged: () => void
}) {
  const entries = Object.entries(schema).sort(([a], [b]) => a.localeCompare(b))
  const [busyKey, setBusyKey] = useState<string | null>(null)
  const [rowErr, setRowErr] = useState<string | null>(null)

  const remove = useCallback(
    async (key: string) => {
      if (!confirm(`Delete custom attribute "${key}"? Existing workflow records keep the value but new queries cannot reference it.`)) return
      setBusyKey(key)
      setRowErr(null)
      try {
        await Search.deleteAttribute(ns, key)
        onChanged()
      } catch (e) {
        setRowErr(e instanceof ApiError ? e.message : (e as Error).message)
      } finally {
        setBusyKey(null)
      }
    },
    [ns, onChanged],
  )

  if (entries.length === 0) {
    return (
      <Empty
        title={readOnly ? 'No system attributes' : 'No custom attributes'}
        hint={
          readOnly
            ? 'The visibility store has not registered any system attributes for this namespace yet.'
            : 'Use the Add form above to create one.'
        }
      />
    )
  }
  return (
    <YStack gap="$2">
      <Card overflow="hidden" bg="$background" borderColor="$borderColor" borderWidth={1}>
        <XStack
          bg={'rgba(255,255,255,0.03)' as never}
          px="$4"
          py="$2"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <Text flex={2} fontSize="$2" color="$placeholderColor" fontWeight="500">
            Key
          </Text>
          <Text flex={1} fontSize="$2" color="$placeholderColor" fontWeight="500">
            Type
          </Text>
          {!readOnly ? <Text width={80} fontSize="$2" color="$placeholderColor" fontWeight="500" /> : null}
        </XStack>
        {entries.map(([k, t], i) => (
          <XStack
            key={k}
            px="$4"
            py="$2.5"
            borderTopWidth={i === 0 ? 0 : 1}
            borderTopColor="$borderColor"
            items="center"
          >
            <Text flex={2} fontSize="$2" color="$color">
              {k}
            </Text>
            <YStack flex={1}>
              <Badge variant="muted">{t}</Badge>
            </YStack>
            {!readOnly ? (
              <YStack width={80} items="flex-end">
                <Button
                  size="$2"
                  chromeless
                  onPress={() => void remove(k)}
                  disabled={busyKey === k}
                  aria-label={`Delete ${k}`}
                >
                  <Trash2 size={14} color={busyKey === k ? '#7e8794' : '#fca5a5'} />
                </Button>
              </YStack>
            ) : null}
          </XStack>
        ))}
      </Card>
      {rowErr ? (
        <Alert variant="destructive" title="Could not delete attribute">
          {rowErr}
        </Alert>
      ) : null}
    </YStack>
  )
}

function AddAttributeForm({
  ns,
  disabled = false,
  onAdded,
}: {
  ns: string
  disabled?: boolean
  onAdded: () => void
}) {
  const [name, setName] = useState('')
  const [type, setType] = useState<SearchAttributeType>(SEARCH_ATTRIBUTE_TYPE.KEYWORD)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const submit = useCallback(async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setErr('Name is required.')
      return
    }
    setBusy(true)
    setErr(null)
    try {
      await Search.addAttribute(ns, trimmed, type)
      setName('')
      setType(SEARCH_ATTRIBUTE_TYPE.KEYWORD)
      onAdded()
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : (e as Error).message)
    } finally {
      setBusy(false)
    }
  }, [name, type, ns, onAdded])

  return (
    <YStack gap="$2">
      <XStack gap="$2" items="center" flexWrap="wrap" opacity={disabled ? 0.5 : 1}>
        <Input
          size="$3"
          width={260}
          placeholder="MyAttribute"
          value={name}
          onChangeText={setName}
          disabled={disabled}
        />
        <Select
          value={type}
          onValueChange={(v: string) => setType(v as SearchAttributeType)}
        >
          <Select.Trigger width={180} disabled={disabled}>
            <Select.Value placeholder="Type" />
          </Select.Trigger>
          <Select.Content>
            <Select.Viewport>
              {TYPE_OPTIONS.map((opt, i) => (
                <Select.Item key={opt} value={opt} index={i}>
                  <Select.ItemText>{opt}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Viewport>
          </Select.Content>
        </Select>
        <Button
          size="$3"
          disabled={busy || disabled}
          onPress={submit}
          aria-label={disabled ? 'Advanced visibility disabled' : 'Add attribute'}
        >
          <XStack items="center" gap="$1.5">
            <Plus size={14} color="#cbd5e1" />
            <Text fontSize="$2">{busy ? 'Adding…' : 'Add'}</Text>
          </XStack>
        </Button>
      </XStack>
      {disabled ? (
        <Text fontSize="$1" color="$placeholderColor">
          Advanced visibility is disabled — custom attributes cannot be added.
        </Text>
      ) : null}
      {err ? <Alert variant="destructive" title="Could not add attribute">{err}</Alert> : null}
    </YStack>
  )
}
