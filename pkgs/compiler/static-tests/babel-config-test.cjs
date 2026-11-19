module.exports = {
  parserOpts: {
    plugins: ['typescript', 'jsx'],
  },
  plugins: [
    [
      '@hanzogui/babel-plugin',
      {
        components: ['@hanzo/gui', '@hanzogui/test-design-system'],
        platform: 'native',
        config: './tests/lib/hanzogui.config.cjs',
      },
    ],
  ],
}
