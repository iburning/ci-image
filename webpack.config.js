/**
 * @fileoverview webpack config
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

module.exports = {
  entry: {
    'ci-image-uploader': './src/CIImageUploader.js'
  },

  output: {
    path: './dist',
    filename: '[name].js',
    library: 'CIImageUploader',
    libraryTarget: 'var'  // Export by setting a variable: var Library = xxx (default)
  },

  module: {
    loaders: [
      {
        // use babel-loader for *.js files
        test: /\.js$/,
        loader: 'babel',
        // important: exclude files in node_modules
        // otherwise it's going to be really slow!
        exclude: /node_modules/
      }
    ]
  },

  // devtool: '#eval-source-map',

  // if you are using babel-loader directly then
  // the babel config block becomes required.
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime']
  }
}
