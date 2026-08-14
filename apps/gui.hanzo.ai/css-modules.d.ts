// TypeScript 7 reports TS2882 for a side-effect import with no type
// declaration ("Cannot find module or type declarations for side-effect import
// of './globals.css'"). TS 5.x accepted these silently.
//
// Stylesheets are resolved by the bundler (Vite/webpack/Metro), never by the
// TypeScript module resolver, so this declares them legitimate rather than
// giving them a shape.
declare module '*.css'

// Packages that ship a stylesheet under a subpath with no file extension, so
// the wildcard above cannot match them.
declare module '@docsearch/css'
