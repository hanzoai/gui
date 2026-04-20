import type { ExtraSteps } from './steps/types'

import chalk from 'chalk'

import expoRouterSteps from './steps/expo-router'
import remixSteps from './steps/remix'
import starterFree from './steps/starter-free'
import takeoutSteps from './steps/takeout'

export const templates: Array<{
  title: string
  value: string
  type: 'free' | 'premium' | 'included-in-monorepo'
  hidden: boolean
  packageManager: 'yarn' | 'npm' | 'pnpm' | 'bun'
  repo: { url: string; sshFallback: string; dir: string[]; branch: string }
  extraSteps?: ExtraSteps
}> = [
  {
    title: `${chalk.bold.underline(
      `🥡 ${chalk.magenta('Takeout')} ${chalk.green('Free')}`
    )} - Full stack starter: https://hanzogui.dev/takeout`,
    value: 'takeout-free',
    type: 'free',
    hidden: false,
    packageManager: 'bun',
    repo: {
      url: `https://github.com/hanzogui/takeout-free`,
      sshFallback: `git@github.com:hanzogui/takeout-free.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: starterFree,
  },

  {
    title: `${chalk.bold.underline(
      `🥡 ${chalk.magenta('Takeout')} ${chalk.red('Pro')}`
    )} - Full featured starter: https://hanzogui.dev/takeout`,
    value: `takeout-pro`,
    type: 'premium',
    packageManager: 'yarn',
    hidden: false,
    repo: {
      url: `https://github.com/hanzogui/takeout2`,
      sshFallback: `git@github.com:hanzogui/takeout2.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: takeoutSteps,
  },

  {
    title: `${chalk.bold.underline(
      `🥡 ${chalk.magenta('Takeout')} ${chalk.yellow('Pro Classic')}`
    )} - Original Pro starter: https://hanzogui.dev/takeout`,
    value: `takeout-pro-classic`,
    type: 'premium',
    packageManager: 'yarn',
    hidden: false,
    repo: {
      url: `https://github.com/hanzogui/takeout`,
      sshFallback: `git@github.com:hanzogui/takeout.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: takeoutSteps,
  },

  {
    title: `Expo Router - Expo with file-based routing`,
    value: 'expo-router',
    type: 'free',
    hidden: false,
    packageManager: 'bun',
    repo: {
      url: `https://github.com/hanzoai/gui`,
      sshFallback: `git@github.com:hanzogui/hanzogui.git`,
      dir: ['code', 'starters', 'expo-router'],
      branch: 'main',
    },
    extraSteps: expoRouterSteps,
  },

  {
    title: `Remix - Remix with Vite`,
    value: 'remix',
    type: 'free',
    hidden: false,
    packageManager: 'bun',
    repo: {
      url: `https://github.com/hanzoai/gui`,
      sshFallback: `git@github.com:hanzogui/hanzogui.git`,
      dir: ['code', 'starters', 'remix'],
      branch: 'main',
    },
    extraSteps: remixSteps,
  },

  {
    title: `Next + Expo - Production ready monorepo`,
    value: 'starter-free',
    type: 'free',
    hidden: false,
    packageManager: 'yarn',
    repo: {
      url:
        process.env.STARTER_FREE_REPO_SOURCE ||
        `https://github.com/hanzogui/starter-free.git`,
      sshFallback: `git@github.com:hanzogui/starter-free.git`,
      dir: [],
      branch: 'main',
    },
    extraSteps: starterFree,
  },
]
