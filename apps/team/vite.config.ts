import { hanzoguiPlugin } from '@hanzogui/vite-plugin'
import { one } from 'one/vite'
import type { UserConfig } from 'vite'

// The three addresses config.ts reads, replaced at build time.
//
// A `define` rather than `envPrefix` + `import.meta.env`: this app builds for
// native as well as web, and `import.meta` is not reliable in the native output
// format — the build already warns about it. A define is textual, so it lands
// the same way in both, and an unset variable leaves the `?? production default`
// in config.ts standing.
const endpoints = Object.fromEntries(
  ['HANZO_API', 'HANZO_ISSUER', 'HANZO_CLIENT_ID']
    .filter((name) => process.env[name] != null)
    .map((name) => [`process.env.${name}`, JSON.stringify(process.env[name])])
)

export default {
  clearScreen: false,

  define: endpoints,

  plugins: [
    one({
      ssr: {
        dedupeSymlinkedModules: true,
      },

      web: {
        defaultRenderMode: 'spa',
      },
    }),

    hanzoguiPlugin(),
  ],
} satisfies UserConfig
