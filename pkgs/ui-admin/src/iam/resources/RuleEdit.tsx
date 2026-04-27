// Rule editor — single Rule. The expressions table differs per type
// (WAF / IP / User-Agent / IP Rate Limiting / Compound). Upstream
// renders one of five table components; the underlying primitives are
// not yet ported into @hanzogui/admin, so this editor focuses on the
// scalar fields and surfaces the expression count with a placeholder.

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  Button,
  Input,
  Select,
  Switch,
  Text,
  XStack,
  YStack,
} from 'hanzogui'
import { useFetch } from '../../data/useFetch'
import { RuleUrls, type ItemResponse, type RuleItem } from './api'
import {
  isAdminAccount,
  type AdminAccount,
  type RuleAction,
  type RuleType,
} from './types'

const TYPES: { id: RuleType; label: string }[] = [
  { id: 'WAF', label: 'WAF' },
  { id: 'IP', label: 'IP' },
  { id: 'User-Agent', label: 'User-Agent' },
  { id: 'IP Rate Limiting', label: 'IP Rate Limiting' },
  { id: 'Compound', label: 'Compound' },
]

const ACTIONS: { id: RuleAction; label: string }[] = [
  { id: 'Allow', label: 'Allow' },
  { id: 'Block', label: 'Block' },
]

export interface RuleEditProps {
  account: AdminAccount
}

export function RuleEdit({ account }: RuleEditProps) {
  const nav = useNavigate()
  const params = useParams<{ owner: string; ruleName: string }>()
  const owner = params.owner ?? ''
  const ruleName = params.ruleName ?? ''

  const url = useMemo(() => RuleUrls.one(owner, ruleName), [owner, ruleName])
  const { data, isLoading, error } = useFetch<ItemResponse<RuleItem>>(url)

  const [rule, setRule] = useState<RuleItem | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (data?.data) setRule(data.data)
  }, [data])

  const update = useCallback(
    <K extends keyof RuleItem>(key: K, value: RuleItem[K]) => {
      setRule((prev) => {
        if (!prev) return prev
        const next = { ...prev, [key]: value }
        // Switching the type clears expressions: each type uses a
        // different operator schema and reusing them produces nonsense.
        if (key === 'type') next.expressions = []
        return next
      })
    },
    [],
  )

  const submitEdit = useCallback(async () => {
    if (!rule) return
    setSaving(true)
    setSaveError(null)
    try {
      const res = await fetch(RuleUrls.update(owner, ruleName), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      })
      if (!res.ok) throw new Error(`save failed: ${res.status}`)
      nav(`/rules/${rule.owner}/${rule.name}`)
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : 'save failed')
    } finally {
      setSaving(false)
    }
  }, [nav, owner, rule, ruleName])

  if (isLoading || !rule) {
    return (
      <YStack p="$4">
        <Text color="$placeholderColor">
          {error ? `Could not load: ${error.message}` : 'Loading rule...'}
        </Text>
      </YStack>
    )
  }

  return (
    <YStack gap="$4">
      <XStack
        items="center"
        justify="space-between"
        p="$4"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Text fontSize="$6" fontWeight="600" color="$color">
          Edit Rule
        </Text>
        <Button disabled={saving} onPress={submitEdit}>
          Save
        </Button>
      </XStack>

      {saveError ? (
        <Text fontSize="$2" color="#fca5a5" px="$4">
          {saveError}
        </Text>
      ) : null}

      <YStack p="$4" gap="$4">
        <Field label="Organization">
          <Input
            value={rule.owner}
            disabled={!isAdminAccount(account)}
            onChangeText={(v) => update('owner', v)}
          />
        </Field>
        <Field label="Name">
          <Input
            value={rule.name}
            onChangeText={(v) => update('name', v)}
          />
        </Field>
        <Field label="Type">
          <Select
            value={rule.type}
            onValueChange={(v) => update('type', v as RuleType)}
          >
            <Select.Trigger>
              <Select.Value placeholder="Select type" />
            </Select.Trigger>
            <Select.Content>
              {TYPES.map((t, i) => (
                <Select.Item key={t.id} value={t.id} index={i}>
                  <Select.ItemText>{t.label}</Select.ItemText>
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        </Field>
        <Field label="Expressions">
          <YStack
            p="$3"
            borderWidth={1}
            borderColor="$borderColor"
            rounded="$2"
            gap="$2"
          >
            <Text fontSize="$2" color="$placeholderColor">
              {rule.expressions.length} expression(s) — type {rule.type}.
            </Text>
            {/* TODO(iam-resources): port the per-type expression tables
                (WafRuleTable / IpRuleTable / UaRuleTable /
                IpRateRuleTable / CompoundRule) once their inner
                primitives land. */}
          </YStack>
        </Field>
        {rule.type !== 'WAF' ? (
          <Field label="Action">
            <Select
              value={rule.action}
              onValueChange={(v) => update('action', v as RuleAction)}
            >
              <Select.Trigger>
                <Select.Value placeholder="Select action" />
              </Select.Trigger>
              <Select.Content>
                {ACTIONS.map((a, i) => (
                  <Select.Item key={a.id} value={a.id} index={i}>
                    <Select.ItemText>{a.label}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Content>
            </Select>
          </Field>
        ) : null}
        {rule.type !== 'WAF' ? (
          <Field label="Status code">
            <Input
              value={String(rule.statusCode ?? '')}
              keyboardType="numeric"
              onChangeText={(v) =>
                update('statusCode', parseInt(v, 10) || 0)
              }
            />
          </Field>
        ) : null}
        <Field label="Reason">
          <Input
            value={rule.reason}
            onChangeText={(v) => update('reason', v)}
          />
        </Field>
        <Field label="Verbose">
          <Switch
            checked={Boolean(rule.isVerbose)}
            onCheckedChange={(v: boolean) => update('isVerbose', v)}
          >
            <Switch.Thumb />
          </Switch>
        </Field>
      </YStack>
    </YStack>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <XStack gap="$3" items="center">
      <YStack width={160}>
        <Text fontSize="$2" color="$placeholderColor">
          {label}
        </Text>
      </YStack>
      <YStack flex={1}>{children}</YStack>
    </XStack>
  )
}
