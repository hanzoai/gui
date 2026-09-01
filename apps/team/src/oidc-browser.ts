// NATIVE authorize step: open hanzo.id in the system browser and read the
// `hanzo-team://callback` deep link back. Keeps the expo modules (which pull
// expo-modules-core) out of the web bundle — the web build resolves oidc-browser.web.ts.

import * as WebBrowser from 'expo-web-browser'
import * as Linking from 'expo-linking'
import { REDIRECT_SCHEME } from './config'
import type { AuthOutcome } from './oidc-types'

export function redirectUri(): string {
  return Linking.createURL('callback', { scheme: REDIRECT_SCHEME })
}

export async function authorize(url: string): Promise<AuthOutcome> {
  const result = await WebBrowser.openAuthSessionAsync(url, redirectUri())
  if (result.type !== 'success' || result.url == null) return { kind: 'cancelled' }
  return { kind: 'callback', url: result.url }
}
