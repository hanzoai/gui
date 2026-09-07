import '@hanzogui/core/reset.css'
import '@hanzo/design/styles.css'
import '~/app.css'
import '~/hanzogui.generated.css'

import { bootScript } from '@hanzo/appearance/state'
import { LoadProgressBar, Slot } from 'one'
import { setupPopper } from '@hanzo/gui'
import { Providers } from '../components/Providers'

setupPopper({
  // prevents a reflow on mount
  disableRTL: true,
})

// Inlined @font-face, so the faces cost no render-blocking stylesheet. The
// files come from @hanzo/font — one variable file per family instead of a
// weight per request — and are copied into public/fonts because a self-hosted
// site has to serve them from its own origin.
//
// font-display:swap paints a fallback immediately rather than holding text
// invisible; the three files are preloaded below so that window is short.
const fontFaceCss = `
@font-face{font-family:'Zen';src:url('/fonts/Zen-Variable.woff2') format('woff2-variations');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Zen Mono';src:url('/fonts/ZenMono-Variable.woff2') format('woff2-variations');font-weight:100 900;font-style:normal;font-display:swap}
@font-face{font-family:'Zen Pixel Square';src:url('/fonts/ZenPixel-Square.woff2') format('woff2');font-weight:500;font-style:normal;font-display:swap}`

export default function Layout() {
  return (
    // Dark is the default every Hanzo surface shares. The class is here so the
    // first paint already carries gui's dark scope; SchemeProvider's own script
    // corrects it before paint for a reader who chose light.
    <html lang="en-US" className="t_dark" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5"
        />
        {/* The ground before any stylesheet lands, so no frame paints white. */}
        <style>{`html{background:#0a0a0a;color-scheme:dark}html.t_light{background:#f7f7f7;color-scheme:light}`}</style>
        {/* The reader's own type scale, density, face, measure and accent, back
            on the document before first paint. @hanzo/appearance writes them to
            storage; this is the half that reads them. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript() }} />
        {/* @hanzo/design scopes its light tokens to `html.light` and gui to
            `t_light`. One theme, two vocabularies: the second is derived from
            the first, and the observer carries a switch across. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var e=document.documentElement,was;function s(){var l=e.classList.contains('t_light');if(l===was)return;was=l;e.classList.toggle('light',l)}s();new MutationObserver(s).observe(e,{attributes:true,attributeFilter:['class']})})()`,
          }}
        />

        {/* Copied from @hanzo/logo/dist at prebuild — the mark has one home. */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="docsearch:language" content="en" />
        <meta name="docsearch:version" content="1.0.0,latest" />
        <meta id="theme-color" name="theme-color" />
        <meta name="color-scheme" content="dark light" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@hanzogui_js" />
        <meta name="twitter:creator" content="@natebirdman" />
        <meta name="robots" content="index,follow" />

        <link
          rel="preload"
          href="/fonts/ZenMono-Variable.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/Zen-Variable.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        <link
          rel="preload"
          href="/fonts/ZenPixel-Square.woff2"
          as="font"
          crossOrigin="anonymous"
          type="font/woff2"
        />
        {/* inline @font-face instead of 4 render-blocking <link> stylesheets (each
            cost a round-trip ~500ms on slow connections and blocked first paint).
            font-display: swap (was block) lets text paint immediately with a
            fallback instead of staying invisible until the font loads (FOIT) —
            this was the LCP bottleneck (3.1s element render delay). fonts are
            preloaded above so the swap window is short. */}
        <style>{fontFaceCss}</style>
      </head>

      <body>
        <LoadProgressBar />

        {/* warm cherry-bomb on first interaction so it's ready when navigating
            to the pages that use it, no eager preload */}

        <Providers>
          <Slot />
        </Providers>
      </body>
    </html>
  )
}
