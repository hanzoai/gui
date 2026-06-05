// Regression: a migration codemod dropped lucide imports (Box/Boxes/Coins) from
// main-layout.tsx, so the chat screens crashed with "Box is not defined" — only
// caught by running the real UI. This static guard fails if a critical screen
// uses a <Component> it never imports or declares.
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Components that are ambient/built-in (used as <X> but not import-able by name).
const AMBIENT = new Set(['Fragment', 'Suspense', 'StrictMode', 'Profiler']);

/** Returns JSX components used in `src` that are neither imported nor declared. */
function missingComponents(src: string): string[] {
  const known = new Set<string>(AMBIENT);

  // import clauses (multi-line aware): default, named ({A, B as C, type D}), namespace
  for (const m of src.matchAll(/import\s+([^;]*?)\s+from\s+['"][^'"]+['"]/gs)) {
    const clause = m[1].trim();
    const named = clause.match(/\{([\s\S]*?)\}/);
    if (named) {
      for (const part of named[1].split(',')) {
        const name = part.replace(/\btype\b/, '').trim().split(/\s+as\s+/).pop()?.trim();
        if (name) known.add(name);
      }
    }
    if (!clause.startsWith('{') && !clause.startsWith('*')) {
      const def = clause.match(/^(\w+)/);
      if (def) known.add(def[1]);
    }
    const ns = clause.match(/\*\s+as\s+(\w+)/);
    if (ns) known.add(ns[1]);
  }
  // local declarations (const/let/var/function/class X)
  for (const m of src.matchAll(/\b(?:const|let|var|function|class)\s+(\w+)/g)) known.add(m[1]);

  // destructured locals: `const { t, Trans } = useTranslation()`, `const [a] = …`
  for (const m of src.matchAll(/\b(?:const|let|var)\s+(?:\{([^}]*)\}|\[([^\]]*)\])\s*=/g)) {
    for (const part of (m[1] || m[2] || '').split(',')) {
      const name = part.split(':').pop()?.replace(/\.{3}/, '').trim();
      if (name && /^[A-Za-z_]\w*$/.test(name)) known.add(name);
    }
  }

  // JSX open tags `<Xxx` NOT preceded by an identifier char (excludes generics
  // like forwardRef<HTMLDivElement,…>) and followed by whitespace, > or />.
  const used = new Set<string>();
  for (const m of src.matchAll(/(?<![A-Za-z0-9_.])<([A-Z]\w+)(?=[\s/>])/g)) used.add(m[1]);

  return [...used].filter((u) => !known.has(u)).sort();
}

// Critical screens that render right after connect — exactly where the bug bit.
const CRITICAL = [
  'pages/layout/main-layout.tsx',
  'pages/home.tsx',
  'pages/containers.tsx',
];

describe('no missing JSX component imports (critical screens)', () => {
  for (const file of CRITICAL) {
    it(`${file}: every <Component> used is imported or declared`, () => {
      const src = readFileSync(resolve(__dirname, '../app', file), 'utf8');
      expect(missingComponents(src)).toEqual([]);
    });
  }
});
