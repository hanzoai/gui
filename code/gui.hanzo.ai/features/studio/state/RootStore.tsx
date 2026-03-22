import type { ThemeDefinition } from '@hanzo/gui-theme-builder'
import { createStore } from '@hanzo/gui-use-store'
import type { GuiInternalConfig, ThemeName } from '@hanzo/gui'
import { isLocal } from '~/features/studio/constants'
// import { watchGuiDirectory } from '../helpers/watchGuiDirectory'
import { toastController } from '../ToastProvider'
import type { Components, DialogTypes, StudioDialogProps } from './types'

type ThemesConfig = {
  palettes: Record<string, string[]>
  templates: Record<string, number>
  masks: Record<string, { name: string }>
  themes: Record<string, ThemeDefinition>
}

const matchDarkMode = () =>
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)')
    : null

function getPrefersScheme() {
  return matchDarkMode()?.matches ? 'dark' : 'light'
}

export class RootStore {
  // hardcoded for now
  static colors = ['red', 'orange', 'blue', 'purple', 'green', 'pink', 'yellow']

  async init() {
    matchDarkMode()?.addEventListener('change', () => {
      this.theme = getPrefersScheme()
    })

    if (isLocal) {
      await this.reloadGuiConfig()
    }
  }

  get scheme() {
    return this.theme.startsWith('dark') ? 'dark' : 'light'
  }

  projectName = ''
  fsReadSucceeded = false
  theme: ThemeName = getPrefersScheme()
  dialog: keyof DialogTypes = 'none'
  dialogProps: StudioDialogProps = {}

  config: null | GuiInternalConfig = null
  themes: null | ThemesConfig = null

  components = {
    components: {} as Components,
  }

  unwatchPreviousFileWatch?: () => void

  async reloadGuiConfig() {
    if (isLocal) {
      console.warn(`⚠️ disabled RootStore for now`)
      return

      // const domain = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:8081'
      // const [configJson, themesJson] = await Promise.all([
      //   fetch(`${domain}/api/gui.config.json`).then((res) => res.json()),
      //   fetch(`${domain}/api/gui.themes.json`).then((res) => res.json()),
      // ])

      // await this.onReloadedGuiConfig(configJson)
      // this.themes = themesJson
    } else {
      // TODO
      // try {
      //   this.unwatchPreviousFileWatch?.()
      //   this.unwatchPreviousFileWatch = await watchGuiDirectory((data) => {
      //     this.onReloadedGuiConfig(data.config)
      //     this.projectName = data.projectName
      //     this.fsReadSucceeded = true
      //   })
      // } catch (error: unknown) {
      //   console.error(error)
      //   if (error instanceof Error) {
      //     toastController.show('Error', {
      //       message: error.message,
      //       customData: {
      //         theme: 'red',
      //       },
      //     })
      //   }
      //   this.projectName = ''
      //   this.fsReadSucceeded = false
      // }
    }
    return null
  }

  async onReloadedGuiConfig(config: {
    guiConfig: GuiInternalConfig
    components: Components
  }) {
    toastController.show('Config Updated.', {
      message: 'We picked up the new changes.',
      customData: { theme: 'green' },
    })

    this.components = {
      ...this.components,
      components: config.components,
    }

    // hacky workaround we're generating this wrong need to fix
    // @ts-ignore
    if (config.guiConfig.config) {
      // @ts-ignore
      this.config = config.guiConfig.config
    } else {
      const guiConfig = config.guiConfig as GuiInternalConfig
      this.config = guiConfig
    }
  }

  // we can move this to a dialogStore

  confirmationCallback?: Function
  confirmationStatus?: boolean | null

  setConfirmationStatus(status: boolean) {
    this.confirmationStatus = status
  }

  async confirmDialog(name: keyof DialogTypes, props: StudioDialogProps) {
    const promise = new Promise<boolean>((res) => {
      this.confirmationCallback = res
    })

    this.showDialog(name, props)
    return await promise
  }

  showDialog(name: keyof DialogTypes, props: StudioDialogProps) {
    this.dialog = name
    this.dialogProps = props
    this.confirmationStatus = null
  }

  hideDialog() {
    this.dialog = 'none'
    this.dialogProps = {}
    const confirmed = Boolean(this.confirmationStatus)
    console.warn('2', confirmed, this.confirmationCallback)
    this.confirmationCallback?.(confirmed)
    this.confirmationStatus = null
  }
}

export const rootStore = createStore(RootStore)
