const path = require('path')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { shouldExclude, GuiPlugin } = require('@hanzogui/loader')

const NODE_ENV = process.env.NODE_ENV || 'development'
const target = 'web'
const isProduction = NODE_ENV === 'production'

const boolVals = {
  true: true,
  false: false,
}
const disableExtraction =
  boolVals[process.env.DISABLE_EXTRACTION] ?? process.env.NODE_ENV === 'development'

/** @type { import('webpack').Configuration } */
module.exports = {
  context: __dirname,
  stats: 'normal', // 'detailed'
  mode: NODE_ENV,
  entry: ['./src/index.tsx'],
  devtool: 'cheap-module-source-map',
  optimization: {
    concatenateModules: false,
    minimize: false,
  },
  resolve: {
    // workspace packages rebuild their dist while the dev server runs; the
    // default resolver cache pins a failed resolution from mid-rebuild until
    // restart, so trade a little resolve speed for correctness
    unsafeCache: false,
    mainFields: ['module:jsx', 'browser', 'module', 'main'],
    extensions: ['.web.tsx', '.web.ts', '.ts', '.tsx', '.js'],
    alias: {
      'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
      'react/compiler-runtime': require.resolve('react/compiler-runtime'),
      react: require.resolve('react'),
      'react-dom/client': require.resolve('react-dom/client'),
      'react-dom/server': require.resolve('react-dom/server.browser'),
      'react-dom': require.resolve('react-dom'),
      'react-native$': 'react-native-web',
      '@hanzogui/sheet/controller$': path.resolve(
        __dirname,
        '../../pkgs/ui/sheet/src/controller.ts'
      ),
      '@hanzogui/sheet$': path.resolve(__dirname, '../../pkgs/ui/sheet/src/index.ts'),
      // dedupe react-native-web - workspace setup creates multiple copies
      // (kitchen-sink/node_modules + hanzogui/node_modules + root) which each
      // initialize the responder system with their own state, breaking
      // PanResponder when a different instance owns the document listeners.
      'react-native-web': path.resolve(__dirname, '../../node_modules/react-native-web'),
      'react-native-svg': '@hanzogui/react-native-svg',
    },
  },
  // workspace package rebuilds delete and rewrite their dist while the dev
  // server watches; compiling mid-rebuild caches a failed resolution. debounce
  // long enough that a package rebuild finishes before webpack recompiles.
  watchOptions: {
    aggregateTimeout: 1500,
  },
  devServer: {
    client: {
      overlay: false,
      logging: 'error',
    },
    hot: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: process.env.PORT || 7979,
  },
  ignoreWarnings: [
    // suppress react-native-worklets critical dependency warning
    /Critical dependency: require function is used in a way/,
    // suppress expo-modules-core tsconfig warnings
    /expo-modules-core.*expo-module-scripts\/tsconfig\.base/,
    // suppress all esbuild-loader tsconfig warnings
    /esbuild-loader.*Error parsing tsconfig\.json/,
  ],
  module: {
    rules: [
      // Process react-native-reanimated and @hanzogui/animations-reanimated with Babel plugin
      // The reanimated babel plugin transforms 'worklet' directives for web
      {
        test: /\.(js|ts)x?$/,
        include: [
          /node_modules\/(react-native-reanimated|react-native-worklets)/,
          /code\/core\/animations-reanimated/,
        ],
        use: {
          loader: 'babel-loader',
          options: {
            configFile: true,
          },
        },
      },
      {
        oneOf: [
          {
            test: /\.(ts|js)x?$/,
            use: [
              {
                loader: 'esbuild-loader',
                options: {
                  target: 'es2020',
                  loader: 'tsx',
                  minify: false,
                },
              },
            ],
          },

          {
            test: /\.css$/,
            use: ['style-loader', 'css-loader'],
          },

          // Webpack 5 handles assets itself: inline under 8kB, emit a file above
          // it — the same rule url-loader used to apply. url-loader handed
          // css-loader an ES module namespace instead of the URL string, so
          // every @font-face in the app resolved to url("[object Module]") and
          // not one face ever loaded. Measured in the browser: seven faces
          // registered, all of them `error`, and no request for any of them.
          {
            test: /\.(gif|jpe?g|png|svg|ttf|otf|woff2?|bmp|webp)$/i,
            type: 'asset',
            parser: { dataUrlCondition: { maxSize: 8192 } },
          },
        ],
      },
    ],
  },
  plugins: [
    new GuiPlugin({
      config: './src/hanzogui.config.ts',
      components: ['@hanzo/gui', '@hanzogui/sandbox-ui'],
      importsWhitelist: ['constants.js'],
      disableExtraction,
    }),
    isProduction ? null : new ReactRefreshWebpackPlugin(),
    new webpack.DefinePlugin({
      __DEV__: NODE_ENV === 'development' ? 'true' : 'false',
      process: {
        env: {
          NODE_ENV: JSON.stringify(NODE_ENV),
          __DEV__: NODE_ENV === 'development' ? 'true' : 'false',
          DEBUG: JSON.stringify(process.env.DEBUG || '0'),
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: `./index.html`,
    }),
  ].filter(Boolean),
}
