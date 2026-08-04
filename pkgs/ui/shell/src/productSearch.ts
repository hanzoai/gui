/**
 * Product search — the ONE predicate every surface that searches the cloud
 * taxonomy runs.
 *
 * The taxonomy is ~97 primitives across ten categories, too many to scan, so the
 * command palette narrows it with this. It is a pure function kept apart from
 * any field or panel precisely so a second surface that ever needs to search
 * products composes it rather than re-deriving it: two predicates that both
 * claim to answer the same query is the one thing a search must never ship.
 */
import { type ProductCategory } from './hanzo-registry'

/**
 * Narrow the taxonomy to what matches `query`.
 *
 * A category survives if its OWN name matches (then it keeps all its leaves —
 * searching "network" should show the Network category whole) or if any leaf
 * matches (then it keeps just those). An empty query is the identity, so callers
 * can render the result unconditionally.
 *
 * Leaves are matched on label and `hint`, and on NOTHING structural. An earlier
 * version dropped "the leaf pointing at the category's own href", meaning to
 * drop the appended "All N →" row; hanzo.ai's AI category has a real product
 * (Rerank) pointing there too because it has no page yet, so that rule silently
 * hid a product from search. A menu may not decide a leaf is not a product.
 */
export function filterProducts(
  categories: ProductCategory[],
  query: string
): ProductCategory[] {
  const q = query.trim().toLowerCase()
  if (!q) return categories

  const out: ProductCategory[] = []
  for (const category of categories) {
    if (category.label.toLowerCase().includes(q)) {
      out.push(category)
      continue
    }
    const hits = category.items.filter(
      (item) =>
        item.label.toLowerCase().includes(q) || !!item.hint?.toLowerCase().includes(q)
    )
    if (hits.length > 0) out.push({ ...category, items: hits })
  }
  return out
}
