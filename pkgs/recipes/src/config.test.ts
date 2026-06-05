import { test, expect, afterEach } from 'bun:test'
import { resolveBaseUrl, DEFAULT_BASE_URL } from './config.js'

const original = process.env.HANZO_BASE_URL

afterEach(() => {
  if (original === undefined) delete process.env.HANZO_BASE_URL
  else process.env.HANZO_BASE_URL = original
})

test('resolveBaseUrl returns the override when provided', () => {
  expect(resolveBaseUrl('https://x.example')).toBe('https://x.example')
})

test('resolveBaseUrl reads HANZO_BASE_URL env when no override', () => {
  process.env.HANZO_BASE_URL = 'https://env.example'
  expect(resolveBaseUrl()).toBe('https://env.example')
})

test('resolveBaseUrl falls back to DEFAULT_BASE_URL', () => {
  delete process.env.HANZO_BASE_URL
  expect(resolveBaseUrl()).toBe(DEFAULT_BASE_URL)
})

test('explicit override beats env', () => {
  process.env.HANZO_BASE_URL = 'https://env.example'
  expect(resolveBaseUrl('https://arg.example')).toBe('https://arg.example')
})
