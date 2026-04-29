// JsonSchemaForm — minimum-viable JSON Schema renderer. Supports the
// subset that workflow inputs realistically use: type, enum, required,
// items. Covers string / number / boolean / object / array.
//
// Primitives only (no $ref, no oneOf, no allOf). Arrays render as one
// row per item with add/remove. Objects recurse. The form value is
// always a plain JSON object; callers serialise it (e.g. base64) at
// submit time.

import { Button, Input, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'

export type JsonSchemaType = 'string' | 'number' | 'integer' | 'boolean' | 'object' | 'array'

export interface JsonSchema {
  type?: JsonSchemaType
  title?: string
  description?: string
  enum?: Array<string | number>
  required?: string[]
  properties?: Record<string, JsonSchema>
  items?: JsonSchema
  default?: unknown
}

export interface JsonSchemaFormProps {
  schema: JsonSchema
  value: unknown
  onChange: (next: unknown) => void
  path?: string
}

export function JsonSchemaForm({ schema, value, onChange, path = '' }: JsonSchemaFormProps) {
  const t = schema.type ?? inferType(value)
  if (schema.enum && schema.enum.length) {
    return (
      <EnumPicker
        title={schema.title ?? path}
        options={schema.enum}
        value={value as string | number}
        onChange={onChange}
      />
    )
  }
  if (t === 'object') return <ObjectField schema={schema} value={value} onChange={onChange} path={path} />
  if (t === 'array') return <ArrayField schema={schema} value={value} onChange={onChange} path={path} />
  if (t === 'boolean') return <BoolField title={schema.title ?? path} value={value} onChange={onChange} />
  if (t === 'number' || t === 'integer')
    return <NumberField title={schema.title ?? path} value={value} onChange={onChange} integer={t === 'integer'} />
  return <StringField title={schema.title ?? path} value={value} onChange={onChange} />
}

function inferType(v: unknown): JsonSchemaType {
  if (Array.isArray(v)) return 'array'
  if (v != null && typeof v === 'object') return 'object'
  if (typeof v === 'boolean') return 'boolean'
  if (typeof v === 'number') return 'number'
  return 'string'
}

function StringField({
  title,
  value,
  onChange,
}: {
  title: string
  value: unknown
  onChange: (v: string) => void
}) {
  return (
    <YStack gap="$1">
      {title ? (
        <Text fontSize="$1" color="$placeholderColor">
          {title}
        </Text>
      ) : null}
      <Input value={value == null ? '' : String(value)} onChangeText={onChange} />
    </YStack>
  )
}

function NumberField({
  title,
  value,
  onChange,
  integer,
}: {
  title: string
  value: unknown
  onChange: (v: number | undefined) => void
  integer?: boolean
}) {
  return (
    <YStack gap="$1">
      {title ? (
        <Text fontSize="$1" color="$placeholderColor">
          {title}
        </Text>
      ) : null}
      <Input
        value={value == null ? '' : String(value)}
        onChangeText={(v) => {
          if (v.trim() === '') return onChange(undefined)
          const n = integer ? parseInt(v, 10) : Number(v)
          if (Number.isFinite(n)) onChange(n)
        }}
        keyboardType="numeric"
      />
    </YStack>
  )
}

function BoolField({
  title,
  value,
  onChange,
}: {
  title: string
  value: unknown
  onChange: (v: boolean) => void
}) {
  const v = Boolean(value)
  return (
    <XStack gap="$2" items="center">
      <Button
        size="$2"
        onPress={() => onChange(!v)}
        bg={v ? ('#22c55e' as never) : 'transparent'}
        borderWidth={1}
        borderColor={v ? ('#22c55e' as never) : '$borderColor'}
      >
        <Text fontSize="$1" color={v ? ('#070b13' as never) : '$color'}>
          {v ? 'true' : 'false'}
        </Text>
      </Button>
      {title ? (
        <Text fontSize="$1" color="$placeholderColor">
          {title}
        </Text>
      ) : null}
    </XStack>
  )
}

function EnumPicker({
  title,
  options,
  value,
  onChange,
}: {
  title: string
  options: Array<string | number>
  value: string | number
  onChange: (v: string | number) => void
}) {
  return (
    <YStack gap="$1">
      {title ? (
        <Text fontSize="$1" color="$placeholderColor">
          {title}
        </Text>
      ) : null}
      <XStack gap="$1" flexWrap="wrap">
        {options.map((opt) => (
          <Button
            key={String(opt)}
            size="$2"
            onPress={() => onChange(opt)}
            bg={value === opt ? ('#f2f2f2' as never) : 'transparent'}
            borderWidth={1}
            borderColor={value === opt ? ('#f2f2f2' as never) : '$borderColor'}
          >
            <Text fontSize="$1" color={value === opt ? ('#070b13' as never) : '$color'}>
              {String(opt)}
            </Text>
          </Button>
        ))}
      </XStack>
    </YStack>
  )
}

function ObjectField({
  schema,
  value,
  onChange,
  path,
}: {
  schema: JsonSchema
  value: unknown
  onChange: (v: Record<string, unknown>) => void
  path: string
}) {
  const obj = (value && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<
    string,
    unknown
  >
  const props = schema.properties ?? {}
  const required = new Set(schema.required ?? [])
  const keys = Object.keys(props)

  if (keys.length === 0) {
    // Free-form object — render as JSON.
    return (
      <YStack gap="$1">
        {schema.title ? (
          <Text fontSize="$1" color="$placeholderColor">
            {schema.title}
          </Text>
        ) : null}
        <Input
          value={JSON.stringify(obj)}
          onChangeText={(v) => {
            try {
              const parsed = JSON.parse(v)
              if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) onChange(parsed)
            } catch {
              // ignore until valid
            }
          }}
          fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
        />
      </YStack>
    )
  }

  return (
    <YStack gap="$2">
      {schema.title ? (
        <Text fontSize="$2" fontWeight="500" color="$color">
          {schema.title}
        </Text>
      ) : null}
      {keys.map((k) => (
        <YStack key={k} gap="$1">
          <Text fontSize="$1" color="$placeholderColor">
            {k}
            {required.has(k) ? ' *' : ''}
          </Text>
          <JsonSchemaForm
            schema={props[k]}
            value={obj[k]}
            onChange={(nv) => onChange({ ...obj, [k]: nv })}
            path={path ? `${path}.${k}` : k}
          />
        </YStack>
      ))}
    </YStack>
  )
}

function ArrayField({
  schema,
  value,
  onChange,
  path,
}: {
  schema: JsonSchema
  value: unknown
  onChange: (v: unknown[]) => void
  path: string
}) {
  const arr = Array.isArray(value) ? value : []
  const itemSchema: JsonSchema = schema.items ?? { type: 'string' }
  return (
    <YStack gap="$2">
      {schema.title ? (
        <Text fontSize="$2" fontWeight="500" color="$color">
          {schema.title}
        </Text>
      ) : null}
      {arr.map((item, i) => (
        <XStack key={i} gap="$2" items="flex-start">
          <YStack flex={1}>
            <JsonSchemaForm
              schema={itemSchema}
              value={item}
              onChange={(nv) => {
                const next = arr.slice()
                next[i] = nv
                onChange(next)
              }}
              path={`${path}[${i}]`}
            />
          </YStack>
          <Button
            size="$2"
            chromeless
            onPress={() => onChange(arr.filter((_, idx) => idx !== i))}
          >
            <Trash2 size={12} color="#ef4444" />
          </Button>
        </XStack>
      ))}
      <XStack>
        <Button
          size="$2"
          chromeless
          borderWidth={1}
          borderColor="$borderColor"
          onPress={() => onChange([...arr, defaultValueFor(itemSchema)])}
        >
          <XStack items="center" gap="$1.5">
            <Plus size={12} color="#7e8794" />
            <Text fontSize="$1">Add item</Text>
          </XStack>
        </Button>
      </XStack>
    </YStack>
  )
}

export function defaultValueFor(schema: JsonSchema): unknown {
  if (schema.default !== undefined) return schema.default
  switch (schema.type) {
    case 'string':
      return ''
    case 'number':
    case 'integer':
      return 0
    case 'boolean':
      return false
    case 'array':
      return []
    case 'object':
      return {}
    default:
      return ''
  }
}

// Browser-safe base64 encoder for JSON payloads.
export function encodeJsonBase64(value: unknown): string {
  const json = JSON.stringify(value ?? {})
  if (typeof btoa === 'function') {
    return btoa(unescape(encodeURIComponent(json)))
  }
  // Node-only fallback (tests).
  return Buffer.from(json, 'utf-8').toString('base64')
}
