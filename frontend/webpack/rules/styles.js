module.exports = {
  cssLoader: {
    loader: 'css-loader',
    options: {
      esModule: true,
      modules: {
        namedExport: true
      }
    }
  },
  sassLoader: {
    loader: 'sass-loader',
    options: {
      implementation: require('sass') // Prefer `dart-sass`
    }
  }
}
