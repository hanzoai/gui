# Fleet migration: shadcn `@hanzo/ui` → `@hanzo/gui`

The repeatable recipe for taking any Hanzo web surface OFF the shadcn/Radix+Tailwind
`@hanzo/ui` library and ONTO the canonical `@hanzo/gui` design system, so every
surface shares one look and feel. Written from increment 1 (hanzo.ai + hanzo.chat);
follow it to roll the rest of the fleet (docs sites, marketing sites, apps) mechanically.

There are **two layers**. They are independent — do them in either order, per surface.

| Layer | What | Package | Substrate | Works on |
|---|---|---|---|---|
| **Chrome** | Header, footer, hero, AI-widget mount (the shared frame) | `@hanzogui/chrome` | plain React + Tailwind + framer-motion + lucide | React 18 **and** 19 · Next **and** Vite |
| **Primitives** | Button/Input/Card/Badge/… inside pages | `@hanzo/gui` | Tamagui (styled + tokens + RN-web) | React ≥19 (Next proven; Vite via `@hanzogui/vite-plugin`) |

Why two: the cross-app chrome must run on React-18 Vite surfaces (hanzo.chat) and
React-19 static-export Next surfaces alike, so it is authored as plain React +
Tailwind — the SAME convention `@hanzogui/shell` (TenantHeader/HanzoAppBar) already
uses. The Tamagui primitive layer needs React ≥19; it is proven to render, SSR-style-
extracted with no FOUC, in a Next `output:'export'` static build (see Proof).

`@hanzogui/chrome` = PUBLIC marketing chrome. `@hanzogui/shell` = AUTHENTICATED tenant
chrome (org switcher, app launcher). Pick per surface; don't conflate.

---

## Recipe A — adopt the shared chrome (`@hanzogui/chrome`)

Exports: `HanzoNav`, `HanzoFooter`, `ChatHero`, `HanzoWidget` (+ types `NavItem`,
`NavLink`, `NavColumn`). All content and effects are **props** — the library is
presentational and host-agnostic (no analytics, no router, no config baked in).

1. **Link the package (no publish needed).** Add to the app's `package.json`:
   ```jsonc
   "@hanzogui/chrome": "link:<relpath>/gui/pkgs/ui/chrome"
   ```
   Install (`pnpm install` / `npm install`). It ships as SOURCE.

2. **Transpile it as first-party.**
   - **Next**: `transpilePackages: ['@hanzogui/chrome']` in `next.config`. This ALSO
     dedupes React for the linked package — do **NOT** alias `react`/`react-dom` in
     webpack; a global react alias breaks Next's server/RSC React and crashes static
     export with `Cannot read properties of null (reading 'useContext')`.
   - **Vite**: `optimizeDeps.exclude: ['@hanzogui/chrome']` and ensure
     `server.fs.allow` includes the gui checkout. Vite transpiles linked TS by default.

3. **Let Tailwind see it** (its classes live outside your project root):
   - **Tailwind v4** (CSS-first): `@source '<relpath>/gui/pkgs/ui/chrome/src';` in globals.css.
   - **Tailwind v3**: add `'<relpath>/gui/pkgs/ui/chrome/src/**/*.{js,jsx,ts,tsx}'` to `content`.

4. **Write thin adapters** that inject the surface's content + effects. Keep analytics
   IN the app (the library takes callbacks):
   ```tsx
   <HanzoNav items={NAV} logo={<HanzoLogo variant="white" size={22} />} brand="Hanzo AI"
     login={{ links: LOGIN_LINKS }} primary={{ label: 'Try Hanzo', href: CHAT, links: TRY_LINKS }}
     onPrimary={() => analytics.capture(EVENTS.CHAT_STARTED, { source: 'nav' })} />
   ```
   `ChatHero` forwards on submit: pass `onSubmit={(q) => { analytics…; goTo(q) }}` (or a
   plain `href` to auto-append `?q=`). Cross-origin surfaces use absolute hrefs in nav data;
   a same-app landing forwards INTO itself (e.g. `navigate('/c/new?q='+q)`).

5. **AI widget** (optional): `<HanzoWidget repo="org/repo" />` injects the
   `<meta name="hanzo:repo">` convention + loads `hanzo.app/edit.js` once. Mount-only;
   edit.js behaviour is a separate workstream.

Gotcha — analytics stays put: never move `@hanzo/event` / `hz.js` into the library.
The chrome is effect-free; wire telemetry in the app via the callback props.

---

## Recipe B — migrate page primitives (`@hanzo/ui` shadcn → `@hanzo/gui` Tamagui)

Proven to build + render in a Next 15 `output:'export'` static export. Steps mirror the
one working fleet integration (`hanzoai/app/next.config.js`).

1. **Deps** (published npm, pin to the same versions the fleet uses, currently 7.3.0):
   `@hanzo/gui @hanzogui/config @hanzogui/lucide-icons-2 react-native-web`.

