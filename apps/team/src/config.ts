// Where this app talks to, in one place.
//
// Defaults are production, so a plain build needs no environment at all. Each
// value is overridable because the same bundle has to run against a cloud on
// localhost: pointing it there used to mean editing three files, which is how
// one of them stays edited.
//
// `process.env` rather than `import.meta.env`: the values are read on web and
// on native, and One inlines this form for both.

/** The one endpoint. Every Hanzo surface lives under it — not a host per product. */
export const API = process.env.HANZO_API ?? 'https://api.hanzo.ai'

/** hanzo.id, the issuer. Discovery hangs off it; auth.ts asks it first. */
export const ISSUER = process.env.HANZO_ISSUER ?? 'https://hanzo.id'

/** The public client registered in IAM, `<org>-<app>`. */
export const CLIENT_ID = process.env.HANZO_CLIENT_ID ?? 'hanzo-team-native'

export const SCOPES = 'openid profile email'

/** Deep-link scheme (app.json `scheme`) the IAM redirect must whitelist. */
export const REDIRECT_SCHEME = 'hanzo-team'
