import path from 'node:path'

// helper for webpack exclude specific to hanzogui

export const shouldExclude = (filePath: string, projectRoot?: string) => {
  if (
    (projectRoot && filePath.includes(projectRoot) && filePath.endsWith('sx')) ||
    isHanzoguiDistJSX(filePath)
  ) {
    return false
  }
  return true
}

function isHanzoguiDistJSX(filePath: string) {
  return filePath.includes('/dist/jsx/'.replace(/\//g, path.sep))
}
