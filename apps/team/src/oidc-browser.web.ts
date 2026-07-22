// WEB authorize step: full-page redirect to hanzo.id. The /callback route completes
// the exchange. No expo imports here, so the web bundle never pulls expo-modules-core.

import type { AuthOutcome } from './oidc-types'

export function redirectUri(): string {
  return `${globalThis.location?.origin ?? 'https://hanzo.team'}/callback`
}

export async function authorize(url: string): Promise<AuthOutcome> {
  globalThis.location?.assign(url)
  return { kind: 'redirecting' }
}
