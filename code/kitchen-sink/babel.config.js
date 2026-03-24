module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@hanzogui/babel-plugin',
        {
          components: ['@hanzo/gui', '@hanzogui/sandbox-ui'],
          config: './src/gui.config.ts',
        },
      ],
      'react-native-reanimated/plugin',
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            'next/router': './next-router-shim',
          },
        },
      ],
    ],
  }
}
