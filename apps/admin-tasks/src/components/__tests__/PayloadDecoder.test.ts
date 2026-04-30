import { describe, expect, it } from 'vitest'
import {
  utf8ToBase64,
  base64ToUtf8,
} from '../forms/PayloadInputWithEncoding'
import { decode } from '../forms/PayloadDecoder'

describe('utf8ToBase64 / base64ToUtf8', () => {
  it('round-trips ascii', () => {
    expect(base64ToUtf8(utf8ToBase64('hello'))).toBe('hello')
  })

  it('round-trips multi-byte unicode', () => {
    const s = 'café 漢字 🚀'
    expect(base64ToUtf8(utf8ToBase64(s))).toBe(s)
  })
})

describe('PayloadDecoder.decode', () => {
  it('pretty-prints json/plain payloads', () => {
    const b64 = utf8ToBase64('{"a":1,"b":2}')
    const out = decode(b64, 'json/plain')
    expect(out).toContain('"a": 1')
    expect(out).toContain('"b": 2')
  })

  it('returns raw utf-8 for unknown encodings', () => {
    const b64 = utf8ToBase64('hello world')
    expect(decode(b64, 'binary')).toBe('hello world')
  })

  it('falls back to raw text when json parse fails', () => {
    const b64 = utf8ToBase64('not json')
    expect(decode(b64, 'json/plain')).toBe('not json')
  })

  it('returns the raw input when base64 decoding fails', () => {
    expect(decode('!!! not base64 !!!', 'json/plain')).toBe('!!! not base64 !!!')
  })
})
