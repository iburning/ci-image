/**
 * @fileoverview CIImageUploader
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-02
 */

export default {
  var: '0.0.0',
  api: '',
  fileName: 'file',
  timeout: 10000,
  isDebug: false,

  /**
   * @param file: Object        require
   * @param fileName: String    default = 'file'
   * @param params: Object      default = {}
   * @param api: String         default = this.api
   * @param timeout:Number      default = 10000
   * @param request: Object     default = this._request()
   * @param onUploading: Function
   * @param didUpload: Function(res)
   * @param onError: Function(err)
   */
  upload(opt) {
    const api = opt.api || this.api
    const request = opt.request || this._request()
    const timeout = parseInt(opt.timeout) || this.timeout

    let file = opt.file

    if (typeof file == 'string') {
      file = this._dataURLtoBlob(opt.file)
      if (!file) {
        opt.onError && opt.onError('dataURL to Blob fail')
        return
      }
    }

    const formData = this._createFormData(opt.fileName || this.fileName, file, opt.params)

    request({
      type: 'POST',
      url: api,
      dataType: 'text',     // 决绝跨域POST问题
      data: formData,
      timeout: timeout,
      processData: false,     // 不将 data 转换为字符串
      contentType: false,     // 默认'application/x-www-form-urlencoded', 通过设置 false 跳过设置默认值
      success(res) {
        if (typeof res === 'string') {
          res = JSON.parse(res)
        }
        opt.didUpload && opt.didUpload(res)
      },
      error(err) {
        alert(JSON.stringify(err))
        opt.onError && opt.onError(err)
      }
    })
  },

  _request() {
    return (window.$) ? $.ajax : null
  },

  // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append
  _createFormData(fileName, file, params) {
    if (fileName && file) {
      const formData = new FormData()
      formData.append(fileName, file)
      if (params) {
        for (var key in params) {
          formData.append(key, params[key])
        }
      }
      return formData
    } else {
      return null
    }
  },

  compress(img, opt, callback) {
    const that = this
    opt.quality = (parseInt(opt.quality) || 95) / 100
    opt.maxSize = parseInt(opt.maxSize) || 1280
    opt.targetType = opt.targetType || 'DATA'   // 'Blog 暂时不支持'

    if (img && img instanceof File) {
      this._readFile(img, function (err, data) {
        if (err) {
          callback(err)
        }
        else {
          that._compress(data, opt, callback)
        }
      })
    }
    else {
      that._compress(img, opt, callback)
    }
  },

  _compress(imageData, opt, callback) {
    // this._log('_compress', opt)
    const that = this

    let isRevolve = true
    if (typeof opt.isRevolve == 'boolean') {
      isRevolve = opt.isRevolve
    }


    let img = new Image()
    img.onload = function () {
      if (img.width <= opt.maxSize && img.height <= opt.maxSize) {
        that._log('_compress', "don't need compressing")
        callback(null, imageData)
        return
      }

      const ratio = img.width / img.height
      if (ratio >= 1) {
        img.width = opt.maxSize
        img.height = parseInt(opt.maxSize / ratio)
      }
      else {
        img.height = opt.maxSize
        img.width = parseInt(opt.maxSize * ratio)
      }


      if (isRevolve) {
        console.log('_compress isRevolve', isRevolve)
        that._getRevolveStep(img, function (err, step, degree) {
          if (err) {
            callback(err)
            return
          }

          _redraw(img, step, degree)
        })
        return
      }

      _redraw(img, 0, 0)

      function _redraw(img, step, degree) {
        let canvas = document.createElement('canvas')
        let ctx = canvas.getContext('2d')
        ctx.clearRect(0, 0, canvas.width, canvas.height)   // canvas清屏

        switch (step) {
          case 0:   // 不旋转
            canvas.width = img.width
            canvas.height = img.height
            ctx.rotate(degree)
            ctx.drawImage(img, 0, 0, img.width, img.height)
            break

          case 1:   // 旋转90度
            canvas.width = img.height
            canvas.height = img.width
            ctx.rotate(degree)
            ctx.drawImage(img, 0, -img.height, img.width, img.height)
            break

          case 2:   // 旋转180度
            canvas.width = img.width
            canvas.height = img.height
            ctx.rotate(degree)
            ctx.drawImage(img, -img.width, -img.height, img.width, img.height)
            break

          case 3:   // 旋转270度
            canvas.width = img.height
            canvas.height = img.width
            ctx.rotate(degree)
            ctx.drawImage(img, -img.width, 0, img.width, img.height)
            break
        }

        if (opt.targetType.toUpperCase() == 'DATA') {
          that._log('_compress', 'to DATA')
          // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toDataURL
          // canvas.toDataURL(type, encoderOptions);
          callback(null, canvas.toDataURL('image/jpeg'))   // 默认大于0.9
        }
        else if (opt.targetType.toUpperCase() == 'BLOB') {
          that._log('_compress', 'to BLOB')
          // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
          // canvas.toBlob(callback, mimeType, qualityArgument);
          canvas.toBlob(function (blob) {
            callback(null, blob)
          })
        }

        img = null
        ctx = null
        canvas = null
      }
    }

    img.src = imageData
  },

  _readFile(file, callback) {
    // https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL
    const that = this
    const reader = new FileReader()
    reader.onload = function (evt) {
      that._log('CIImageUploader.readFile', evt)
      callback(null, evt.target.result)
    }
    reader.readAsDataURL(file)
  },

  // 根据EXIF获取纠正旋转角度
  _getRevolveStep(img, callback) {
    const that = this

    if (!EXIF) {
      callback('EXIF is undefined')
      return
    }

    EXIF.getData(img, function () {
      let step = 0     // 旋转步数
      let degree = 0   // 旋转弧度
      let exif = EXIF.pretty(this)
      that._log('exif', exif)

      const orientation = EXIF.getTag(this, 'Orientation')
      that._log('_getRevolveStep orientation', orientation)

      // http://jpegclub.org/exif_orientation.html
      if (orientation) {
        switch (orientation) {
          case 5, 6:    // 手机垂直
            step = 1    // 图片为270度 需要旋转90度
            break
          case 3, 4:    // 手机旋转90度
            step = 2    // 图片为270度 需要旋转180度
            break;
          case 7, 8:    // 手机旋转180度
            step = 3    // 图片为270度 需要旋转180度
            break;
          case 1, 2:    // 手机旋转270度
            step = 0    // 图片为270度 需要旋转0度
            break
        }
        degree = 90 * step * Math.PI / 180
      }

      callback(null, step, degree)
    })
  },

  // // https://github.com/exif-js/exif-js/blob/master/exif.js#L319
  // _base64ToArrayBuffer(base64, contentType) {
  //   contentType = contentType || base64.match(/^data\:([^\;]+)\;base64,/mi)[1] || ''; // e.g. 'data:image/jpeg;base64,...' => 'image/jpeg'
  //   base64 = base64.replace(/^data\:([^\;]+)\;base64,/gmi, '');
  //
  //   var binary = atob(base64);
  //   var len = binary.length;
  //   var buffer = new ArrayBuffer(len);
  //   var view = new Uint8Array(buffer);
  //
  //   for (var i = 0; i < len; i++) {
  //     view[i] = binary.charCodeAt(i);
  //   }
  //
  //   return buffer;
  // },

  // https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
  _dataURLtoBlob(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
      var parts = dataURL.split(',');
      var contentType = parts[0].split(':')[1];
      var raw = decodeURIComponent(parts[1]);

      return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
  },

  _log(sender, info) {
    if (this.isDebug) {
      console.log('CIImageUploader', sender, info)
    }
  }
}
