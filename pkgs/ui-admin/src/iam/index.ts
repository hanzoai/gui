// IAM admin surfaces — Bucket A (identity core).
//
// TODO(i18n): all strings in this bucket are English literals. The
// upstream Casdoor uses i18next with bundled JSON locales. Wire that
// in alongside the broader admin shell language settings — until
// then, English-only ships.

export * from './identity'
export * from './federation'
export * from './resources'
export * from './system'
