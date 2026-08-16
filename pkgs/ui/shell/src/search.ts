/**
 * Ranked fuzzy match — the ONE thing in the shell that decides whether a query
 * answers a record, and how well.
 *
 * Every palette, menu and filter in this package narrows through `score`. A
 * substring test is the obvious alternative and it is wrong in three ways a
 * reader meets immediately: "vctor" (a dropped letter) finds nothing, "vector
 * search" finds nothing because no single field holds that exact string, and
 * ten hits come back in taxonomy order with the best one somewhere in the
 * middle. Ranking is the whole feature — a palette that cannot put the right
 * row first is a list, not a search.
 *
 * Three rules, in the order they pay:
 *
 *   1. A CONTIGUOUS run beats a scattered one. Typing "chat" should land on
 *      Chat, not on "Cross-region high availability trees".
 *   2. A match at the START of a word beats one in the middle, and the start of
 *      the whole string beats both.
 *   3. The TITLE outranks everything else the record carries. A word found in a
 *      one-line description is evidence; a word found in the name is the answer.
 *
 * Multi-word queries are AND: every token must find a home somewhere on the
 * record, though not in the same field. That is what lets "vector search" reach
 * a product named Vector whose description says retrieval.
 */

/** What separates one word from the next — the boundary rule 2 rewards. */
const SEP = /[\s\-_/.:,()[\]]/

/** A record's answer to a query: how well it answers, and where it matched. */
export interface Match {
  /** Higher is better. Comparable only within one query. */
  score: number
  /** Indices into the TITLE that the query hit, for highlighting. */
  hits: number[]
}

/** Whether position `i` in `hay` begins a word. */
const starts = (hay: string, i: number) => i === 0 || SEP.test(hay[i - 1]!)

/**
 * Where one token landed in one field, or nothing.
 *
 * `fuzzy` is what separates a NAME from PROSE. Walking a token's letters
 * through a name is how a typo still finds its product; walking them through a
 * sentence finds a hit in almost every sentence — "docs" is a subsequence of
 * "Connect, route, and prote(c)t every (s)ervice", and a search that answers
 * that is a search nobody trusts. So descriptions are matched whole or not at
 * all, and only names are forgiving.
 */
function scoreField(token: string, hay: string, fuzzy: boolean): Match | null {
  if (!hay) return null

  // Rule 1 and 2, together: a contiguous run scores far above any scattered
  // one, and where it starts is what separates the good runs from each other.
  const at = hay.indexOf(token)
  if (at >= 0) {
    const boundary = at === 0 ? 40 : SEP.test(hay[at - 1]!) ? 24 : 0
    const covers = (token.length / hay.length) * 20
    const hits: number[] = []
    for (let i = 0; i < token.length; i++) hits.push(at + i)
    return { score: 90 + boundary + covers - Math.min(at, 24) * 0.5, hits }
  }
  if (!fuzzy || token.length < 2) return null

  // Scattered: every character of the token in order, ANCHORED AT A WORD.
  // "vctor" walks v·c·t·o·r through "Vector" from its first letter, which is a
  // typo; "enso" walks e·n·s·o through "Op(en) (So)urce" from the middle of a
  // word, which is a coincidence. The anchor is the whole difference, and it
  // costs one comparison.
  const first = hay.indexOf(token[0]!)
  if (first < 0 || !starts(hay, first)) return null

  let score = 28
  let from = first + 1
  let prev = first
  const hits: number[] = [first]
  for (let i = 1; i < token.length; i++) {
    const found = hay.indexOf(token[i]!, from)
    if (found < 0) return null
    if (found === prev + 1) score += 8
    else if (starts(hay, found)) score += 6
    else score -= Math.min(found - prev - 1, 4)
    hits.push(found)
    prev = found
    from = found + 1
  }
  return { score, hits }
}

/**
 * How well `query` answers a record.
 *
 * `title` is the name; `extra` is every other string the record can be found by
 * — a description, keywords, the href. They are scored at a discount rather
 * than ignored, because a visitor who does not know a product's name knows what
 * it does. Returns `null` when any token has no home at all, which is the whole
 * of "this record is not a result".
 *
 * An empty query answers every record at zero, so a caller can rank
 * unconditionally and let the input order stand.
 */
export function score(
  query: string,
  title: string,
  ...extra: (string | undefined | null)[]
): Match | null {
  const tokens = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (tokens.length === 0) return { score: 0, hits: [] }

  const name = title.toLowerCase()
  const rest = extra.filter(Boolean).map((s) => s!.toLowerCase())

  let total = 0
  const hits: number[] = []
  for (const token of tokens) {
    const onName = scoreField(token, name, true)
    let best = onName ? onName.score : -Infinity
    for (const field of rest) {
      const m = scoreField(token, field, false)
      // The discount is rule 3. It has to be large enough that a title's
      // scattered match still beats a description's contiguous one.
      if (m && m.score * 0.45 > best) best = m.score * 0.45
    }
    if (best === -Infinity) return null
    total += best
    if (onName) hits.push(...onName.hits)
  }

  // A short name that matched is a better answer than a long one that matched
  // the same way — "Chat" over "Chat completions streaming".
  return {
    score: total - name.length * 0.08,
    hits: [...new Set(hits)].sort((a, b) => a - b),
  }
}

/**
 * Rank `records` against `query`, best first, dropping what does not answer.
 *
 * Ties keep input order, so a taxonomy's own ordering survives wherever the
 * query does not distinguish — including the empty query, which returns
 * everything untouched.
 */
export function search<T>(
  records: readonly T[],
  query: string,
  fields: (record: T) => [title: string, ...extra: (string | undefined | null)[]]
): (T & { match: Match })[] {
  const out: { record: T; match: Match; at: number }[] = []
  records.forEach((record, at) => {
    const [title, ...extra] = fields(record)
    const match = score(query, title, ...extra)
    if (match) out.push({ record, match, at })
  })
  out.sort((a, b) => b.match.score - a.match.score || a.at - b.at)
  return out.map(({ record, match }) => ({ ...record, match }))
}
