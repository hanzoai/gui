import { CLI_NAME } from './constants.js'
import { red } from './lib/ansi.js'

const HELP = `${CLI_NAME} — install Hanzo GUI recipes into your project.

Usage:
  ${CLI_NAME}                 Interactive picker.
  ${CLI_NAME} add <slug>      Install a single recipe.
  ${CLI_NAME} list            List all available recipes.
  ${CLI_NAME} init            Write gui.config.json.
  ${CLI_NAME} --help          Show this message.
  ${CLI_NAME} --version       Print version.

Recipes are fetched from Hanzo Base at $HANZO_BASE_URL (default https://base.hanzo.ai).
Recipe files vendor into src/gui/ by default; override via gui.config.json.
`

async function main(): Promise<void> {
  const [, , cmd, ...rest] = process.argv

  if (cmd === '--help' || cmd === '-h' || cmd === 'help') {
    process.stdout.write(HELP)
    return
  }

  if (cmd === '--version' || cmd === '-v') {
    const pkg = await import('../package.json', {
      with: { type: 'json' },
    } as ImportCallOptions)
    process.stdout.write(
      ((pkg as { default?: { version?: string } }).default?.version ?? 'unknown') + '\n'
    )
    return
  }

  if (!cmd) {
    const { pick } = await import('./commands/pick.js')
    await pick()
    return
  }

  if (cmd === 'add') {
    if (!rest[0]) {
      process.stderr.write(`Usage: ${CLI_NAME} add <recipe-slug>\n`)
      process.exit(1)
    }
    const { add } = await import('./commands/add.js')
    await add(rest[0])
    return
  }

  if (cmd === 'list') {
    const { list } = await import('./commands/list.js')
    await list()
    return
  }

  if (cmd === 'init') {
    const { init } = await import('./commands/init.js')
    await init()
    return
  }

  process.stderr.write(`Unknown command: ${cmd}\n\n${HELP}`)
  process.exit(1)
}

main().catch((e) => {
  process.stderr.write(red(e instanceof Error ? e.message : String(e)) + '\n')
  process.exit(1)
})
