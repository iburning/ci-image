/**
 * @fileoverview webpack config
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

var config = require('./webpack.config.js')

config.output = {
  path: './dist',
  filename: '[name].amd.js',
  library: 'CIImageUploader',
  libraryTarget: 'amd'  // Export to AMD (optionally named - set the name via the library option)
  // libraryTarget: 'umd'  // Export to AMD, CommonJS2 or as property in root
}

module.exports = config
