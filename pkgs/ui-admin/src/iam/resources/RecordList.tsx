// Record list — IAM audit log. This is the highest-row-count list page
// in the bucket; the `data2` totals can hit hundreds of thousands per
// org. The view is read-only: each row links to its own detail panel
// (a side drawer holding the JSON payload), which is the upstream
// behaviour.
//
// Virtualization: the DataTable primitive renders all rows to the DOM.
// For a ~10k row page that's still tractable with the current row
// height, but on the roadmap is a windowed renderer. See TODO below.

import { useCallback, useMemo, useState } from 'react'
import { Anchor, Button, Text, XStack, YStack } from 'hanzogui'
import { Eye } from '@hanzogui/lucide-icons-2/icons/Eye'
import { X } from '@hanzogui/lucide-icons-2/icons/X'
import { ChevronLeft } from '@hanzogui/lucide-icons-2/icons/ChevronLeft'
import { ChevronRight } from '@hanzogui/lucide-icons-2/icons/ChevronRight'
import {
  DataTable,
  type DataTableColumn,
} from '../../primitives/DataTable'
import { Badge } from '../../primitives/Badge'
import { useFetch } from '../../data/useFetch'
import { formatTimestamp } from '../../data/format'
import { RecordUrls, type ListResponse, type RecordItem } from './api'
import { type AdminAccount, requestOrg } from './types'

const PAGE_SIZE = 20

const COLUMNS: DataTableColumn[] = [
  { key: 'id', label: 'ID', flex: 1 },
  { key: 'clientIp', label: 'Client IP', flex: 1 },
  { key: 'createdTime', label: 'Timestamp', flex: 1.5 },
  { key: 'organization', label: 'Organization', flex: 1 },
  { key: 'user', label: 'User', flex: 1 },
  { key: 'method', label: 'Method', flex: 0.6 },
  { key: 'requestUri', label: 'Request URI', flex: 2 },
  { key: 'action', label: 'Action', flex: 1 },
  { key: 'isTriggered', label: 'Triggered', flex: 0.8 },
  { key: 'detail', label: 'Detail', flex: 0.8 },
]

const TRIGGER_ACTIONS = new Set([
  'signup',
  'login',
  'logout',
  'update-user',
  'new-user',
])

function formatJson(s: string | undefined): string {
  if (!s) return ''
  try {
    return JSON.stringify(JSON.parse(s), null, 2)
  } catch {
    return s
  }
}

export interface RecordListProps {
  account: AdminAccount
}

export function RecordList({ account }: RecordListProps) {
  const [page, setPage] = useState(1)
  const [detail, setDetail] = useState<RecordItem | null>(null)

  const url = useMemo(
    () =>
      RecordUrls.list({
        owner: requestOrg(account),
        p: page,
        pageSize: PAGE_SIZE,
      }),
    [account, page],
  )

  const { data, error, isLoading } =
    useFetch<ListResponse<RecordItem>>(url)
  const total = data?.data2 ?? 0
  const rows = data?.data ?? []
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const isUnauthorized =
    data?.status === 'error' &&
    typeof data?.msg === 'string' &&
    data.msg.toLowerCase().includes('login')

  const onClose = useCallback(() => setDetail(null), [])

  if (isUnauthorized) {
    return (
      <YStack p="$8" items="center" gap="$3">
        <Text fontSize="$7" fontWeight="600" color="$color">
          403 Unauthorized
        </Text>
        <Anchor href="/" textDecorationLine="none">
          <Button>Back home</Button>
        </Anchor>
      </YStack>
    )
  }

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <Text fontSize="$6" fontWeight="600" color="$color">
          Records
        </Text>
        <Text fontSize="$2" color="$placeholderColor">
          {total} in total
        </Text>
      </XStack>

      {error ? (
        <Text fontSize="$2" color="#fca5a5">
          Could not load: {error.message}
        </Text>
      ) : null}

      {/* TODO(iam-resources): windowed virtualization for >10k rows.
          The DataTable primitive currently renders every row; for the
          audit log we should switch to a row-recycling renderer once
          @hanzogui/admin gains a `<DataTable virtualized />` knob. The
          per-page cap (PAGE_SIZE) keeps memory bounded in the meantime. */}
      <DataTable<RecordItem>
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => r.id}
        emptyState={{
          title: isLoading ? 'Loading...' : 'No records',
          hint: isLoading ? undefined : 'Audit events will appear here.',
        }}
        renderRow={(r) => [
          <Text color="$color">{r.id}</Text>,
          <Anchor
            href={`https://db-ip.com/${r.clientIp}`}
            target="_blank"
            rel="noreferrer"
            color="#60a5fa"
            textDecorationLine="none"
          >
            {r.clientIp}
          </Anchor>,
          <Text fontSize="$1" color="$placeholderColor">
            {formatTimestamp(new Date(r.createdTime))}
          </Text>,
          <Text color="$color">{r.organization}</Text>,
          <Text color="$color">{r.user}</Text>,
          <Text color="$color">{r.method}</Text>,
          <Text color="$color">{r.requestUri}</Text>,
          <Text color="$color">{r.action}</Text>,
          TRIGGER_ACTIONS.has(r.action) ? (
            <Badge variant={r.isTriggered ? 'success' : 'muted'}>
              {r.isTriggered ? 'ON' : 'OFF'}
            </Badge>
          ) : (
            <Text color="$placeholderColor">—</Text>
          ),
          <Button size="$2" icon={Eye} onPress={() => setDetail(r)}>
            Detail
          </Button>,
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

      {detail ? (
        <RecordDetailDrawer record={detail} onClose={onClose} />
      ) : null}
    </YStack>
  )
}

