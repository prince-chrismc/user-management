const path = require('path')
const PROJECT_ROOT = path.resolve(__dirname, '../')

const commonPaths = {
  projectRoot: PROJECT_ROOT,
  outputPath: path.join(PROJECT_ROOT, 'dist'),
  appEntry: path.join(PROJECT_ROOT, 'src')
}

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin')
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin')

const config = {
  entry: {
    app: [`${commonPaths.appEntry}/index.tsx`]
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/'
  },
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  },
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    new MomentLocalesPlugin(),
    new MomentTimezoneDataPlugin({
      matchZones: ['Etc/UTC'],
      startYear: 2021,
      endYear: 2024
    })
  ]
}

module.exports = config
