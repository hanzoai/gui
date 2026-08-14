/**
 * @hanzogui/shell ships to hosts that may run Tailwind, Gui, or nothing at all,
 * so it styles itself with inline styles + theme.ts tokens and declares only
 * react/react-dom. A utility-class string in there has NO compiler behind it:
 * it type-checks, it builds, it publishes, and it renders completely unstyled
 * for every consumer. 8.0.3 shipped exactly that in five files.
 *
 * `className` itself is still legal — but only to PASS THROUGH a caller's own
 * class onto a DOM node. This fails the build if the package ever authors class
 * names of its own again.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const SRC = path.join(
  fileURLToPath(new URL('.', import.meta.url)),
  '../pkgs/ui/shell/src'
)

/** A pass-through: `className={className}` / `{imgClass}` / `{props.className}`. */
const PASS_THROUGH = /^\{[A-Za-z_$][\w$.?]*\}$/

/** Utility-class shapes: `flex`, `px-3`, `text-white/40`, `hover:bg-white/[0.06]`. */
const UTILITY =
  /(^|\s)(-?[a-z]+:)?(flex|grid|block|hidden|absolute|relative|fixed|sticky|truncate|border|rounded|shadow|transition|animate)(-[\w./[\]%-]+)?($|\s)|(^|\s)(-?[a-z]+:)?(p|m|px|py|pt|pb|pl|pr|mx|my|mt|mb|ml|mr|w|h|z|gap|text|bg|border|ring|max|min|top|left|right|bottom|inset|overflow|leading|tracking|font|opacity|select|backdrop)-[\w./[\]%-]+($|\s)/

const files = fs
  .readdirSync(SRC, { recursive: true })
  .filter((f) => /\.tsx?$/.test(f))
  .map((f) => path.join(SRC, f))

const offences = []
for (const file of files) {
  const src = fs.readFileSync(file, 'utf8')
  src.split('\n').forEach((line, i) => {
    const m = line.match(/className=(\{[^}]*\}|"[^"]*"|'[^']*')/)
    if (!m) return
    const value = m[1]
    if (PASS_THROUGH.test(value)) return
    const text = value.slice(1, -1)
    if (!UTILITY.test(text)) return
    offences.push(`  ${path.relative(SRC, file)}:${i + 1}  ${line.trim().slice(0, 96)}`)
  })
}

if (offences.length) {
  console.error(
    `\n@hanzogui/shell authored ${offences.length} utility-class string(s). This package has\n` +
      `no CSS framework and no config — these render UNSTYLED for every consumer.\n` +
      `Use inline styles + the tokens in pkgs/ui/shell/src/theme.ts instead.\n\n` +
      offences.join('\n') +
      '\n'
  )
  process.exit(1)
}

console.log(`shell: no authored utility classes in ${files.length} files ✓`)
