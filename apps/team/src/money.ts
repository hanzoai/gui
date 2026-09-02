// Reading money off an untyped payload.
//
// /v1/billing/balance is one of the operations the document states without a
// response schema, so the SDK hands back `any` and someone has to decide what a
// balance looks like. That someone is here, and only here — it is a reading, not
// a request, and keeping it out of the transport is what lets each be read on its
// own terms.
//
// No hardcoded money: a shape this cannot read is an error, never a fake $0.00.

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

/** atto-USD (18-dec) is the canonical money unit; plain USD and cents also read. */
function usd(record: Record<string, unknown>): number | undefined {
  const atto = record.balance_atto_usd ?? record.balanceAtto ?? record.atto_usd
  if (typeof atto === 'string' && /^-?\d+$/.test(atto)) return Number(BigInt(atto)) / 1e18
  const dollars = num(record.balance_usd ?? record.balanceUsd ?? record.balance ?? record.credits)
  if (dollars !== undefined) return dollars
  const cents = num(record.balance_cents ?? record.balanceCents)
  return cents === undefined ? undefined : cents / 100
}

/** One untyped payload in, a Wallet out. Throws when there is no balance to read. */
export function read(record: Record<string, unknown>): Wallet {
  const balanceUsd = usd(record)
  if (balanceUsd === undefined) throw new Error('no balance in billing response')

  const usage: UsageRow[] = []
  const period = record.period ?? record.month
  if (typeof period === 'string') usage.push({ label: 'Period', value: period })
  const spent = num(record.spent_usd ?? record.spentUsd ?? record.usage_usd)
  if (spent !== undefined) usage.push({ label: 'Spent this period', value: `$${spent.toFixed(2)}` })
  const requests = num(record.requests ?? record.request_count)
  if (requests !== undefined) usage.push({ label: 'Requests', value: String(requests) })
  const seats = num(record.seats ?? record.seat_count)
  if (seats !== undefined) usage.push({ label: 'Seats', value: String(seats) })

  return { balanceUsd, usage }
}
