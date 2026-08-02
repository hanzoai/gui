---
'@hanzogui/font-geist': minor
'@hanzogui/config': patch
'@hanzogui/shell': patch
---

Geist is loaded, not just named

The kit described the typeface and bound the tokens to it, but nothing ever
fetched the bytes: `geistFontFace` and `geistPreloadHrefs` had no callers, so a
page rendered in whichever fallback the stack reached. `installGeist()` is now
the one way an app installs it, and it lands the `@font-face` rules and the
`--hz-font-sans`/`--hz-font-mono` properties together — either half alone is a
page that renders in a fallback while looking correctly configured.

Both families are derived from `GEIST_SANS_FAMILY`/`GEIST_MONO_FAMILY`, so a
stack, a rule and a native face cannot name the typeface differently. The
monospace face is `Geist Mono`, which is what the bytes register; the previous
native spelling `GeistMono` resolved to nothing.

`v5-fonts` took the families from a local `GUI_TARGET` read rather than from the
package. That read is only correct once something else has set the variable, so
an unlucky module order rendered the mono face in the browser's default serif.
It now uses the families the package already resolved for the platform.

`@hanzogui/shell` reads `--hz-font-sans`, the property the kit publishes; it was
reading `--font-sans`, which nothing sets.
