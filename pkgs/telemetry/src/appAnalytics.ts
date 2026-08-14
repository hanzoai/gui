// Is the APP already emitting?
//
// `GuiProvider` mounts telemetry for every gui app, so it has to be able to tell
// a bare app (nobody is emitting — collect) from a wired one (the app owns the
// stream — stay out of the way). Two different owners can look like this:
//
//   1. an `@hanzo/event` <AnalyticsProvider> ABOVE us — a React context read
//      answers that, and it covers <TelemetryProvider> too, because that
//      provider renders an <AnalyticsProvider> of its own.
//   2. a <TelemetryProvider> BELOW us — context cannot look down, so ownership
//      of the ambient slot answers that one (see telemetry.ts).
//
// This module is the ONE place that resolves @hanzo/event's context object. The
// package publishes it as `ErrorBoundary.contextType` — React's own public
// handle for a class that reads a context — so everything else here asks
// `useAppAnalytics()` and never repeats the lookup.

import { useContext, type Context } from 'react'
import { ErrorBoundary } from '@hanzo/event/react'
import type { Analytics } from '@hanzo/event'

const AnalyticsContext = ErrorBoundary.contextType as Context<Analytics | null>

/** The app's own client when an `<AnalyticsProvider>` (or a `<TelemetryProvider>`,
 *  which contains one) is an ancestor; null when nothing above is emitting. */
export function useAppAnalytics(): Analytics | null {
  return useContext(AnalyticsContext)
}
