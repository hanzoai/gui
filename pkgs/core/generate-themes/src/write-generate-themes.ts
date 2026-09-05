import { readFile, writeFile } from 'node:fs/promises'

import type { generateThemes } from './generate-themes.ts'

export async function writeGeneratedThemes(
  hanzoguiDotDir: string,
  outPath: string,
  generatedOutput: Awaited<ReturnType<typeof generateThemes>>
) {
  if (!generatedOutput) return

  const { generated } = generatedOutput

  if (process.env.DEBUG === 'hanzogui') {
    console.info(`Generated themes:`, JSON.stringify(generatedOutput, null, 2))
  }

  const newContent = `// @ts-nocheck\n` + generated

  // Skip writing if contents are unchanged
  const existingContent = await readFile(outPath, 'utf-8').catch(() => null)
  if (existingContent === newContent) {
    return
  }

  await writeFile(outPath, newContent)
}
