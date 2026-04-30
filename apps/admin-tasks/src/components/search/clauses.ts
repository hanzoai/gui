// Helpers shared by FilterBar + the chip editors. Convert between
// the flat list of clauses the chips edit and the AST string the
// search bar reads/writes.
//
// All chips operate on `QueryClause`s (no nested conjunctions). When
// reading a query that contains OR or grouped expressions, we
// flatten everything into a list of clauses and treat them as
// AND-joined when rebuilding — losing precedence on round-trip is
// acceptable for the MVP filter bar; users who need OR keep typing
// in the search input directly.

import {
  parseSearchQuery,
  stringifyQuery,
  QueryParseError,
  type QueryClause,
  type QueryNode,
} from '../../lib/format'

export function clausesFromQuery(input: string): QueryClause[] {
  if (!input.trim()) return []
  let ast: QueryNode | null
  try {
    ast = parseSearchQuery(input)
  } catch (e) {
    if (e instanceof QueryParseError) return []
    throw e
  }
  if (!ast) return []
  const out: QueryClause[] = []
  flatten(ast, out)
  return out
}

export function clausesToQuery(clauses: QueryClause[]): string {
  if (clauses.length === 0) return ''
  let node: QueryNode = clauses[0]
  for (let i = 1; i < clauses.length; i++) {
    node = { type: 'conjunction', logic: 'AND', left: node, right: clauses[i] }
  }
  return stringifyQuery(node)
}

// Append or replace a clause, keyed by its `field` (case-sensitive).
// Multiple clauses on the same field can coexist (e.g. StartTime
// >=, StartTime <=) — pass a custom matcher to disambiguate.
export function setClause(
  clauses: QueryClause[],
  next: QueryClause,
  matches: (c: QueryClause) => boolean = (c) => c.field === next.field,
): QueryClause[] {
  const without = clauses.filter((c) => !matches(c))
  return [...without, next]
}

export function removeClauses(
  clauses: QueryClause[],
  matches: (c: QueryClause) => boolean,
): QueryClause[] {
  return clauses.filter((c) => !matches(c))
}

function flatten(node: QueryNode, out: QueryClause[]) {
  if (node.type === 'clause') {
    out.push(node)
    return
  }
  flatten(node.left, out)
  flatten(node.right, out)
}
