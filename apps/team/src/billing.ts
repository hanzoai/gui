// Real wallet data — balance + usage read from the billing surface with the session's
// bearer token. No hardcoded money: on error the wallet shows an honest unavailable
// state, never a fake $0.00.

const BILLING_BASE = 'https://billing.hanzo.ai'

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
  if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v)
  return undefined
}

function usd(record: Record<string, unknown>): number | undefined {
  // atto-USD (18-dec) is the canonical money unit; also accept plain USD / cents fields.
  const atto = record.balance_atto_usd ?? record.balanceAtto ?? record.atto_usd
  if (typeof atto === 'string' && /^-?\d+$/.test(atto)) return Number(BigInt(atto)) / 1e18
  const dollars = num(record.balance_usd ?? record.balanceUsd ?? record.balance ?? record.credits)
  if (dollars !== undefined) return dollars
  const cents = num(record.balance_cents ?? record.balanceCents)
  if (cents !== undefined) return cents / 100
  return undefined
}

/** GET the org wallet for the signed-in session. Throws on any non-2xx / bad shape. */
export async function fetchWallet(accessToken: string): Promise<Wallet> {
  const res = await fetch(`${BILLING_BASE}/v1/billing/balance`, {
    headers: { authorization: `Bearer ${accessToken}`, accept: 'application/json' },
  })
  if (!res.ok) throw new Error(`billing ${res.status}`)
  const data = (await res.json()) as Record<string, unknown>
  const balanceUsd = usd(data)
  if (balanceUsd === undefined) throw new Error('no balance in billing response')

  const usage: UsageRow[] = []
  const period = data.period ?? data.month
  if (typeof period === 'string') usage.push({ label: 'Period', value: period })
  const spent = num(data.spent_usd ?? data.spentUsd ?? data.usage_usd)
  if (spent !== undefined) usage.push({ label: 'Spent this period', value: `$${spent.toFixed(2)}` })
  const requests = num(data.requests ?? data.request_count)
  if (requests !== undefined) usage.push({ label: 'Requests', value: String(requests) })
  const seats = num(data.seats ?? data.seat_count)
  if (seats !== undefined) usage.push({ label: 'Seats', value: String(seats) })

  return { balanceUsd, usage }
}
