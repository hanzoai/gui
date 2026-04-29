import { describe, it, expect } from 'vitest'
import { detectSdk, parseStackTrace, parseEnhancedStackTrace } from '../stack-trace'

const GO_PANIC = `goroutine 1 [running]:
runtime.gopark(0x4f8260, 0xc00001a0c0, 0x10, 0x14, 0x1)
\t/usr/local/go/src/runtime/proc.go:307 +0x12a
go.temporal.io/sdk/internal.(*workflowEnvironmentImpl).executeActivity(0xc0001a4000)
\t/home/build/sdk/internal/internal_event_handlers.go:512 +0x6f
main.MyWorkflow(0xc0000a8000, 0x4d8920)
\t/app/workflow.go:42 +0x1a
`

const GO_TWO_GOROUTINES = `goroutine 1 [running]:
main.run(0xc000)
\t/app/main.go:10 +0x1

goroutine 17 [select]:
main.helper(0xc000)
\t/app/helper.go:88 +0xab
`

const TS_STACK = `Error
    at MyWorkflow (/app/dist/workflow.ts:12:9)
    at runWorkflow (/app/node_modules/sdk/runtime.ts:301:18)
`

const TS_SINGLE_FRAME = `    at start (/app/dist/index.ts:5:3)`

describe('detectSdk', () => {
  it('flags go from .go: tokens', () => {
    expect(detectSdk(GO_PANIC)).toBe('go')
  })
  it('flags typescript from .ts: tokens', () => {
    expect(detectSdk(TS_STACK)).toBe('typescript')
  })
  it('returns unknown for empty/garbage input', () => {
    expect(detectSdk('')).toBe('unknown')
    expect(detectSdk('lorem ipsum no frames')).toBe('unknown')
  })
})

describe('parseStackTrace', () => {
  it('parses a multi-frame Go panic into one stack', () => {
    const r = parseStackTrace(GO_PANIC)
    expect(r.sdk).toBe('go')
    expect(r.stacks).toHaveLength(1)
    expect(r.stacks[0].header).toBe('goroutine 1 [running]:')
    expect(r.stacks[0].frames).toHaveLength(3)
    const last = r.stacks[0].frames[2]
    expect(last.filePath).toBe('/app/workflow.go')
    expect(last.line).toBe(42)
    expect(last.functionName).toBe('main.MyWorkflow(0xc0000a8000, 0x4d8920)')
  })

  it('splits multi-goroutine dump on blank lines', () => {
    const r = parseStackTrace(GO_TWO_GOROUTINES)
    expect(r.stacks).toHaveLength(2)
    expect(r.stacks[0].header).toBe('goroutine 1 [running]:')
    expect(r.stacks[1].header).toBe('goroutine 17 [select]:')
    expect(r.stacks[1].frames[0].filePath).toBe('/app/helper.go')
    expect(r.stacks[1].frames[0].line).toBe(88)
  })

  it('parses TypeScript "at fn (file:line:col)" frames', () => {
    const r = parseStackTrace(TS_STACK)
    expect(r.sdk).toBe('typescript')
    expect(r.stacks).toHaveLength(1)
    expect(r.stacks[0].header).toBe('Error')
    expect(r.stacks[0].frames).toHaveLength(2)
    const f = r.stacks[0].frames[0]
    expect(f.functionName).toBe('MyWorkflow')
    expect(f.filePath).toBe('/app/dist/workflow.ts')
    expect(f.line).toBe(12)
    expect(f.column).toBe(9)
  })

  it('treats a lone TypeScript frame as a frame, not a header', () => {
    const r = parseStackTrace(TS_SINGLE_FRAME)
    expect(r.stacks).toHaveLength(1)
    expect(r.stacks[0].header).toBe('')
    expect(r.stacks[0].frames).toHaveLength(1)
    expect(r.stacks[0].frames[0].filePath).toBe('/app/dist/index.ts')
  })

  it('handles empty input without throwing', () => {
    expect(parseStackTrace('').stacks).toHaveLength(0)
    expect(parseStackTrace('   \n  \n').stacks).toHaveLength(0)
  })

  it('preserves raw line text on frames it cannot decode', () => {
    const r = parseStackTrace('something weird here\nmore weirdness')
    expect(r.stacks).toHaveLength(1)
    expect(r.stacks[0].frames.every((f) => f.raw.length > 0)).toBe(true)
  })
})

describe('parseEnhancedStackTrace', () => {
  it('reads the JSON envelope with snake_case keys', () => {
    const json = JSON.stringify({
      sdk: 'go',
      stacks: [
        {
          name: 'goroutine 1',
          frames: [
            { file_path: '/app/wf.go', line: 10, function_name: 'main.Run' },
          ],
        },
      ],
    })
    const r = parseEnhancedStackTrace(json)
    expect(r.sdk).toBe('go')
    expect(r.stacks).toHaveLength(1)
    expect(r.stacks[0].name).toBe('goroutine 1')
    expect(r.stacks[0].frames[0].filePath).toBe('/app/wf.go')
    expect(r.stacks[0].frames[0].functionName).toBe('main.Run')
  })

  it('returns an empty parse for invalid JSON', () => {
    const r = parseEnhancedStackTrace('not json')
    expect(r.sdk).toBe('unknown')
    expect(r.stacks).toHaveLength(0)
  })
})
