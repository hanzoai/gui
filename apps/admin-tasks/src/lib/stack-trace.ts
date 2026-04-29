// Pure parser for worker SDK __stack_trace and __enhanced_stack_trace
// query responses. No React, no DOM, no I/O — fixture-tested.
//
// Two shapes on the wire:
//   1. __stack_trace: free-form text. Goroutines or JS frames separated
//      by blank lines. Each block has a header line and one+ frame
//      lines (Go: "path.go:42 +0x12"; JS: "at fn (file.ts:1:2)").
//   2. __enhanced_stack_trace: JSON. { sdk: 'go'|'typescript'|'java',
//      stacks: [{ name, frames: [{ file_path, line, column, function_name }] }] }
//      (upstream's shape; we accept both snake and camel case).

// ── payload decoder ───────────────────────────────────────────────
// Worker query results come back as a Payload (or array of Payloads):
//   { metadata: { encoding: 'json/plain' }, data: <base64 utf-8 bytes> }
// Some servers already inline the decoded string. We accept all four
// shapes and always return a string (empty if undecodable).

interface MaybePayload {
  metadata?: Record<string, string>
  data?: string
}
interface MaybePayloads {
  payloads?: MaybePayload[]
}

function b64DecodeUtf8(b64: string): string {
  try {
    const bin = atob(b64)
    const bytes = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
    return new TextDecoder().decode(bytes)
  } catch {
    return b64
  }
}

export function decodePayloadAsString(value: unknown): string {
  if (value == null) return ''
  if (typeof value === 'string') return value
  // Single Payload
  const p = value as MaybePayload
  if (typeof p.data === 'string') {
    const decoded = b64DecodeUtf8(p.data)
    // json/plain: the bytes are themselves a JSON string. Unwrap if so.
    const enc = p.metadata?.encoding
    if (enc === 'json/plain') {
      try {
        const parsed = JSON.parse(decoded)
        return typeof parsed === 'string' ? parsed : decoded
      } catch {
        return decoded
      }
    }
    return decoded
  }
  // { payloads: [Payload] }
  const wrap = value as MaybePayloads
  if (Array.isArray(wrap.payloads) && wrap.payloads.length > 0) {
    return decodePayloadAsString(wrap.payloads[0])
  }
  // Array of Payloads
  if (Array.isArray(value) && value.length > 0) {
    return decodePayloadAsString(value[0])
  }
  return ''
}

export type SdkOrigin = 'go' | 'typescript' | 'java' | 'unknown'

export interface StackFrame {
  filePath?: string
  line?: number
  column?: number
  functionName?: string
  // The raw source line, preserved so the UI can render it verbatim
  // when our extractor missed a token.
  raw: string
}

export interface ParsedStack {
  // Header text — for Go this is "goroutine N [state]:", for JS it's
  // "Error" or the worker name. Empty string when there is no header.
  header: string
  frames: StackFrame[]
}

export interface ParsedStackTrace {
  sdk: SdkOrigin
  stacks: ParsedStack[]
  raw: string
}

export interface EnhancedFrame {
  filePath?: string
  line?: number
  column?: number
  functionName?: string
}

export interface EnhancedStack {
  name: string
  frames: EnhancedFrame[]
}

export interface ParsedEnhancedStackTrace {
  sdk: SdkOrigin
  stacks: EnhancedStack[]
}

// ── sdk detection ─────────────────────────────────────────────────

export function detectSdk(text: string): SdkOrigin {
  if (/\.go:\d/.test(text)) return 'go'
  if (/\.ts:\d/.test(text) || /\.js:\d/.test(text)) return 'typescript'
  if (/\bat [\w$.]+\([^)]+\.java:\d/.test(text)) return 'java'
  return 'unknown'
}

// ── plain-text parser ─────────────────────────────────────────────

const GO_FRAME = /^([^\s].+?\.go):(\d+)(?:\s+\+0x[0-9a-f]+)?$/
const JS_FRAME = /^\s*at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)\s*$/
const JS_BARE_FRAME = /^\s*at\s+(.+?):(\d+):(\d+)\s*$/

