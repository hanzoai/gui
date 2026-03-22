import * as fs from 'fs-extra'

import type { generateThemes } from './generate-themes'

export async function writeGeneratedThemes(
  guiDotDir: string,
  outPath: string,
  generatedOutput: Awaited<ReturnType<typeof generateThemes>>
) {
  if (!generatedOutput) return

  const { generated } = generatedOutput

  if (process.env.DEBUG === '@hanzo/gui') {
    console.info(`Generated themes:`, JSON.stringify(generatedOutput, null, 2))
  }

  const newContent = `// @ts-nocheck\n` + generated

  // Skip writing if contents are unchanged
  const existingContent = await fs.readFile(outPath, 'utf-8').catch(() => null)
  if (existingContent === newContent) {
    return
  }

  await fs.writeFile(outPath, newContent)
}
