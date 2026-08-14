/**
 * Product search — the taxonomy, narrowed, for a surface that renders it as
 * CATEGORIES rather than as a ranked list.
 *
 * The predicate itself is `score` in search.ts, so this and the command palette
 * cannot disagree about whether a query answers a leaf. What differs is only
 * the shape handed back: a mega-menu keeps its columns, a palette gets one
 * ordered list.
 */
import { type ProductCategory } from './hanzo-registry'
import { score } from './search'

/**
 * Narrow the taxonomy to what matches `query`.
 *
 * A category survives if its OWN name matches — then it keeps all its leaves,
 * because searching "network" should show the Network category whole — or if
 * any leaf matches, then it keeps just those, ranked. An empty query is the
 * identity, so callers can render the result unconditionally.
 *
 * Leaves match on label, `hint` and href, and on NOTHING structural. A menu may
 * not decide that a leaf pointing somewhere particular is not a product: doing
 * so hides real products whose page happens to be the category's own.
 */
export function filterProducts(
  categories: ProductCategory[],
  query: string
): ProductCategory[] {
  if (!query.trim()) return categories

  const out: ProductCategory[] = []
  for (const category of categories) {
    if (score(query, category.label, category.tagline)) {
      out.push(category)
      continue
    }
    const hits = category.items
      .map((item) => ({ item, m: score(query, item.label, item.hint, item.href) }))
      .filter((r) => r.m)
      .sort((a, b) => b.m!.score - a.m!.score)
      .map((r) => r.item)
    if (hits.length > 0) out.push({ ...category, items: hits })
  }
  return out
}
