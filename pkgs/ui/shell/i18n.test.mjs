/**
 * Every word the shell draws can be read in the reader's language.
 *
 * The shell renders on every Hanzo property, so a sentence it draws as bare
 * English is English on every page of every locale, whatever the host
 * translated around it. Copy reaches the screen through @hanzo/i18n's `t()`;
 * copy written as data (the registry, a row table) is marked with `phrase()`
 * where it is written and drawn through `t()` where it renders.
 *
 * This reads the source the way the extractor does and fails on copy that
 * skips both: text between tags, a string or template in an attribute a reader
 * sees or hears, a string in a JSX expression outside any call, and a data
 * label left unmarked. A product's name standing alone is not copy.
 *
 *   node --test i18n.test.mjs
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseSync } from 'oxc-parser'

const SRC = join(dirname(fileURLToPath(import.meta.url)), 'src')
const files = readdirSync(SRC).filter((f) => /\.tsx?$/.test(f))

/** Attributes whose value a reader sees or hears. */
const SAID = new Set([
  'aria-label',
  'title',
  'placeholder',
  'alt',
  'label',
  'hint',
  'description',
  'caption',
  'greeting',
])

/** Data fields that hold copy. */
const COPY = new Set(['label', 'hint', 'tagline', 'title', 'heading', 'description'])

/** Read the same in every language: names, and what a keyboard prints. */
const SAME = new Set([
  // a key cap
  'ESC',
  '⌘K',
  // the company and its products, standing alone
  'Hanzo',
  'Hanzo Chat',
  'Hanzo App',
  'Hanzo Base',
  'Hanzo Dev',
  'Hanzo IDE',
  'Hanzo CLI',
  'Hanzo Platform',
  'Hanzo Bot',
  'Hanzo Studio',
  'Enso',
  'Base',
  'Chat',
  'App',
  'Team',
  'Bot',
  'Studio',
  'Cloud',
  'Dev',
  'World',
  'Console',
  'GitHub',
  // an initialism or a technology's own name
  'AI',
  'API',
  'CLI',
  'IDE',
  'MCP',
  'SDKs',
  'GPUs',
  'SQL',
  'KV',
  'DocDB',
  'VPC',
  'DNS',
  'CDN',
  'IAM',
  'Authz',
  'KMS',
  'HSM',
  'Web3',
  // a host name
  'hanzo.ai →',
])

const worded = (s) => /\p{L}/u.test(s) && !SAME.has(s.trim())

/** Calls each node with its parent chain, root first. */
function walk(node, visit, chain = []) {
  if (Array.isArray(node)) {
    for (const n of node) walk(n, visit, chain)
    return
  }
  if (!node || typeof node.type !== 'string') return
  visit(node, chain)
  const next = [...chain, node]
  for (const key in node) {
    if (key === 'type') continue
    const v = node[key]
    if (v && typeof v === 'object') walk(v, visit, next)
  }
}

/**
 * What an expression can evaluate to and draw: its strings outside any call.
 * Nested markup is read on its own visit, and a style object, a callback or a
 * comparison is never drawn.
 */
const ASIDE = new Set([
  'CallExpression',
  'JSXElement',
  'JSXFragment',
  'ObjectExpression',
  'ArrowFunctionExpression',
  'FunctionExpression',
  'BinaryExpression',
  'MemberExpression',
])

function bare(expression) {
  const found = []
  walk(expression, (n, chain) => {
    if (chain.some((c) => ASIDE.has(c.type))) return
    if (n.type === 'Literal' && typeof n.value === 'string' && worded(n.value))
      found.push(n.value)
    if (n.type === 'TemplateLiteral') {
      const words = n.quasis.map((q) => q.value.cooked).join('')
      if (worded(words)) found.push(words)
    }
  })
  return found
}

function offences(file) {
  const src = readFileSync(join(SRC, file), 'utf8')
  const { program, errors } = parseSync(file, src)
  assert.equal(errors.length, 0, `${file} parses`)
  const line = (n) => src.slice(0, n.start).split('\n').length
  const out = []
  walk(program, (n, chain) => {
    const parent = chain[chain.length - 1]
    if (n.type === 'JSXText' && worded(n.value)) {
      out.push(`${file}:${line(n)}  text "${n.value.trim()}"`)
    }
    if (n.type === 'JSXAttribute' && SAID.has(n.name?.name) && n.value) {
      const words =
        n.value.type === 'Literal'
          ? worded(String(n.value.value))
            ? [n.value.value]
            : []
          : bare(n.value)
      for (const w of words) out.push(`${file}:${line(n)}  ${n.name.name}="${w}"`)
    }
    if (
      n.type === 'JSXExpressionContainer' &&
      parent?.type !== 'JSXAttribute' &&
      chain.some((c) => c.type === 'JSXElement' || c.type === 'JSXFragment')
    ) {
      for (const w of bare(n.expression)) out.push(`${file}:${line(n)}  {"${w}"}`)
    }
    if (
      n.type === 'Property' &&
      !n.computed &&
      COPY.has(n.key?.name) &&
      n.value?.type === 'Literal' &&
      typeof n.value.value === 'string' &&
      worded(n.value.value)
    ) {
      out.push(`${file}:${line(n)}  ${n.key.name}: '${n.value.value}' (unmarked)`)
    }
  })
  return out
}

test('no copy reaches the screen without @hanzo/i18n', () => {
  assert.deepEqual(files.flatMap(offences), [])
})

test('the registry marks its copy where it is written', () => {
  // The data the menus, the footer and the palette draw. A tagline left
  // unmarked is one the extractor never sees, so no catalog ever holds it.
  for (const file of ['hanzo-registry.ts', 'hanzo-apps.tsx']) {
    const src = readFileSync(join(SRC, file), 'utf8')
    assert.match(
      src,
      /import \{ phrase \} from '@hanzo\/i18n'/,
      `${file} marks with phrase`
    )
  }
})

test('the frame and its pieces draw through the reader’s t', () => {
  // A helper that cannot call a hook takes `t` or hands back a marked source;
  // it never builds a sentence by concatenation.
  const frame = readFileSync(join(SRC, 'commandPalette.tsx'), 'utf8')
  assert.match(frame, /\[phrase\('Ask AI: \{question\}'\), \{ question \}\]/)
  for (const file of ['HanzoCommandPalette.tsx', 'OrgCommandPalette.tsx']) {
    const src = readFileSync(join(SRC, file), 'utf8')
    assert.match(src, /t\(\.\.\.askLabel\(question\)\)/, `${file} translates the ask row`)
  }
})
