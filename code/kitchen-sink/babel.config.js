module.exports = (api) => {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@hanzo/gui-babel-plugin',
        {
          components: ['@hanzo/gui', '@hanzo/gui-sandbox-ui'],
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
