## @hanzogui/build

One package, built by the TypeScript compiler alone: `tsgo`, three passes.

```
hanzogui-build                # ESM + declarations, CommonJS, native
hanzogui-build --skip-native  # a package with nothing platform-specific
hanzogui-build --watch        # the ESM emit, continuously
hanzogui-build clean          # remove dist and types (clean:build is the same)
```

Every package ships its source and three emits. Three project files describe
them, and the compiler reads exactly one answer per target:

| project                | writes                                                          |
| ---------------------- | --------------------------------------------------------------- |
| `tsconfig.esm.json`    | `dist/esm/*.js` and `types/*.d.ts`; the one pass that typechecks |
| `tsconfig.cjs.json`    | `dist/cjs/*.js`, marked commonjs by its own `package.json`       |
| `tsconfig.native.json` | `dist/native/*.js`, CommonJS as well: Metro and Node both load the bare `require` native sources say |

Source names every relative import with its extension and the compiler rewrites
it on emit, so what lands in `dist` is loadable by Node as written. Nothing else
runs over the code.

A sibling answers for its file on one target and reaches no other emit:
`x.cjs.ts` takes x's name in the CommonJS output, `x.native.ts` in the native
one. A module that needs its own location says `import.meta.url` in `here.ts`
and `__filename` in `here.cjs.ts`, and everything else imports `url` from
`./here.ts`. The CommonJS output is parsed as a script afterwards; a file only a
module could load fails the build by name.

Each emit answers `process.env.GUI_TARGET` with its own literal, `"web"` or
`"native"`, so a bundler folds the other platform away.

The `exports` map points at what the emits produce: `types/x.d.ts`,
`dist/esm/x.js`, `dist/cjs/x.js`, and `dist/native/x.js` where the package
builds native.
