/**
 * Storage adapter on top of @hanzo/base.
 *
 * Replaces `supabaseAdmin.storage.from('bento')`. The external bucket name
 * was renamed from `bento` to `recipes` per the rebrand pass.
 *
 * Operations exposed: download, list, createSignedUrl — exactly what
 * `features/auth/supabaseAdmin.ts` consumes.
 */

import { getBase } from './index.js'

export type ListItem = {
  name: string
  id: string | null
}

export type DownloadResult = { data: Blob; error: null } | {
  data: null
  error: Error
}

export type ListResult =
  | { data: ListItem[]; error: null }
  | { data: null; error: Error }

export type SignedUrlResult =
  | { data: { signedUrl: string }; error: null }
  | { data: null; error: Error }

class Bucket {
  constructor(private readonly name: string) {}

  async download(path: string): Promise<DownloadResult> {
    try {
      const base = getBase()
      const url = `${base.url}/v1/storage/${encodeURIComponent(this.name)}/objects/${encodePath(path)}`
      const res = await fetch(url, { headers: this.headers() })
      if (!res.ok) {
        return { data: null, error: new Error(`download ${res.status}`) }
      }
      const blob = await res.blob()
      return { data: blob, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  async list(path: string): Promise<ListResult> {
    try {
      const base = getBase()
      const url = `${base.url}/v1/storage/${encodeURIComponent(this.name)}/list?prefix=${encodeURIComponent(path)}`
      const res = await fetch(url, { headers: this.headers() })
      if (!res.ok) {
        return { data: null, error: new Error(`list ${res.status}`) }
      }
      const items = (await res.json()) as ListItem[]
      return { data: items, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  async createSignedUrl(path: string, ttlSeconds: number): Promise<SignedUrlResult> {
    try {
      const base = getBase()
      const url = `${base.url}/v1/storage/${encodeURIComponent(this.name)}/signed-url`
      const res = await fetch(url, {
        method: 'POST',
        headers: { ...this.headers(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, ttl: ttlSeconds }),
      })
      if (!res.ok) {
        return { data: null, error: new Error(`signed-url ${res.status}`) }
      }
      const body = (await res.json()) as { url: string }
      return { data: { signedUrl: body.url }, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  private headers(): HeadersInit {
    const base = getBase()
    return base.authStore.token
      ? { Authorization: base.authStore.token }
      : {}
  }
}

function encodePath(p: string): string {
  return p.split('/').map(encodeURIComponent).join('/')
}

export const storage = {
  from(bucket: string) {
    return new Bucket(bucket)
  },
}
