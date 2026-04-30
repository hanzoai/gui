// Unit tests for the cluster capability hook. Cache lives at module
// scope so tests must reset it (and the request log) between cases.

import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useCluster, __resetClusterCacheForTests } from '../cluster'
import { server, http, HttpResponse } from '../../test/msw'

beforeEach(() => {
  __resetClusterCacheForTests()
  server.resetHandlers()
})

describe('useCluster', () => {
  it('reports enabled=true and caches across consumers when /v1/tasks/cluster returns 200', async () => {
    let calls = 0
    server.use(
      http.get('/v1/tasks/cluster', () => {
        calls++
        return HttpResponse.json({
          nodeId: 'n1',
          replicator: 'quasar',
          validators: [{ id: 'n1', addr: '10.0.0.1:9000', role: 'leader', health: 'healthy' }],
          leaderFor: { 'hanzo/default': 'n1' },
          replicationLag: 12,
          shardCount: 4,
          openShards: 4,
        })
      }),
    )

    const a = renderHook(() => useCluster())
    await waitFor(() => expect(a.result.current.loading).toBe(false))
    expect(a.result.current.enabled).toBe(true)
    expect(a.result.current.status?.replicator).toBe('quasar')

    // Second consumer must reuse the cached probe — no extra fetch.
    const b = renderHook(() => useCluster())
    expect(b.result.current.enabled).toBe(true)
    expect(calls).toBe(1)
  })

  it('reports enabled=false when the endpoint 404s (single-node mode)', async () => {
    server.use(
      http.get('/v1/tasks/cluster', () => HttpResponse.text('not found', { status: 404 })),
    )
    const { result } = renderHook(() => useCluster())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.enabled).toBe(false)
    expect(result.current.status).toBeUndefined()
    expect(result.current.error).toBeUndefined()
  })

  it('records non-404 transport failures as error, not disabled', async () => {
    server.use(
      http.get('/v1/tasks/cluster', () => HttpResponse.text('boom', { status: 500 })),
    )
    const { result } = renderHook(() => useCluster())
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.enabled).toBe(false)
    expect(result.current.error).toBeDefined()
  })
})
