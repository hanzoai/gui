import path from 'node:path'

// helper for webpack exclude specific to gui

export const shouldExclude = (filePath: string, projectRoot?: string) => {
  if (
    (projectRoot && filePath.includes(projectRoot) && filePath.endsWith('sx')) ||
    isGuiDistJSX(filePath)
  ) {
    return false
  }
  return true
}

function isGuiDistJSX(filePath: string) {
  return filePath.includes('/dist/jsx/'.replace(/\//g, path.sep))
}
