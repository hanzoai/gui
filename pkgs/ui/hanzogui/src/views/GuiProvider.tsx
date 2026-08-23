import type { GuiProviderProps as CoreGuiProviderProps } from '@hanzogui/core'
import { GuiProvider as OGProvider } from '@hanzogui/core'
import { PortalProvider } from '@hanzogui/portal'
import { TelemetryProvider, type TelemetryConfig } from '@hanzogui/telemetry'
import { ZIndexStackContext } from '@hanzogui/z-index-stack'

/** Telemetry posture for a gui app.
 *
 *  Omit it and you get telemetry: pageviews, unhandled errors, React render
 *  errors and interaction capture, POSTed to the one Hanzo endpoint
 *  (`api.hanzo.ai/v1/event`), with the product name inferred from the runtime
 *  and the publishable ingest key read from the environment. Nothing to wire,
 *  on web, on desktop and on native alike.
 *
 *  Pass an object to shape it (`product`, `ingestKey`, `host`, `consent`,
 *  `replay`, …), or `false` to mount nothing at all. */
export type GuiTelemetry = boolean | TelemetryConfig

/** An intersection, not `interface … extends`: the core props are a mapped
 *  `Omit<…> &` type, and extending that loses members (`children` among them). */
export type GuiProviderProps = CoreGuiProviderProps & {
  /** See {@link GuiTelemetry}. Defaults to on. */
  telemetry?: GuiTelemetry
}

export const GuiProvider = ({ children, telemetry, ...props }: GuiProviderProps) => {
  const tree = (
    <OGProvider {...props}>
      <ZIndexStackContext.Provider value={1}>
        <PortalProvider shouldAddRootHost>{children}</PortalProvider>
      </ZIndexStackContext.Provider>
    </OGProvider>
  )

  if (telemetry === false) return tree

  // OUTSIDE the gui tree, deliberately: the boundary inside TelemetryProvider is
  // the only thing that can observe a crash in gui's own render, and it re-throws
  // afterwards so the app's error UI still decides what the user sees.
  //
  // `owner="gui"` is what makes this safe to mount for EVERY app. It collects
  // only while nothing else is collecting: an app that mounts its own
  // <AnalyticsProvider> or <TelemetryProvider> — above this or below it, at
  // startup or on a lazy route — takes the stream, and this one goes inert. One
  // client, one stream, never two.
  return (
    <TelemetryProvider
      owner="gui"
      {...(typeof telemetry === 'object' ? telemetry : null)}
    >
      {tree}
    </TelemetryProvider>
  )
}
