// Minimal request-handler registry that intercepts global fetch. Mirrors
// the shape of msw's `setupServer(...handlers)` so call sites read the
// same way:
//
//   import { server, http, HttpResponse } from './msw'
//   server.use(http.get('/v1/tasks/namespaces', () => HttpResponse.json({...})))
//
// The reason we don't pull in real msw: it would require a service-worker
// shim under jsdom and our test surface is HTTP-only. A 60-LOC fetch
// stub gives us the same handler API with zero install cost. msw is
// still listed in devDeps so an integration suite can opt in later.

import { vi } from 'vitest'
import {
  buildBatch,
  buildHistoryEvent,
  buildNamespace,
  buildNexusEndpoint,
  buildSchedule,
  buildWorkflow,
} from './factories'

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'

export interface RequestCtx {
  url: URL
  method: Method
  params: Record<string, string>
  body: unknown
  headers: Headers
}

export type Handler = {
  method: Method
  pattern: RegExp
  paramNames: string[]
  resolver: (ctx: RequestCtx) => Response | Promise<Response>
}

function compile(path: string): { pattern: RegExp; paramNames: string[] } {
  const paramNames: string[] = []
  const escaped = path.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:([A-Za-z_][\w]*)/g, (_m, name) => {
    paramNames.push(name)
    return '([^/?#]+)'
  })
  return { pattern: new RegExp(`^${escaped}(?:\\?[^#]*)?(?:#.*)?$`), paramNames }
}

function makeHandler(method: Method, path: string, resolver: Handler['resolver']): Handler {
  const { pattern, paramNames } = compile(path)
  return { method, pattern, paramNames, resolver }
}

export const HttpResponse = {
  json(value: unknown, init: ResponseInit = {}): Response {
    return new Response(JSON.stringify(value), {
      ...init,
      headers: { 'content-type': 'application/json', ...(init.headers ?? {}) },
    })
  },
  text(value: string, init: ResponseInit = {}): Response {
    return new Response(value, init)
  },
  empty(status = 204): Response {
    return new Response(null, { status })
  },
}

export const http = {
  get: (path: string, resolver: Handler['resolver']) => makeHandler('GET', path, resolver),
  post: (path: string, resolver: Handler['resolver']) => makeHandler('POST', path, resolver),
  put: (path: string, resolver: Handler['resolver']) => makeHandler('PUT', path, resolver),
  delete: (path: string, resolver: Handler['resolver']) => makeHandler('DELETE', path, resolver),
  patch: (path: string, resolver: Handler['resolver']) => makeHandler('PATCH', path, resolver),
}

class Server {
  private base: Handler[] = []
  private overrides: Handler[] = []
  private originalFetch: typeof globalThis.fetch | null = null
  public requests: Array<{ method: Method; url: string; body: unknown }> = []

  use(...h: Handler[]) {
    this.overrides.push(...h)
  }

  setBase(...h: Handler[]) {
    this.base = h
  }

  resetHandlers() {
    this.overrides = []
    this.requests = []
  }

  listen() {
    if (this.originalFetch) return
    this.originalFetch = globalThis.fetch
    vi.stubGlobal('fetch', this.handleFetch.bind(this))
  }

  close() {
    if (this.originalFetch) {
      vi.unstubAllGlobals()
      this.originalFetch = null
    }
  }

  private async handleFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url
    const method = ((init?.method ?? (typeof input !== 'string' && !(input instanceof URL) ? input.method : 'GET')) || 'GET').toUpperCase() as Method
    const u = new URL(url, 'http://localhost')
    let body: unknown = undefined
    const rawBody = init?.body ?? (typeof input !== 'string' && !(input instanceof URL) ? null : null)
    if (rawBody) {
      if (typeof rawBody === 'string') {
        try { body = JSON.parse(rawBody) } catch { body = rawBody }
      } else {
        body = rawBody
      }
    }
    this.requests.push({ method, url: u.pathname + u.search, body })

    const all = [...this.overrides, ...this.base]
    for (const h of all) {
      if (h.method !== method) continue
      const m = h.pattern.exec(u.pathname)
      if (!m) continue
      const params: Record<string, string> = {}
      h.paramNames.forEach((p, i) => { params[p] = decodeURIComponent(m[i + 1]) })
      const ctx: RequestCtx = {
        url: u,
        method,
        params,
        body,
        headers: new Headers(init?.headers ?? {}),
      }
      return h.resolver(ctx)
    }
    return new Response(`unhandled ${method} ${u.pathname}`, { status: 501 })
  }
}

