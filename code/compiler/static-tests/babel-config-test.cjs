module.exports = {
  plugins: [
    [
      '@hanzo/gui-babel-plugin',
      {
        components: ['tamagui', '@hanzo/gui-test-design-system'],
        platform: 'native',
        config: './tests/lib/tamagui.config.cjs',
      },
    ],
    [
      '@babel/plugin-syntax-typescript',
      {
        isTSX: true,
      },
    ],
  ],
}
