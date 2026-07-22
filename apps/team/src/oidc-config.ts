// Shared hanzo.id OIDC constants (no platform imports) so both the protocol module
// (auth.ts) and the platform-split browser modules read one source of truth.

/** The public native client registered in IAM (hanzo.id). */
export const CLIENT_ID = 'hanzo-team-native'
export const ISSUER = 'https://hanzo.id'
export const SCOPES = 'openid profile email'
/** Deep-link scheme (app.json `scheme`) the IAM redirect must whitelist. */
export const REDIRECT_SCHEME = 'hanzo-team'
