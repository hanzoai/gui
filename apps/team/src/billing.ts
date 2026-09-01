// Real wallet data — balance + usage read from the billing surface through the
// generated client. No hardcoded money: on error the wallet shows an honest
// unavailable state, never a fake $0.00.
//
// The SDK owns the route, the host and the Authorization header. It does NOT own
// the shape: /v1/billing/balance is one of the operations the document states
// without a response schema, so `data` arrives untyped and the reduction below
// is still this file's job. That is why the reading stays and only the transport
// went.

import { BillingApi, Configuration } from 'hanzoai'

// One endpoint for every Hanzo surface, which is also what retired the separate
// billing.hanzo.ai host this file used to name.
const BASE = 'https://api.hanzo.ai'

export interface UsageRow {
  label: string
  value: string
}

export interface Wallet {
  /** balance in USD */
  balanceUsd: number
  usage: UsageRow[]
}

function num(v: unknown): number | undefined {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v)))
    return Number(v)
  return undefined
}

function usd(record: Record<string, unknown>): number | undefined {
  // atto-USD (18-dec) is the canonical money unit; also accept plain USD / cents fields.
  const atto = record.balance_atto_usd ?? record.balanceAtto ?? record.atto_usd
  if (typeof atto === 'string' && /^-?\d+$/.test(atto)) return Number(BigInt(atto)) / 1e18
  const dollars = num(
    record.balance_usd ?? record.balanceUsd ?? record.balance ?? record.credits
  )
  if (dollars !== undefined) return dollars
  const cents = num(record.balance_cents ?? record.balanceCents)
  if (cents !== undefined) return cents / 100
  return undefined
}

/** The org wallet for the signed-in session. Throws on any non-2xx / bad shape. */
export async function fetchWallet(accessToken: string): Promise<Wallet> {
  const billing = new BillingApi(new Configuration({ basePath: BASE, accessToken }))
  const { data } = (await billing.getBillingBalance()) as {
    data: Record<string, unknown>
  }
  const balanceUsd = usd(data)
  if (balanceUsd === undefined) throw new Error('no balance in billing response')

  const usage: UsageRow[] = []
  const period = data.period ?? data.month
  if (typeof period === 'string') usage.push({ label: 'Period', value: period })
  const spent = num(data.spent_usd ?? data.spentUsd ?? data.usage_usd)
  if (spent !== undefined)
    usage.push({ label: 'Spent this period', value: `$${spent.toFixed(2)}` })
  const requests = num(data.requests ?? data.request_count)
  if (requests !== undefined) usage.push({ label: 'Requests', value: String(requests) })
  const seats = num(data.seats ?? data.seat_count)
  if (seats !== undefined) usage.push({ label: 'Seats', value: String(seats) })

  return { balanceUsd, usage }
}
