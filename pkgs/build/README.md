## @hanzogui/build

One package, built by the TypeScript compiler alone.

```
hanzogui-build                # ESM + declarations, CommonJS, native
hanzogui-build --skip-native  # a package with nothing platform-specific
hanzogui-build --watch        # the ESM emit, continuously
```

Three project files in the package describe the three emits, and the compiler
reads exactly one answer per target:

| project                | writes                                        |
| ---------------------- | --------------------------------------------- |
| `tsconfig.esm.json`    | `dist/esm/*.js` and `types/*.d.ts`             |
| `tsconfig.cjs.json`    | `dist/cjs/*.js`, marked commonjs by its own `package.json` |
| `tsconfig.native.json` | `dist/native/*.js`, where a `.native` file takes its sibling's name |

Source names every relative import with its extension and the compiler rewrites
it on emit, so what lands in `dist` is loadable by Node as written. Nothing else
runs over the code.

A package is CommonJS only where its manifest states a `require` entry; one that
uses `import.meta` or a top-level `await` has no CommonJS form and states none.
The native pass runs only where a `tsconfig.native.json` exists, which is where
`.native.*` sources exist; on that platform the sibling's callers resolve to the
native file through the same relative import.

The `exports` map points at what the emits produce: `dist/esm/x.js`,
`dist/cjs/x.js`, `dist/native/x.js`, `types/x.d.ts`.
