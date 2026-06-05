module.exports = (api) => {
  api.cache(true)

  const plugins = []

  // skip gui compiler for faster builds (e.g. detox test runs)
  if (!process.env.DISABLE_COMPILER) {
    plugins.push([
      '@hanzogui/babel-plugin',
      {
        components: ['gui', '@hanzogui/sandbox-ui'],
        config: './src/gui.config.ts',
      },
    ])
  }

  plugins.push('react-native-reanimated/plugin', [
    'module-resolver',
    {
      root: ['./'],
      alias: {
        'next/router': './next-router-shim',
      },
    },
  ])

  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins,
  }
}
