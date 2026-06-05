/**
 * @hanzo/base-backed DB client for gui.hanzo.ai
 *
 * Why this exists: the cloud UI has ~60 files that call
 * `supabaseAdmin.from('X').select(...)` etc. Rather than rewriting all 60 at
 * once, we expose a small adapter with the same call shape on top of
 * `@hanzo/base` collections. The adapter is intentionally minimal — supports
 * exactly the operations the codebase uses. New code should call the
 * `BaseClient` directly via `getBase()`.
 *
 * One-way contract:
 *  - `db.from(name)` returns a Query you compose with .select / .insert /
 *    .update / .delete / .eq / .in / .order / .limit / .maybeSingle / .single
 *  - The terminal call returns `{ data, error }` exactly like the supabase
 *    response shape so the existing call sites keep type-checking.
 *
 * Errors: we never swallow. Any non-2xx Base response is surfaced as `error`
 * with the Base detail attached.
 */

import { BaseClient } from '@hanzo/base'

const BASE_URL =
  process.env.HANZO_BASE_URL ?? process.env.NEXT_PUBLIC_HANZO_BASE_URL ?? ''

let _base: BaseClient | null = null

export function getBase(): BaseClient {
  if (!_base) {
    if (!BASE_URL) {
      throw new Error('HANZO_BASE_URL (or NEXT_PUBLIC_HANZO_BASE_URL) is required')
    }
    _base = new BaseClient(BASE_URL)
    const adminToken = process.env.HANZO_BASE_ADMIN_TOKEN
    if (adminToken) {
      _base.authStore.save(adminToken, null)
    }
  }
  return _base
}

type Row = Record<string, unknown>
type Response<T> = { data: T; error: null } | { data: null; error: Error }

type FilterOp = { field: string; op: 'eq' | 'in'; value: unknown }

class Query<T = Row> {
  private filters: FilterOp[] = []
  private sortField?: { field: string; ascending: boolean }
  private limitN?: number
  private fields?: string

  constructor(
    private readonly collection: string,
    private readonly mode: 'select' | 'insert' | 'update' | 'delete' | 'upsert',
    private readonly payload?: Row | Row[],
  ) {}

  select(fields?: string): this {
    if (fields) this.fields = fields
    return this
  }

  eq(field: string, value: unknown): this {
    this.filters.push({ field, op: 'eq', value })
    return this
  }

  in(field: string, values: unknown[]): this {
    this.filters.push({ field, op: 'in', value: values })
    return this
  }

  order(field: string, opts?: { ascending?: boolean }): this {
    this.sortField = { field, ascending: opts?.ascending ?? true }
    return this
  }

  limit(n: number): this {
    this.limitN = n
    return this
  }

  /** Resolve as the first row or null. Errors only on transport failure. */
  async maybeSingle(): Promise<Response<T | null>> {
    try {
      const rows = await this.executeSelect()
      return { data: (rows[0] as T) ?? null, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  /** Resolve as the first row; errors if zero rows. */
  async single(): Promise<Response<T>> {
    try {
      const rows = await this.executeSelect()
      if (!rows[0]) {
        return { data: null, error: new Error(`no row in ${this.collection}`) }
      }
      return { data: rows[0] as T, error: null }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  /** Default "thenable" — resolves to a multi-row response. */
  then<R1 = Response<T[]>, R2 = never>(
    onFulfilled?: (value: Response<T[]>) => R1 | PromiseLike<R1>,
    onRejected?: (reason: unknown) => R2 | PromiseLike<R2>,
  ): Promise<R1 | R2> {
    return this.execute().then(onFulfilled, onRejected)
  }

  private async execute(): Promise<Response<T[]>> {
    try {
      switch (this.mode) {
        case 'select': {
          const rows = await this.executeSelect()
          return { data: rows as T[], error: null }
        }
        case 'insert': {
          const created = await this.executeInsert()
          return { data: created as T[], error: null }
        }
        case 'upsert': {
          const upserted = await this.executeUpsert()
          return { data: upserted as T[], error: null }
        }
        case 'update': {
          const updated = await this.executeUpdate()
          return { data: updated as T[], error: null }
        }
        case 'delete': {
          await this.executeDelete()
          return { data: [] as T[], error: null }
        }
      }
    } catch (err) {
      return { data: null, error: err as Error }
    }
  }

  private async executeSelect(): Promise<Row[]> {
    const base = getBase()
    const filter = this.buildFilter()
    const result = await base.list(this.collection, {
      filter: filter || undefined,
      sort: this.sortField
        ? `${this.sortField.ascending ? '+' : '-'}${this.sortField.field}`
        : undefined,
      fields: this.fields,
      perPage: this.limitN,
    })
    return result.items as Row[]
  }

  private async executeInsert(): Promise<Row[]> {
    const base = getBase()
    const rows = Array.isArray(this.payload) ? this.payload : [this.payload!]
    const created: Row[] = []
    for (const row of rows) {
      created.push(await base.create(this.collection, row))
    }
    return created
  }

  private async executeUpsert(): Promise<Row[]> {
    const base = getBase()
    const rows = Array.isArray(this.payload) ? this.payload : [this.payload!]
    const result: Row[] = []
    for (const row of rows) {
      const id = (row as { id?: string }).id
      if (id) {
        try {
          result.push(await base.update(this.collection, id, row))
          continue
        } catch {
          /* fall through to create */
        }
      }
      result.push(await base.create(this.collection, row))
    }
    return result
  }

  private async executeUpdate(): Promise<Row[]> {
    const base = getBase()
    const targets = await this.executeSelect()
    const updated: Row[] = []
    for (const t of targets) {
      const id = (t as { id?: string }).id
      if (!id) continue
      updated.push(await base.update(this.collection, id, this.payload as Row))
    }
    return updated
  }

  private async executeDelete(): Promise<void> {
    const base = getBase()
    const targets = await this.executeSelect()
    for (const t of targets) {
      const id = (t as { id?: string }).id
      if (!id) continue
      await base.delete(this.collection, id)
    }
  }

  private buildFilter(): string {
    if (this.filters.length === 0) return ''
    return this.filters
      .map((f) => {
        if (f.op === 'eq') return `${f.field}=${quote(f.value)}`
        if (f.op === 'in') {
          const list = (f.value as unknown[]).map(quote).join(',')
          return `${f.field} ~ (${list})`
        }
        return ''
      })
      .filter(Boolean)
      .join(' && ')
  }
}

function quote(v: unknown): string {
  if (v == null) return 'null'
  if (typeof v === 'number' || typeof v === 'boolean') return String(v)
  return `"${String(v).replace(/"/g, '\\"')}"`
}

class Table {
  constructor(private readonly name: string) {}

  select(fields?: string) {
    return new Query(this.name, 'select').select(fields)
  }

  insert(payload: Row | Row[]) {
    return new Query(this.name, 'insert', payload)
  }

  upsert(payload: Row | Row[]) {
    return new Query(this.name, 'upsert', payload)
  }

  update(payload: Row) {
    return new Query(this.name, 'update', payload)
  }

  delete() {
    return new Query(this.name, 'delete')
  }
}

/** Singleton DB facade — `db.from('users').select('*').eq('id', uid).single()`. */
export const db = {
  from<T = Row>(name: string) {
    return new Table(name) as unknown as {
      select(fields?: string): Query<T>
      insert(payload: Row | Row[]): Query<T>
      upsert(payload: Row | Row[]): Query<T>
      update(payload: Row): Query<T>
      delete(): Query<T>
    }
  },
}

export type { Query, Response, Row }
