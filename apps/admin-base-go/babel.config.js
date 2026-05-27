module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // gui / @hanzogui/* are React Native + web universal; the
      // gui babel plugin does the import-tree-shake and reads the
      // active design config from `gui.config.ts`.
      [
        '@hanzogui/babel-plugin',
        { components: ['gui'], config: './gui.config.ts' },
      ],
    ],
  }
}
