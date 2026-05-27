module.exports = {
  plugins: [
    [
      '@hanzogui/babel-plugin',
      {
        components: ['gui', '@hanzogui/test-design-system'],
        platform: 'native',
        config: './tests/lib/gui.config.cjs',
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
