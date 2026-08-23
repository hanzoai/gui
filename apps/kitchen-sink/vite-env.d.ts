/// <reference types="vite/client" />

// `@hanzo/font/css` is a stylesheet reached through a subpath export, so the
// specifier does not end in `.css` and vite/client's `*.css` declaration does
// not cover it. Without this the compiler cannot tell a stylesheet from a
// missing module.
declare module '@hanzo/font/css'
