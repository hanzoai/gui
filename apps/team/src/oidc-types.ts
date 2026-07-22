// The result of driving the authorize step, produced by the platform-split
// ./oidc-browser module (native uses the system browser; web redirects the page).
export type AuthOutcome =
  | { kind: 'callback'; url: string } // native: the app-scheme redirect came back
  | { kind: 'redirecting' } // web: the page navigated to hanzo.id
  | { kind: 'cancelled' } // the user dismissed the browser
