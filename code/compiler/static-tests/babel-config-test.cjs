module.exports = {
  plugins: [
    [
      '@hanzo/gui-babel-plugin',
      {
        components: ['@hanzo/gui', '@hanzo/gui-test-design-system'],
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
