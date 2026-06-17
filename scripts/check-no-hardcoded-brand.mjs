#!/usr/bin/env node
// Brand-hardcode guard for the shared @hanzo/ai UI.
//
// The UI ships ONCE and is skinned per brand purely from `brandConfig` — so no
// brand name may be baked into user-facing copy. Every string must use
// `{{appName}}` (i18n) or read from `brandConfig`, so Hanzo / Zoo / Lux / and any
// FUTURE brand all render correctly from config alone (decomplected: brand = data).
//
// This fails CI (exit 1) if a brand literal appears in a user-facing i18n string
// value. Run: `node scripts/check-no-hardcoded-brand.mjs`
import { readFileSync, existsSync } from 'fs';

const BRANDS = ['Hanzo', 'Shinkai', 'Zoo', 'Lux'];

// Files whose string VALUES are user-facing translation copy (the shared UI).
const FILES = [
  'pkgs/net-i18n/src/lib/default/index.ts',
].map((p) => new URL(`../${p}`, import.meta.url).pathname);

// Lines that legitimately contain a brand word: URLs/domains, package scopes,
// internal identifiers, code comments. These are NOT user-facing copy.
const ALLOW =
  /hanzo\.(ai|network|id|cloud|sh)|@hanzo[/_]|zoo\.(ai|network|ngo|cloud)|lux\.(network|cloud|exchange|ai|id)|github\.com|\b\w+[_-](free_trial|node|identity)\b|^\s*(\/\/|\*|\/\*)/i;

const violations = [];
for (const file of FILES) {
  if (!existsSync(file)) { console.error(`! missing: ${file}`); continue; }
  readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    if (ALLOW.test(line)) return;
    // Pull the quoted string value on the line (single/double/backtick).
    const m = line.match(/(['"`])((?:\\.|(?!\1).)*)\1\s*,?\s*$/);
    const val = m ? m[2] : '';
    if (!val) return;
    for (const b of BRANDS) {
      if (new RegExp(`\\b${b}\\b`).test(val)) {
        violations.push(`  ${file.replace(process.cwd() + '/', '')}:${i + 1}  "${b}" hardcoded → use {{appName}}\n      ${line.trim().slice(0, 96)}`);
      }
    }
  });
}

if (violations.length) {
  console.error(`\n❌ brand hardcoded in ${violations.length} user-facing string(s) — use {{appName}} / brandConfig:\n`);
  console.error(violations.join('\n'));
  console.error('\nThe shared UI must be brand-neutral; brand is data (brandConfig), never code.\n');
  process.exit(1);
}
console.log('✓ no hardcoded brand in shared UI copy — every brand renders from config alone');
