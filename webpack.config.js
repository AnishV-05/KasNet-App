const { ModuleFederationPlugin } = require('webpack').container
const { dependencies } = require('./package.json')
// const tsconfig = require('./tsconfig.json')
const path = require('node:path')
const { EsbuildPlugin } = require('esbuild-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const Dotenv = require('dotenv-webpack')
require('dotenv').config()

function mergeRules(config, rules) {
  rules.forEach(rule => {
    const existingRuleIndex = config.module.rules.findIndex(r => r.test.toString() === rule.test.toString())
    if (existingRuleIndex > -1) {
      config.module.rules[existingRuleIndex] = rule
      return
    }
    config.module.rules.push(rule)
  })
  return config
}
 
module.exports = (_, argv) => {
  const config = {
    entry: './src/main',
    mode: argv.mode,
    devServer: {
      static: path.join(__dirname, 'public'),
      port: 3200,
      hot: true,
      historyApiFallback: true,
    },
    output: {
      filename: '[name].[contenthash].js',
      chunkFilename: '[id].[chunkhash].js',
      path: path.resolve(__dirname, 'dist'),
      publicPath: 'auto',
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.jsx', '.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
      fallback: {
        http: require.resolve('stream-http'),
        stream: require.resolve('stream-browserify'),
        process: require.resolve('process/browser'),
        https: require.resolve('https-browserify'),
        zlib: require.resolve('browserify-zlib'),
        assert: require.resolve('assert'),
        timers: require.resolve('timers-browserify'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.svg$/,
          use: ['@svgr/webpack'],
        }
      ],
    },
    optimization: {
      minimize: false,
      minimizer: [
        new EsbuildPlugin({
          target: 'es2015',
          css: true,
        }),
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
      new ModuleFederationPlugin({
        name: 'home',
        filename: 'remoteEntry.js',
        exposes: {
          './index': './src/router',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: dependencies['react'] },
          'react-dom': { singleton: true, eager: true, requiredVersion: dependencies['react-dom'] },
          'react-router-dom': { singleton: true, eager: true, requiredVersion: dependencies['react-router-dom'] },
          i18next: { singleton: true, eager: true, requiredVersion: dependencies['i18next'] },
          'react-i18next': { singleton: true, eager: true, requiredVersion: dependencies['react-i18next'] },
        },
      }),
      new CopyPlugin({
        patterns: [
          {
            from: '**/*',
            to: './',
            context: 'public/',
            globOptions: {
              ignore: ['**/index.html', '**/favico.ico', '**/mockServiceWorker.js'],
            },
          },
        ],
      }),
      new Dotenv(),
    ],
  }
 
  // CSS / SCSS rule — ensure postcss-loader runs (Tailwind via postcss.config.js)
  const rules = [
    {
      test: /\.(scss|css)$/,
      use: [
        'style-loader',
        'css-loader',
        {
          loader: 'postcss-loader',
          options: {
            postcssOptions: {
              // ensure postcss uses your project config (tailwind + autoprefixer)
              config: path.resolve(__dirname, 'postcss.config.js'),
            },
          },
        },
        {
          loader: 'sass-loader',
          options: {
            // any sass-loader options you need can go here
          },
        },
      ],
    },
  ]
 
  return mergeRules(config, rules)
}