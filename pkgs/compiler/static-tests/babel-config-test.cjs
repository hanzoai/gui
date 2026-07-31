module.exports = {
  plugins: [
    [
      '@hanzogui/babel-plugin',
      {
        components: ['@hanzo/gui', '@hanzogui/test-design-system'],
        platform: 'native',
        config: './tests/lib/hanzogui.config.cjs',
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
