/**
 * The matcher, held to what a reader actually types.
 *
 * Every case here is a query someone ran against the live palette and got the
 * wrong answer to. A substring filter passes none of the last four.
 *
 *   node --test search.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { score, search } from './dist/search.js'

/**
 * The shape the palette indexes — including the HREF, which is load-bearing.
 * "Documentation" is what the link says and "docs" is what a reader types; the
 * two meet in `docs.hanzo.ai` and nowhere else, so a matcher that ignores the
 * URL cannot answer that query however clever it is.
 */
const INDEX = [
  {
    title: 'Pricing',
    hint: 'Plans and per-token rates',
    group: 'Pages',
    href: '/pricing',
  },
  { title: 'Vector', hint: 'Embeddings and retrieval', group: 'Data', href: '/vector' },
  {
    title: 'Embeddings',
    hint: 'Turn anything into vectors',
    group: 'AI',
    href: '/embeddings',
  },
  {
    title: 'Hanzo Chat',
    hint: 'Ask anything',
    group: 'Open',
    href: 'https://hanzo.chat',
  },
  { title: 'Hanzo CLI', hint: 'Code from a terminal', group: 'Install', href: '/cli' },
  { title: 'Machines', hint: 'VMs by the second', group: 'Compute', href: '/machines' },
  { title: 'GPUs', hint: 'On-demand accelerators', group: 'Compute', href: '/gpus' },
  {
    title: 'Documentation',
    hint: 'Guides and reference',
    group: 'Pages',
    href: 'https://docs.hanzo.ai',
  },
]

const find = (q) => search(INDEX, q, (e) => [e.title, e.hint, e.group, e.href])
const titles = (q) => find(q).map((e) => e.title)

test('an empty query is the identity, in input order', () => {
  assert.deepEqual(
    titles(''),
    INDEX.map((e) => e.title)
  )
})

test('a page the site publishes is findable', () => {
  // The whole defect: a products-only index answered "no results" here.
  assert.equal(titles('pricing')[0], 'Pricing')
  assert.equal(titles('docs')[0], 'Documentation')
})

test('the exact name ranks first, not merely somewhere', () => {
  // "Vector" is named; "Embeddings" only mentions vectors in its description.
  assert.equal(titles('vector')[0], 'Vector')
  assert.equal(titles('embeddings')[0], 'Embeddings')
})

test('a dropped letter still finds the word', () => {
  assert.equal(titles('vctor')[0], 'Vector')
  assert.equal(titles('machins')[0], 'Machines')
})

test('two words match across two fields', () => {
  // Nothing holds "vector search" as a substring anywhere.
  assert.equal(titles('vector retrieval')[0], 'Vector')
  assert.equal(titles('chat ask')[0], 'Hanzo Chat')
})

test('a word in the name beats the same word in a description', () => {
  const ranked = titles('vectors')
  assert.ok(
    ranked.indexOf('Vector') < ranked.indexOf('Embeddings'),
    `name should outrank description, got ${ranked.join(' > ')}`
  )
})

test('the shorter of two equal matches wins', () => {
  // Both start with "Hanzo "; neither query distinguishes further.
  const m = (t) => score('hanzo', t).score
  assert.ok(m('Hanzo CLI') > m('Hanzo Chat Enterprise Edition'))
})

test('a query nothing answers is refused, not ranked low', () => {
  assert.equal(score('zzzz', 'Pricing', 'Plans'), null)
  assert.deepEqual(titles('qqqq'), [])
})

test('the hits point at the characters that matched, for highlighting', () => {
  const m = score('vec', 'Vector')
  assert.deepEqual(m.hits, [0, 1, 2])
  const scattered = score('vctr', 'Vector')
  assert.deepEqual(scattered.hits, [0, 2, 3, 5])
})

test('case never matters', () => {
  assert.equal(titles('GPUS')[0], 'GPUs')
  assert.equal(titles('gpus')[0], 'GPUs')
})

test('a subsequence through PROSE is not a result', () => {
  // "docs" walks d·o·c·s through "…and prote(c)t every (s)ervice" and through
  // most other sentences too. A description is matched whole or not at all.
  const noise = {
    title: 'Network',
    hint: 'Connect, route, and protect every service',
    group: 'Products',
    href: '/network',
  }
  assert.equal(score('docs', noise.title, noise.hint, noise.group, noise.href), null)
  assert.equal(score('chat', 'Web3', 'On-chain infrastructure for the cloud'), null)
})

test('a scattered match must start where a word does', () => {
  // "enso" is a subsequence of "Op(en) (So)urce" starting mid-word. That is a
  // coincidence, not a typo, and the anchor is what tells them apart.
  assert.equal(score('enso', 'Open Source'), null)
  assert.ok(score('enso', 'Enso'))
  assert.ok(score('vctor', 'Vector'), 'a typo still anchors at the first letter')
})

test('a single letter never matches loosely', () => {
  // One character has no shape to match on; only a real occurrence counts.
  assert.equal(score('z', 'Vector'), null)
  assert.ok(score('v', 'Vector'))
})
