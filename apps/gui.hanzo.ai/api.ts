/**
 * The API reference — every export of the packages this site documents, read
 * from the declarations those packages ship.
 *
 * A package publishes `types/*.d.ts`: the compiler's own account of what it
 * exports, emitted from the source by pkgs/build. Quoting that account rather
 * than prose is the whole point — a name, its signature and the comment above
 * it are whatever the last build wrote, so a page here cannot say something
 * the code does not.
 *
 * The walk starts at a package's `types` entry and follows every re-export to
 * the file the name is declared in, across packages of this repo, since a
 * barrel like `@hanzo/gui` declares almost nothing itself and answers for
 * fifty-odd siblings. Two things end the walk: a package this site documents
 * on its own page, which is linked rather than copied, and a package from
 * node_modules, which is somebody else's to document. Either way the specifier
 * is named, so a name that is not listed is still accounted for.
 *
 * Server only: the routes reach it through a dynamic import inside their
 * loaders, so neither the declarations nor the parser reach the browser.
 * Paths start from the working directory, which is this app whether one
 * builds or serves it.
 */
import { existsSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, join, relative } from 'node:path'
import { parseSync } from 'oxc-parser'

import { packages, route } from '~/features/docs/packages'

const need = createRequire(join(process.cwd(), 'package.json'))

/**
 * How much of one declaration a page quotes.
 *
 * The emit inlines whole structural types, so `Button` arrives as four
 * thousand characters of `Omit<GetFinalProps<...>>` and the largest here is
 * seventy thousand. Past the first screenful that is a machine talking to
 * itself, and quoting all of it would weigh a page more than the package it
 * describes. What is cut is marked, and the entry names the file that holds
 * the rest.
 */
const LIMIT = 1200

export type Kind = 'value' | 'type'

/** One export: the name it is imported by, and the declaration behind it. */
export type Entry = {
  name: string
  kind: Kind
  /** The package the declaration lives in. */
  owner: string
  /** The declaration file, relative to that package. */
  module: string
  /** The declaration itself, as the build emitted it, cut at `LIMIT`. */
  signature: string
  /** The comment above that declaration, unwrapped. */
  doc: string | null
}

/** A specifier a package re-exports from and the walk does not open. */
export type Carried = {
  from: string
  /** This site's page for it, when it has one. */
  href: string | null
  /** The names it takes, or null for a whole-module re-export. */
  names: string[] | null
}

export type Pack = {
  name: string
  version: string
  description: string | null
  /** The `types` entry the walk started at, relative to the package. */
  entry: string
  entries: Entry[]
  carries: Carried[]
}

type Home = { name: string; root: string }
type Module = { text: string; body: any[]; comments: any[] }
type Exported = { entries: Map<string, Entry>; carries: Carried[] }

/** This site's page for a package, when it has one. */
const page = (name: string): string | null =>
  packages.includes(name) ? route(name) : null

/** Where a package lives and what it declares, or null for one that ships no
 *  declarations. A path through node_modules is somebody else's package. */
function home(name: string): (Home & { entry: string }) | null {
  let manifest: string
  try {
    manifest = need.resolve(`${name}/package.json`)
  } catch {
    return null
  }
  const root = dirname(manifest)
  const types = JSON.parse(readFileSync(manifest, 'utf8')).types
  const entry = types ? join(root, types) : ''
  return entry && existsSync(entry) ? { name, root, entry } : null
}

const ours = (root: string) => !root.includes('/node_modules/')

const modules = new Map<string, Module>()

function read(file: string): Module {
  const hit = modules.get(file)
  if (hit) return hit
  const text = readFileSync(file, 'utf8')
  const { program, comments, errors } = parseSync(file, text)
  if (errors.length) throw new Error(`${file}: ${errors[0].message}`)
  const mod = { text, body: program.body, comments }
  modules.set(file, mod)
  return mod
}

/** The declaration file a relative specifier resolves to. Source names its
 *  imports with the source extension; the emit keeps the name and drops it. */
