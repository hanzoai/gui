// Site list — public-facing reverse-proxy mappings. Each row points
// a domain at a backend host, optionally guarded by an SSL cert and
// an IAM application. The "global" view is the union across all orgs;
// it kicks in when the admin is scoped to the default/built-in org.

import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Anchor, Button, Text, XStack, YStack } from 'hanzogui'
import { Plus } from '@hanzogui/lucide-icons-2/icons/Plus'
import { Pencil } from '@hanzogui/lucide-icons-2/icons/Pencil'
import { Trash2 } from '@hanzogui/lucide-icons-2/icons/Trash2'
import {
  DataTable,
  type DataTableColumn,
} from '../../primitives/DataTable'
import { apiDelete, apiPost, useFetch } from '../../data/useFetch'
import { SiteUrls, type ListResponse, type SiteItem } from './api'
import { type AdminAccount, requestOrg } from './types'

const COLUMNS: DataTableColumn[] = [
  { key: 'owner', label: 'Owner', flex: 1 },
  { key: 'name', label: 'Name', flex: 1 },
  { key: 'displayName', label: 'Display name', flex: 1.5 },
  { key: 'domain', label: 'Domain', flex: 1.5 },
  { key: 'host', label: 'Host', flex: 1.2 },
  { key: 'sslCert', label: 'SSL cert', flex: 1 },
  { key: 'op', label: '', flex: 1.5 },
]

function randomSlug(): string {
  return Math.random().toString(36).slice(2, 10)
}

export interface SiteListProps {
  account: AdminAccount
}

export function SiteList({ account }: SiteListProps) {
  const nav = useNavigate()

  // Default org sees the global aggregate; otherwise scoped to owner.
  const url = useMemo(() => {
    const o = requestOrg(account)
    return o === ''
      ? SiteUrls.globalList()
      : SiteUrls.list({ owner: o, p: 1, pageSize: 1000 })
  }, [account])

  const { data, error, isLoading, mutate } =
    useFetch<ListResponse<SiteItem>>(url)
  const rows = data?.data ?? []

  const onAdd = useCallback(async () => {
    const slug = randomSlug()
    const owner = requestOrg(account) || 'admin'
    const s: SiteItem = {
      owner,
      name: `site_${slug}`,
      createdTime: new Date().toISOString(),
      displayName: `New Site - ${slug}`,
      domain: 'door.hanzo.ai',
      host: '',
      port: 8000,
      sslMode: 'HTTPS Only',
      publicIp: '',
    }
    await apiPost(SiteUrls.create(), s)
    await mutate()
  }, [account, mutate])

  const onDelete = useCallback(
    async (item: SiteItem) => {
      if (!confirm(`Delete site "${item.name}"?`)) return
      await apiDelete(SiteUrls.remove(item.owner, item.name))
      await mutate()
    },
    [mutate],
  )

  return (
    <YStack gap="$4">
      <XStack items="center" justify="space-between">
        <Text fontSize="$6" fontWeight="600" color="$color">
          Sites
        </Text>
        <Button size="$3" onPress={onAdd} icon={Plus}>
          Add
        </Button>
      </XStack>

      {error ? (
        <Text fontSize="$2" color="#fca5a5">
          Could not load: {error.message}
        </Text>
      ) : null}

      <DataTable<SiteItem>
        columns={COLUMNS}
        rows={rows}
        rowKey={(r) => `${r.owner}/${r.name}`}
        emptyState={{
          title: isLoading ? 'Loading...' : 'No sites',
          hint: isLoading ? undefined : 'Add a site to expose a domain.',
        }}
        renderRow={(r) => [
          <Text color="$color">{r.owner}</Text>,
          <Anchor
            href={`/sites/${r.owner}/${r.name}`}
            color="#60a5fa"
            textDecorationLine="none"
          >
            {r.name}
          </Anchor>,
          <Text color="$color">{r.displayName}</Text>,
          r.publicIp ? (
            <Anchor
              href={`https://${r.domain}`}
              target="_blank"
              rel="noreferrer"
              color="#60a5fa"
              textDecorationLine="none"
            >
              {r.domain}
            </Anchor>
          ) : (
            <Text color="$color">{r.domain}</Text>
          ),
          <Text color="$color">
            {r.host ? `${r.host}:${r.port}` : String(r.port)}
          </Text>,
          r.sslCert ? (
            <Anchor
              href={`/certs/admin/${r.sslCert}`}
              color="#60a5fa"
              textDecorationLine="none"
            >
              {r.sslCert}
            </Anchor>
          ) : (
            <Text color="$placeholderColor">—</Text>
          ),
          <XStack gap="$2">
            <Button
              size="$2"
              onPress={() => nav(`/sites/${r.owner}/${r.name}`)}
              icon={Pencil}
            >
              Edit
            </Button>
            <Button
              size="$2"
              theme="red"
              onPress={() => onDelete(r)}
              icon={Trash2}
            >
              Delete
            </Button>
          </XStack>,
        ]}
      />
    </YStack>
  )
}