function RecordDetailDrawer({
  record,
  onClose,
}: {
  record: RecordItem
  onClose: () => void
}) {
  // Drawer is rendered absolutely positioned over the page. The
  // primitive layer doesn't yet expose a Sheet/Drawer, so we use a
  // styled YStack overlay. Click-outside dismisses; Escape doesn't
  // (parent doesn't forward keydown). Acceptable for an admin panel.
  return (
    <YStack
      position="absolute"
      t={0}
      l={0}
      r={0}
      b={0}
      z={50}
      onPress={onClose}
      bg={'rgba(0,0,0,0.5)' as never}
    >
      <YStack
        position="absolute"
        t={0}
        r={0}
        b={0}
        width={640}
        bg="$background"
        borderLeftWidth={1}
        borderLeftColor="$borderColor"
        p="$5"
        gap="$4"
        onPress={(e) => e.stopPropagation()}
      >
        <XStack items="center" justify="space-between">
          <Text fontSize="$6" fontWeight="600" color="$color">
            Detail
          </Text>
          <Button size="$2" chromeless icon={X} onPress={onClose} />
        </XStack>
        <YStack gap="$3">
          {([
            ['ID', record.id],
            ['Client IP', record.clientIp],
            ['Timestamp', record.createdTime],
            ['Method', record.method],
            ['Request URI', record.requestUri],
            ['Language', record.language ?? '—'],
            ['Status code', String(record.statusCode ?? '—')],
            ['Action', record.action],
            ['Organization', record.organization],
            ['User', record.user],
          ] as const).map(([label, value]) => (
            <XStack
              key={label}
              gap="$2"
              borderBottomWidth={1}
              borderBottomColor="$borderColor"
              pb="$2"
            >
              <YStack width={140}>
                <Text fontSize="$2" color="$placeholderColor">
                  {label}
                </Text>
              </YStack>
              <YStack flex={1}>
                <Text color="$color">{value}</Text>
              </YStack>
            </XStack>
          ))}
          <YStack gap="$1" pb="$2">
            <Text fontSize="$2" color="$placeholderColor">
              Response
            </Text>
            <Text
              fontSize="$1"
              color="$color"
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              p="$3"
              bg={'rgba(255,255,255,0.03)' as never}
              rounded="$2"
            >
              {record.response ?? ''}
            </Text>
          </YStack>
          <YStack gap="$1">
            <Text fontSize="$2" color="$placeholderColor">
              Object
            </Text>
            <Text
              fontSize="$1"
              color="$color"
              fontFamily={'ui-monospace, SFMono-Regular, monospace' as never}
              p="$3"
              bg={'rgba(255,255,255,0.03)' as never}
              rounded="$2"
            >
              {formatJson(record.object)}
            </Text>
          </YStack>
        </YStack>
      </YStack>
    </YStack>
  )
}
