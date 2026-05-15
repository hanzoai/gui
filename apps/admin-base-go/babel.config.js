module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // hanzogui / @hanzogui/* are React Native + web universal; the
      // hanzogui babel plugin does the import-tree-shake and reads the
      // active design config from `gui.config.ts`.
      [
        '@hanzogui/babel-plugin',
        { components: ['hanzogui'], config: './gui.config.ts' },
      ],
    ],
  }
}