2. **Next config** — transpile the whole gui graph + map RN→RN-web + prefer `.web.*`:
   ```js
   transpilePackages: ['@hanzo/gui','react-native-web', ...fs.readdirSync('node_modules/@hanzogui').map(n=>`@hanzogui/${n}`)]
   webpack: (c) => { c.resolve.alias['react-native$']='react-native-web';
     c.resolve.extensions=['.web.tsx','.web.ts','.web.jsx','.web.js',...c.resolve.extensions];
     c.resolve.fallback={...c.resolve.fallback, fs:false, '@react-native-async-storage/async-storage':false, 'pino-pretty':false}; return c }
   ```
   No `@tamagui/next-plugin` — its dep is broken and unnecessary; `transpilePackages` +
   Tamagui's runtime SSR-extracts the atomic CSS into the static HTML (styled on first paint).
   (Vite surfaces: use `@hanzogui/vite-plugin` instead + the RN-web alias.)

3. **Provider** — wrap the tree once (context-only; additive, leaves other UI intact):
   ```tsx
   import { createGui } from '@hanzo/gui'; import { defaultConfig } from '@hanzogui/config/v5'
   const config = createGui(defaultConfig)
   <GuiProvider config={config} defaultTheme="dark">{children}</GuiProvider>
   ```

4. **Swap primitives.** Build a local `components/ui/*` shim layer that exposes the
   shadcn API but is backed by gui, then repoint imports (or alias `@hanzo/ui` → the shim
   to flip every importer at once). Component map (hanzo.ai surface, frequency-ranked):

   | shadcn `@hanzo/ui` | files | `@hanzo/gui` |
   |---|---|---|
   | `Button` (+`buttonVariants`) | 121 | `Button` (map `variant`/`size` → theme/size props) |
   | `Input` | 12 | `Input` |
   | `Badge` | 10 | compose `XStack`+`Text` (no Tamagui Badge) |
   | `Label` | 6 | `Label` |
   | `Card`+family | 5 | `Card` + `Card.Header`/`Card.Footer` |
   | `Avatar`+family | 4 | `Avatar` (`Avatar.Image`/`Avatar.Fallback`) |
   | `Tabs`+family | 4 | `Tabs` |
   | `Textarea` | 4 | `TextArea` |
   | `Table`+family | 3 | compose from `styled` stacks (no Tamagui Table) |
   | `Progress`,`Accordion`,`Dialog`,`DropdownMenu`,`Select`,`Separator`,`Sheet`,`Slider`,`Checkbox` | ≤3 ea | `Progress`,`Accordion`,`Dialog`,`Menu`,`Select`,`Separator`,`Sheet`,`Slider`,`Checkbox` |
   | `Toaster` | 1 | `Toast`/`ToastProvider` |

   Do the top-5 first — they cover the overwhelming majority of files. If a gui primitive
   is genuinely missing (Badge, Table), ADD it to `@hanzo/gui` — never reach back to shadcn.

5. **Cleanup during cutover**:
   - Repoint any Tailwind `content` glob off `@hanzo/ui/dist/**` (it purges nothing once shadcn is gone).
   - Collapse duplicate primitives to one (hanzo.ai has TWO Buttons: raw `@hanzo/ui` in 121
     files + a bug-fix wrapper `components/ui/button.tsx` in 17 — pick one).
   - Fix dangling type-only imports (`ToastActionElement`/`ToastProps` don't exist in `@hanzo/ui@5`).

---

## Proof (increment 1)

- **Spike** — a real `@hanzo/gui` component (`YStack`/`Text`/`Button` + live theme tokens)
  built and rendered STYLED in hanzo.ai's Next 15 `output:'export'` static export; the
  atomic CSS is SSR-extracted into the prerendered HTML (no FOUC). Toolchain GREEN.
- **Chrome on hanzo.ai** — apex nav/footer/hero migrated to `@hanzogui/chrome`; static
  build passes (711 pages), chrome CSS generated by Tailwind `@source`, pixel-identical to
  pre-migration, hz.js + `@hanzo/event` untouched.
- **Chrome on hanzo.chat** — new public landing (React 18 + Vite + Tailwind 3) on the SAME
  `@hanzogui/chrome`; composer forwards into the chat app.

## Per-surface rollout checklist

- [ ] Chrome: link `@hanzogui/chrome` · transpile/optimizeDeps · Tailwind source · adapters (nav data + analytics callbacks).
- [ ] Primitives: add gui deps · next/vite config (transpile + RN-web alias) · `GuiProvider` · shim + swap top-5 · flip the rest.
- [ ] Cleanup: repoint Tailwind glob · collapse duplicates · fix dangling types · drop `@hanzo/ui`.
- [ ] Prove: build + Playwright screenshot (desktop + mobile), no horizontal scroll, console clean.
