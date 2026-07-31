<div align="center">
  <picture width="572px">
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/hanzogui/hanzogui/raw/main/apps/gui.hanzo.ai/public/logo-black.png">
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/hanzogui/hanzogui/raw/main/apps/gui.hanzo.ai/public/logo-white.png">
    <img alt="Shows a black logo in light color mode and a white one in dark color mode." src="https://github.com/hanzogui/hanzogui/raw/main/apps/gui.hanzo.ai/public/social.png">
  </picture>
</div>

<h3 align="center">
  Style library, design system, composable components, and more.
</h3>

<h4 align="center">
  Gui is a bunch of libraries for building UIs that share code across React and React Native.
</h4>

<br />

<div align="center">
  <img alt="NPM downloads" src="https://img.shields.io/npm/dw/@hanzogui/core?logo=npm&label=NPM%20downloads&cacheSeconds=3600"/>
  <img alt="Commits per month" src="https://img.shields.io/github/commit-activity/m/hanzogui/hanzogui?label=Commits&logo=git" />
  <img alt="Discord users online" src="https://img.shields.io/discord/909986013848412191?logo=discord&label=Discord&cacheSeconds=3600" />
  <a href="https://gurubase.io/g/hanzogui">
    <img alt="Gurubase" src="https://img.shields.io/badge/Gurubase-Ask%20Gui%20Guru-006BFF" />
  </a>
</div>

<br />
<br />

- `@hanzogui/core` - Universal style library for React.
- `@hanzogui/static` - Optimizing compiler that works with `core` and `hanzogui`.
- `hanzogui` - UI kit that adapts to every platform.

<br />

**See [hanzogui.dev](https://hanzogui.dev) for documentation.**

Gui lets you share more code between web and native apps without sacrificing the two things that typically suffer when you do: performance and code quality.

It does this with an optimizing compiler that outputs platform-specific optimizations - it turns styled components, even with complex logic or cross-module imports, into a simple `div` alongside atomic CSS on the web, or a View with its style objects hoisted on native.

The entirety of Gui works at compile time and runtime, and can be set up gradually, with initial usage as simple as importing it and using the base views and styled function.

We recommend checking out the starters with `npm create hanzogui@latest`, they range from a simple learning example to a production-ready monorepo.

The compiler optimizes most and ultimately flattens a majority of styled components. In the [~500px² responsive browser section](https://hanzogui.dev) of the Gui website, 49 of the 55 or so [inline styled components](https://github.com/hanzogui/hanzogui/blob/main/apps/gui.hanzo.ai/components/HeroResponsive.tsx) are flattened to a `div`. The homepage gains nearly 15% on Lighthouse with the compiler on.

[Learn more on the website](https://hanzogui.dev/docs/intro/introduction).

---

## Contributing

To contribute to Gui reference the [contributing guide](https://github.com/hanzogui/hanzogui/blob/main/CONTRIBUTING.md).

To contribute to documentation, see the docs source in `apps/gui.hanzo.ai/data/docs/`.
