import { applyMaskStateless } from './applyMask.tsx'
import type { CreateMask } from './createThemeTypes.tsx'
import { getThemeInfo } from './themeInfo.tsx'

export const combineMasks = (...masks: CreateMask[]): CreateMask => {
  const mask: CreateMask = {
    name: 'combine-mask',
    mask: (template, opts) => {
      let current = getThemeInfo(template, opts.parentName)
      let theme: any
      for (const mask of masks) {
        if (!current) {
          throw new Error(
            `Nothing returned from mask: ${current}, for template: ${template} and mask: ${mask.toString()}, given opts ${JSON.stringify(
              opts,
              null,
              2
            )}`
          )
        }
        const next = applyMaskStateless(current, mask, opts)
        current = next
        theme = next.theme
      }
      return theme
    },
  }
  return mask
}
