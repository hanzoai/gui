// SelectNamespace — landing page when no namespace is active. Renders
// the org's accessible namespaces as a tile grid; click a tile to land
// on /namespaces/:ns/workflows.

import { useNavigate } from 'react-router-dom'
import { H1, Paragraph, Text, XStack, YStack } from 'hanzogui'
import { Empty, ErrorState, LoadingState, useFetch } from '@hanzogui/admin'
import type { Namespace } from '../lib/api'
import { Namespaces } from '../lib/api'
import { NamespaceCard } from '../components/namespace/NamespaceCard'

const RECENTS_KEY = 'tasks.recent-namespaces'

function pushRecent(id: string) {
  if (typeof window === 'undefined') return
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY)
    const prev: string[] = raw ? JSON.parse(raw) : []
    const next = [id, ...prev.filter((v) => v !== id)].slice(0, 5)
    window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  } catch {
    // ignore quota / disabled storage
  }
}

export function SelectNamespacePage() {
  const navigate = useNavigate()
  const url = Namespaces.listUrl(200)
  const { data, error, isLoading } = useFetch<{ namespaces: Namespace[] }>(url)

  if (error) return <ErrorState error={error as Error} />
  if (isLoading) return <LoadingState />
  const nss = data?.namespaces ?? []

  if (nss.length === 0) {
    return (
      <Empty
        title="No namespaces accessible"
        hint="Your IAM identity is not granted access to any namespace yet. Ask an admin to grant you access via POST /v1/tasks/namespaces/{ns}/identities."
      />
    )
  }

  function select(name: string) {
    pushRecent(name)
    navigate(`/namespaces/${encodeURIComponent(name)}/workflows`)
  }

  return (
    <YStack gap="$5">
      <YStack gap="$2">
        <H1 size="$8" color="$color" fontWeight="600">
          Select a namespace
        </H1>
        <Paragraph color="$placeholderColor" fontSize="$3">
          Pick a namespace to start working in. Your selection will be remembered for next time.
        </Paragraph>
      </YStack>
      <XStack gap="$3" flexWrap="wrap">
        {nss.map((ns) => (
          <NamespaceCard
            key={ns.namespaceInfo.name}
            ns={ns}
            onSelect={select}
          />
        ))}
      </XStack>
      <Text fontSize="$1" color="$placeholderColor">
        {nss.length} namespace{nss.length === 1 ? '' : 's'} accessible.
      </Text>
    </YStack>
  )
}
