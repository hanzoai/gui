export function getPragmaOptions({ source, path }: { source: string; path: string }) {
  let shouldPrintDebug: boolean | 'verbose' = false
  let shouldDisable = false

  // try and avoid too much parsing but sometimes esbuild adds helpers above..
  const firstLines = source.slice(0, 800)

  let pragma = ''
  for (const line of firstLines.split('\n')) {
    const trimmed = line.trim()
    // only look at leading comments/empty lines, stop at first real code
    if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
      break
    }
    pragma =
      trimmed
        .match(/(\/\/|\/\*)\s?!?\s?(gui-ignore|debug|debug-verbose)(\n|\s|$).*/)?.[2]
        .trim() || ''
    if (pragma) {
      pragma = pragma.replace('!', '').trim()
      break
    }
  }

  switch (pragma) {
    case 'gui-ignore':
      shouldDisable = true
      break

    case 'debug':
      shouldPrintDebug = true
      break

    case 'debug-verbose':
      shouldPrintDebug = 'verbose'
      break
  }

  if (process.env.GUI_DEBUG_FILE) {
    if (path.includes(process.env.GUI_DEBUG_FILE)) {
      shouldPrintDebug = 'verbose'
    }
  }

  if (process.env.DEBUG?.includes('@hanzo/gui')) {
    shouldPrintDebug ||= true
  }

  if (process.env.DEBUG?.includes('gui-verbose')) {
    shouldPrintDebug = 'verbose'
  }

  return {
    shouldPrintDebug,
    shouldDisable,
  }
}
