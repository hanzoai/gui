import { guiPlugin } from '@hanzogui/vite-plugin'
import { one } from 'one/vite'
import type { UserConfig } from 'vite'

export default {
  clearScreen: false,

  plugins: [
    one({
      ssr: {
        dedupeSymlinkedModules: true,
      },

      web: {
        defaultRenderMode: 'spa',
      },
    }),

    guiPlugin(),
  ],
} satisfies UserConfig