function locate(from: string, spec: string): string | null {
  const base = join(dirname(from), spec.replace(/\.[mc]?[jt]sx?$/, ''))
  return [`${base}.d.ts`, join(base, 'index.d.ts')].find(existsSync) ?? null
}

/** The doc comment immediately above a position: a block comment in the JSDoc
 *  shape with nothing but space between it and the declaration. */
function docOf(mod: Module, start: number): string | null {
  let found: any = null
  for (const c of mod.comments) {
    if (c.end > start) break
    found = c.type === 'Block' && c.value.startsWith('*') ? c : null
  }
  if (!found || mod.text.slice(found.end, start).trim() !== '') return null
  return found.value
    .replace(/^\*/, '')
    .split('\n')
    .map((line: string) => line.replace(/^\s*\* ?/, ''))
    .join('\n')
    .trim()
}

const KINDS: Record<string, Kind> = {
  FunctionDeclaration: 'value',
  TSDeclareFunction: 'value',
  VariableDeclaration: 'value',
  ClassDeclaration: 'value',
  TSEnumDeclaration: 'value',
  TSModuleDeclaration: 'value',
  TSInterfaceDeclaration: 'type',
  TSTypeAliasDeclaration: 'type',
}

/** The names a declaration introduces, and whether each is a value or a type. */
function names(node: any): { name: string; kind: Kind }[] {
  const kind = KINDS[node.type]
  if (!kind) return []
  if (node.type === 'VariableDeclaration')
    return node.declarations.flatMap((d: any) =>
      d.id?.name ? [{ name: d.id.name, kind }] : []
    )
  return node.id?.name ? [{ name: node.id.name, kind }] : []
}

const busy = new Set<string>()
const exported = new Map<string, Exported>()

/** A module answers separately for a value and a type of one name — Popover is
 *  both a component and the shape of its imperative handle — so an entry is
 *  found by the pair. */
const key = (name: string, kind: Kind) => `${name} ${kind}`
const both = (map: Map<string, Entry>, name: string) =>
  (['value', 'type'] as Kind[]).flatMap((kind) => map.get(key(name, kind)) ?? [])

