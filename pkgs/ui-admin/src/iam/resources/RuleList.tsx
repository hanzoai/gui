// Rule list — traffic rules attached to sites. Five types: WAF / IP /
// User-Agent / IP Rate Limiting / Compound. Each row's expressions are
// summarized as small chips; the full editor lives on the edit page.

import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, Button, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import {
  DataTable,
  type DataTableColumn,
} from '../../primitives/DataTable'
import { Badge } from '../../primitives/Badge'
import { apiDelete, apiPost, useFetch } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import { RuleUrls, type ListResponse, type RuleItem } from './api'
import { type AdminAccount, requestOrg } from './types'

const PAGE_SIZE = 10

const COLUMNS: DataTableColumn[] = [
  { key: 'owner', label: 'Owner', flex: 1 },
  { key: 'name', label: 'Name', flex: 1.2 },
  { key: 'createdTime', label: 'Created', flex: 1.5 },
  { key: 'type', label: 'Type', flex: 1 },
  { key: 'expressions', label: 'Expressions', flex: 2 },
  { key: 'action', label: 'Action', flex: 1 },
  { key: 'reason', label: 'Reason', flex: 2 },
  { key: 'op', label: '', flex: 1.5 },
]

function randomSlug(): string {
  return Math.random().toString(36).slice(2, 10)
}

export interface RuleListProps {
  account: AdminAccount
}

export function RuleList({ account }: RuleListProps) {
  const nav = useNavigate()
  const [page, setPage] = useState(1)

  const url = useMemo(
    () =>
      RuleUrls.list({
        owner: account.owner,
        p: page,
        pageSize: PAGE_SIZE,
      }),
    [account.owner, page],
  )

  const { data, error, isLoading, mutate } =
    useFetch<ListResponse<RuleItem>>(url)
  const total = data?.data2 ?? 0
  const rows = data?.data ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const onAdd = useCallback(async () => {
    const slug = randomSlug()
    const owner = requestOrg(account) || 'admin'
    const r: RuleItem = {
      owner,
      name: `rule_${slug}`,
      createdTime: new Date().toISOString(),
      type: 'User-Agent',
      expressions: [],
      action: 'Block',
      reason: 'Your request is blocked.',
    }
    await apiPost(RuleUrls.create(), r)
    await mutate()
  }, [account, mutate])

  const onDelete = useCallback(
    async (item: RuleItem) => {
      if (!confirm(`Delete rule "${item.name}"?`)) return
      await apiDelete(RuleUrls.remove(item.owner, item.name))
      await mutate()
    },
    [mutate],
  )

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <Text fontSize="$6" fontWeight="600" color="$color">
          Rules
        </Text>
        <XStack gap="$2" items="center">
          <Text fontSize="$2" color="$placeholderColor">
            {total} in total
          </Text>
          <Button size="$3" onPress={onAdd} icon={Plus}>
            Add
          </Button>
        </XStack>
      </XStack>

      {error ? (
        <Text fontSize="$2" color="#fca5a5">
          Could not load: {error.message}
        </Text>
      ) : null}

      <DataTable<RuleItem>
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{
          title: isLoading ? 'Loading...' : 'No rules',
          hint: isLoading ? undefined : 'Add a rule to start gating traffic.',
        }}
        renderRow={(r) => [
          <Text color="$color">{r.owner}</Text>,
          <Anchor
            href={`/rules/${r.owner}/${r.name}`}
            color="#60a5fa"
            textDecorationLine="none"
          >
            {r.name}
          </Anchor>,
          <Text fontSize="$1" color="$placeholderColor">
            {formatTimestamp(new Date(r.createdTime))}
          </Text>,
          <Badge variant="info">{r.type}</Badge>,
          <XStack flexWrap="wrap" gap="$1">
            {(r.expressions ?? []).slice(0, 3).map((e, i) => (
              <Badge key={i} variant="success">
                {`${e.operator ?? ''} ${(e.value ?? '').slice(0, 20)}`.trim()}
              </Badge>
            ))}
            {(r.expressions ?? []).length > 3 ? (
              <Text fontSize="$1" color="$placeholderColor">
                +{(r.expressions ?? []).length - 3} more
              </Text>
            ) : null}
          </XStack>,
          <Text color="$color">{r.action}</Text>,
          <Text color="$color">{r.reason}</Text>,
          <XStack gap="$2">
            <Button
              size="$2"
              icon={Pencil}
              onPress={() => nav(`/rules/${r.owner}/${r.name}`)}
            >
              Edit
            </Button>
            <Button
              size="$2"
              theme="red"
              icon={Trash2}
              onPress={() => onDelete(r)}
            >
              Delete
            </Button>
          </XStack>,
        ]}
      />

      {totalPages > 1 ? (
        <XStack gap="$2" justify="flex-end" items="center">
          <Button
            size="$2"
            disabled={page <= 1}
            onPress={() => setPage((p) => Math.max(1, p - 1))}
            icon={ChevronLeft}
          />
          <Text fontSize="$2" color="$placeholderColor">
            {page} / {totalPages}
          </Text>
          <Button
            size="$2"
            disabled={page >= totalPages}
            onPress={() => setPage((p) => Math.min(totalPages, p + 1))}
            icon={ChevronRight}
          />
        </XStack>
      ) : null}
    </YStack>
  )
}
