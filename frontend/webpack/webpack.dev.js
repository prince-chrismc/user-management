const webpack = require('webpack')
const styles = require('./rules/styles')

const port = process.env.PORT || 3000

const config = {
  mode: 'development',
  output: {
    filename: '[name].[fullhash].js'
  },
  devtool: 'eval',
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              esModule: true
            }
          },
          styles.cssLoader,
          styles.sassLoader
        ]
      }
    ]
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom'
    }
  },
  devServer: {
    host: 'localhost',
    port: port,
    historyApiFallback: true,
    hot: true,
    open: true
  }
}

module.exports = config