/** What a declaration file exports, by the name it exports it under. */
function exportsOf(file: string, at: Home): Exported {
  const hit = exported.get(file)
  if (hit) return hit
  // A cycle asks a file for an answer it is still assembling; whoever asked
  // holds the rest of it.
  if (busy.has(file)) return { entries: new Map(), carries: [] }
  busy.add(file)

  const mod = read(file)
  const module = relative(at.root, file)
  const entries = new Map<string, Entry>()
  const carries: Carried[] = []
  const local = new Map<string, { host: any; kind: Kind }>()
  const stars: any[] = []

  const quote = (name: string, kind: Kind, host: any): Entry => {
    const was = entries.get(key(name, kind))
    const signature = mod.text.slice(host.start, host.end)
    // Overloads share a name; each declaration is one more line of one entry.
    if (was?.module === module && !was.signature.includes(signature))
      return {
        ...was,
        signature: `${was.signature}\n${signature}`,
        doc: was.doc ?? docOf(mod, host.start),
      }
    return { name, kind, owner: at.name, module, signature, doc: docOf(mod, host.start) }
  }

  const keep = (name: string, kind: Kind, host: any) =>
    entries.set(key(name, kind), quote(name, kind, host))

  /** Where a specifier leads: a file to open, or nothing, and then the
   *  specifier itself is what the page has to say about those names. */
  const follow = (spec: string): { file: string; at: Home } | null => {
    if (spec.startsWith('.')) {
      const target = locate(file, spec)
      return target ? { file: target, at } : null
    }
    if (page(spec)) return null
    const it = home(spec)
    return it && ours(it.root) ? { file: it.entry, at: it } : null
  }

  for (const node of mod.body) {
    const decl = node.type === 'ExportNamedDeclaration' ? node.declaration : node
    if (decl)
      for (const n of names(decl))
        local.set(key(n.name, n.kind), { host: node, kind: n.kind })
  }

  for (const node of mod.body) {
    if (node.type === 'ExportAllDeclaration') {
      stars.push(node)
      continue
    }
    if (node.type !== 'ExportNamedDeclaration') continue
    const asType = node.exportKind === 'type'

    if (node.declaration) {
      for (const n of names(node.declaration)) keep(n.name, n.kind, node)
      continue
    }

    if (node.source) {
      const next = follow(node.source.value)
      if (!next) {
        carries.push({
          from: node.source.value,
          href: page(node.source.value),
          names: node.specifiers.map((s: any) => s.exported.name),
        })
        continue
      }
      const sub = exportsOf(next.file, next.at)
      for (const s of node.specifiers) {
        const type = asType || s.exportKind === 'type'
        const found = both(sub.entries, s.local.name)
        if (!found.length) keep(s.exported.name, type ? 'type' : 'value', node)
        for (const was of found) {
          const kind = type ? 'type' : was.kind
          entries.set(key(s.exported.name, kind), { ...was, name: s.exported.name, kind })
        }
      }
      continue
    }

    for (const s of node.specifiers) {
      const type = asType || s.exportKind === 'type'
      const found = (['value', 'type'] as Kind[]).flatMap(
        (k) => local.get(key(s.local.name, k)) ?? []
      )
      if (!found.length) keep(s.exported.name, type ? 'type' : 'value', node)
      for (const was of found) keep(s.exported.name, type ? 'type' : was.kind, was.host)
    }
  }

  // A whole-module re-export answers for the names the file itself does not.
  for (const node of stars) {
    const next = follow(node.source.value)
    if (!next) {
      carries.push({
        from: node.source.value,
        href: page(node.source.value),
        names: null,
      })
      continue
    }
    const sub = exportsOf(next.file, next.at)
    for (const was of sub.entries.values()) {
      const kind: Kind = node.exportKind === 'type' ? 'type' : was.kind
      const k = key(was.name, kind)
      if (!entries.has(k)) entries.set(k, kind === was.kind ? was : { ...was, kind })
    }
    carries.push(...sub.carries)
  }

  const answer = { entries, carries }
  busy.delete(file)
  exported.set(file, answer)
  return answer
}

/** A quote of one declaration, cut at a boundary rather than mid-word. */
function brief(text: string): string {
  if (text.length <= LIMIT) return text
  const cut = text.lastIndexOf(' ', LIMIT)
  return `${text.slice(0, cut > LIMIT / 2 ? cut : LIMIT)} …`
}

/** One package, read from what it ships. */
export function pack(name: string): Pack {
  const at = home(name)
  if (!at) throw new Error(`${name} ships no declarations`)
  const manifest = JSON.parse(readFileSync(join(at.root, 'package.json'), 'utf8'))
  const { entries, carries } = exportsOf(at.entry, at)
  // A named re-export from a package the same file also takes whole adds no name.
  const whole = new Set(carries.filter((c) => !c.names).map((c) => c.from))
  const seen = new Set<string>()
  return {
    name,
    version: manifest.version,
    description: manifest.description ?? null,
    entry: relative(at.root, at.entry),
    entries: [...entries.values()]
      .sort((a, b) => a.name.localeCompare(b.name) || a.kind.localeCompare(b.kind))
      .map((e) => ({ ...e, signature: brief(e.signature) })),
    carries: carries.filter((c) => {
      if (c.names && whole.has(c.from)) return false
      const k = `${c.from} ${c.names?.join(' ') ?? '*'}`
      return seen.has(k) ? false : !!seen.add(k)
    }),
  }
}

/** Every package, as the index lists them. */
export function overview(): {
  name: string
  href: string
  version: string
  description: string | null
  values: number
  types: number
}[] {
  return packages.map((name) => {
    const it = pack(name)
    return {
      name,
      href: route(name),
      version: it.version,
      description: it.description,
      values: it.entries.filter((e) => e.kind === 'value').length,
      types: it.entries.filter((e) => e.kind === 'type').length,
    }
  })
}

export type Overview = ReturnType<typeof overview>
