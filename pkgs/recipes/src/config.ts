export const DEFAULT_BASE_URL = 'https://base.hanzo.ai'
export const RECIPES_COLLECTION = 'gui_recipes'
export const DEFAULT_INSTALL_DIR = 'src/gui'
export const DEFAULT_CONFIG_FILENAMES = ['gui.config.json', '.guirc.json'] as const

export function resolveBaseUrl(override?: string): string {
  return override ?? process.env.HANZO_BASE_URL ?? DEFAULT_BASE_URL
}
