/**
 * @fileoverview demo webpack config
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

var path = require('path')

module.exports = {
  entry: {
    'main': path.resolve(__dirname, './main.js')
  },

  output: {
    path: path.resolve(__dirname, './js'),
    publicPath: '/js/',
    filename: '[name].bundle.js'
  },

  resolve: {
    extensions: ['', '.js'],
    fallback: [path.join(__dirname, '../node_modules')],
    alias: {
      'ci-image-uploader': path.resolve(__dirname, '../dist/ci-image-uploader.amd.js')
    }
  },

  module: {
    loaders: [
      {
        // use babel-loader for *.js files
        test: /\.js$/,
        loader: 'babel',
        // important: exclude files in node_modules
        // otherwise it's going to be really slow!
        exclude: /node_modules/,
        // query: {
        //   presets: ['es2015'],
        //   plugins: ['transform-runtime']
        // }
      }
    ]
  },

  devServer: {
    historyApiFallback: true,
    noInfo: true
  },

  // if you are using babel-loader directly then
  // the babel config block becomes required.
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
