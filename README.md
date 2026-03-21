# Hanzo GUI

<h3 align="center">
  Style library, design system, composable components, and more.
</h3>

<h4 align="center">
  Hanzo GUI is a bunch of libraries for building UIs that share code across React and React Native.
</h4>

<br />

<div align="center">
  <img alt="NPM downloads" src="https://img.shields.io/npm/dw/@hanzo/gui-core?logo=npm&label=NPM%20downloads&cacheSeconds=3600"/>
  <img alt="Commits per month" src="https://img.shields.io/github/commit-activity/m/hanzoai/gui?label=Commits&logo=git" />
</div>

<br />
<br />

- `@hanzo/gui-web` - Universal style library for React.
- `@hanzo/gui` - UI kit that adapts to every platform.
- `@hanzo/gui-static` - Optimizing compiler that works with `gui-web` and `gui`.

<br />

**See [gui.hanzo.ai](https://gui.hanzo.ai) for documentation.**

Hanzo GUI lets you share more code between web and native apps without sacrificing the two things that typically suffer when you do: performance and code quality.

It does this with an optimizing compiler that outputs platform-specific optimizations - it turns styled components, even with complex logic or cross-module imports, into a simple `div` alongside atomic CSS on the web, or a View with its style objects hoisted on native.

The entirety of Hanzo GUI works at compile time and runtime, and can be set up gradually, with initial usage as simple as importing it and using the base views and styled function.

We recommend checking out the starters with `npm create hanzo-gui@latest`, they range from a simple learning example to a production-ready monorepo.

The compiler optimizes most and ultimately flattens a majority of styled components. In the [~500px² responsive browser section](https://gui.hanzo.ai) of the Hanzo GUI website, 49 of the 55 or so [inline styled components](https://github.com/hanzoai/gui/blob/main/code/gui.hanzo.ai/components/HeroResponsive.tsx) are flattened to a `div`. The homepage gains nearly 15% on Lighthouse with the compiler on.

[Learn more on the website](https://gui.hanzo.ai/docs/intro/introduction).

---

## Contributing

To contribute to Hanzo GUI reference the [contributing guide](https://github.com/hanzoai/gui/blob/main/CONTRIBUTING.md).

To contribute to documentation, see the docs source in `code/gui.hanzo.ai/data/docs/`.