// ── default handler set covering /v1/tasks/* used by app code ─────────

const defaults: Handler[] = [
  http.get('/v1/tasks/namespaces', () =>
    HttpResponse.json({ namespaces: [buildNamespace({ namespaceInfo: { name: 'default', state: 'Registered' } })] }),
  ),
  http.get('/v1/tasks/namespaces/:ns', ({ params }) =>
    HttpResponse.json(buildNamespace({ namespaceInfo: { name: params.ns, state: 'Registered' } })),
  ),
  http.get('/v1/tasks/namespaces/:ns/workflows', ({ url }) => {
    const token = url.searchParams.get('nextPageToken')
    if (token === 'page2') {
      return HttpResponse.json({ executions: [buildWorkflow({ workflowId: 'wf-3' })], nextPageToken: null })
    }
    return HttpResponse.json({
      executions: [buildWorkflow({ workflowId: 'wf-1' }), buildWorkflow({ workflowId: 'wf-2' })],
      nextPageToken: 'page2',
    })
  }),
  http.get('/v1/tasks/namespaces/:ns/workflows/:id', ({ params }) =>
    HttpResponse.json({ workflowExecutionInfo: buildWorkflow({ workflowId: params.id }) }),
  ),
  http.get('/v1/tasks/namespaces/:ns/workflows/:id/history', () =>
    HttpResponse.json({
      history: { events: [buildHistoryEvent({ eventId: '1', eventType: 'WorkflowExecutionStarted' })] },
      nextPageToken: null,
    }),
  ),
  http.post('/v1/tasks/namespaces/:ns/workflows', ({ body, params }) => {
    const b = body as { workflowId?: string }
    return HttpResponse.json(buildWorkflow({ workflowId: b?.workflowId ?? 'wf-new', namespace: params.ns }))
  }),
  http.post('/v1/tasks/namespaces/:ns/workflows/:id/signal', () => HttpResponse.json({ status: 'OK' })),
  http.post('/v1/tasks/namespaces/:ns/workflows/:id/cancel', ({ params }) =>
    HttpResponse.json(buildWorkflow({ workflowId: params.id, status: 'WORKFLOW_EXECUTION_STATUS_CANCELED' })),
  ),
  http.post('/v1/tasks/namespaces/:ns/workflows/:id/terminate', ({ params }) =>
    HttpResponse.json(buildWorkflow({ workflowId: params.id, status: 'WORKFLOW_EXECUTION_STATUS_TERMINATED' })),
  ),
  http.post('/v1/tasks/namespaces/:ns/workflows/:id/query', ({ body }) =>
    HttpResponse.json({ result: { echoed: (body as { queryType?: string })?.queryType ?? null } }),
  ),
  http.get('/v1/tasks/namespaces/:ns/schedules', () =>
    HttpResponse.json({ schedules: [buildSchedule({ scheduleId: 'sch-1' })] }),
  ),
  http.post('/v1/tasks/namespaces/:ns/schedules', ({ body }) =>
    HttpResponse.json(buildSchedule(body as Record<string, unknown>)),
  ),
  http.get('/v1/tasks/namespaces/:ns/batches', () =>
    HttpResponse.json({ batches: [buildBatch({ batchId: 'b-1' })] }),
  ),
  http.post('/v1/tasks/namespaces/:ns/batches', ({ body }) =>
    HttpResponse.json(buildBatch(body as Record<string, unknown>)),
  ),
  http.get('/v1/tasks/nexus', () =>
    HttpResponse.json({ endpoints: [buildNexusEndpoint({ name: 'echo' })] }),
  ),
  http.post('/v1/tasks/nexus', ({ body }) =>
    HttpResponse.json(buildNexusEndpoint(body as Record<string, unknown>)),
  ),
  http.get('/v1/tasks/namespaces/:ns/nexus', () =>
    HttpResponse.json({ endpoints: [buildNexusEndpoint({ name: 'ns-echo' })] }),
  ),
  http.post('/v1/tasks/namespaces/:ns/nexus', ({ body }) =>
    HttpResponse.json(buildNexusEndpoint(body as Record<string, unknown>)),
  ),
  http.delete('/v1/tasks/namespaces/:ns/nexus/:id', () => HttpResponse.json({ status: 'OK' })),
  http.delete('/v1/tasks/namespaces/:ns/schedules/:id', () => HttpResponse.json({ status: 'OK' })),
]

export const server = new Server()
server.setBase(...defaults)
