/**
 * @fileoverview CIImage
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

class CIImage {
  constructor(src, done) {
    this.ver = '0.0.0'
    this._image = null

    if (typeof src == 'string') {
      this.initWithUrl(src, done)
    }
  }

  initWithUrl(src, done) {
    const that = this
    const image = new Image()
    image.onload = function (evt) {
      that._image = image
      done.call(this, that)
    }
    image.src = src
  }
}

module.exports = CIImage