function parseFrame(line: string): StackFrame {
  const js = JS_FRAME.exec(line)
  if (js) {
    return {
      functionName: js[1],
      filePath: js[2],
      line: Number(js[3]),
      column: Number(js[4]),
      raw: line,
    }
  }
  const jsBare = JS_BARE_FRAME.exec(line)
  if (jsBare) {
    return {
      filePath: jsBare[1],
      line: Number(jsBare[2]),
      column: Number(jsBare[3]),
      raw: line,
    }
  }
  const go = GO_FRAME.exec(line.trim())
  if (go) {
    return { filePath: go[1], line: Number(go[2]), raw: line }
  }
  return { raw: line }
}

// Go stacks come as alternating header/file pairs:
//   github.com/x/y.Fn(0xc000)
//       /path/to/file.go:42 +0x1a
// We collapse the two-line idiom into one frame whose functionName is
// the upper line and filePath is the lower line.
function collapseGoFrames(lines: string[]): StackFrame[] {
  const out: StackFrame[] = []
  for (let i = 0; i < lines.length; i++) {
    const cur = lines[i]
    const next = lines[i + 1]
    if (next && /\.go:\d/.test(next) && !/\.go:\d/.test(cur)) {
      const f = parseFrame(next)
      f.functionName = cur.trim()
      f.raw = `${cur}\n${next}`
      out.push(f)
      i++
      continue
    }
    out.push(parseFrame(cur))
  }
  return out
}

export function parseStackTrace(text: string): ParsedStackTrace {
  const sdk = detectSdk(text)
  const trimmed = text.replace(/\r\n/g, '\n').trim()
  if (trimmed === '') return { sdk, stacks: [], raw: text }

  // Split on blank lines — each block is one goroutine / call stack.
  const blocks = trimmed.split(/\n\s*\n/)
  const stacks: ParsedStack[] = blocks.map((block) => {
    const lines = block.split('\n').filter((l) => l.trim() !== '')
    if (lines.length === 0) return { header: '', frames: [] }

    // A header line is one that is *not* a frame on its own.
    const first = lines[0]
    const firstIsFrame =
      JS_FRAME.test(first) || JS_BARE_FRAME.test(first) || GO_FRAME.test(first.trim())
    let header = ''
    let frameLines = lines
    if (!firstIsFrame) {
      header = first.trim()
      frameLines = lines.slice(1)
    }
    const frames = sdk === 'go' ? collapseGoFrames(frameLines) : frameLines.map(parseFrame)
    return { header, frames }
  })

  return { sdk, stacks, raw: text }
}

// ── enhanced (JSON) parser ────────────────────────────────────────

interface RawEnhancedFrame {
  file_path?: string
  filePath?: string
  line?: number
  column?: number
  function_name?: string
  functionName?: string
}

interface RawEnhancedStack {
  name?: string
  frames?: RawEnhancedFrame[]
}

interface RawEnhancedStackTrace {
  sdk?: string
  stacks?: RawEnhancedStack[]
}

function normalizeSdk(s: string | undefined): SdkOrigin {
  if (s === 'go' || s === 'typescript' || s === 'java') return s
  return 'unknown'
}

export function parseEnhancedStackTrace(input: string | unknown): ParsedEnhancedStackTrace {
  let raw: RawEnhancedStackTrace
  if (typeof input === 'string') {
    try {
      raw = JSON.parse(input) as RawEnhancedStackTrace
    } catch {
      return { sdk: 'unknown', stacks: [] }
    }
  } else if (input && typeof input === 'object') {
    raw = input as RawEnhancedStackTrace
  } else {
    return { sdk: 'unknown', stacks: [] }
  }

  const stacks: EnhancedStack[] = (raw.stacks ?? []).map((s) => ({
    name: s.name ?? '',
    frames: (s.frames ?? []).map((f) => ({
      filePath: f.file_path ?? f.filePath,
      line: f.line,
      column: f.column,
      functionName: f.function_name ?? f.functionName,
    })),
  }))
  return { sdk: normalizeSdk(raw.sdk), stacks }
}
