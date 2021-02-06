const commonPaths = require('./common-paths');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');
const MomentTimezoneDataPlugin = require('moment-timezone-data-webpack-plugin');

const config = {
  entry: {
    vendor: ['semantic-ui-react']
  },
  output: {
    path: commonPaths.outputPath,
    publicPath: '/'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ["@babel/preset-env"],
        },
      }
    ]
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        },
        vendor: {
          chunks: 'initial',
          test: 'vendor',
          name: 'vendor',
          enforce: true
        }
      }
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `public/index.html`,
      favicon: `public/favicon.ico`
    }),
    new MomentLocalesPlugin(),
    new MomentTimezoneDataPlugin({
      matchZones: ['Etc/UTC'],
      startYear: 2020,
      endYear: 2025,
    }),
  ]
};

module.exports = config;
