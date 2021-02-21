const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const styles = require('./rules/styles')

const config = {
  mode: 'production',
  output: {
    filename: 'static/[name].[fullhash].js'
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: true,
              modules: {
                namedExport: true
              }
            }
          },
          styles.cssLoader,
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'postcss-preset-env',
                    {
                      // Options
                    }
                  ]
                ]
              }
            }
          },
          styles.sassLoader
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].[fullhash].css'
    })
  ]
}

module.exports = config
