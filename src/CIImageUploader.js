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
    if (opt.file instanceof File) {
      this._log('upload', 'File')
      this._uploadFile(opt)
    }
    else if (opt.file instanceof Blob) {
      this._log('upload', 'Blob')
      this._uploadFile(opt)
    }
    else if (typeof opt.file == 'string') {
      this._log('upload', 'String')
      this._uploadString(opt)
    }
  },

  _request() {
    return (window.$) ? $.ajax : null
  },

  _uploadFile(opt) {
    const api = opt.api || this.api
    const request = opt.request || this._request()
    const formData = this._createFormData(opt.fileName || this.fileName, opt.file, opt.params)
    const timeout = parseInt(opt.timeout) || this.timeout

    alert('uploading...')
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

  _uploadString(opt) {
    const that = this
    const api = opt.api || this.api
    const request = opt.request || this._request()
    const timeout = parseInt(opt.timeout) || this.timeout

    let data = opt.file
    let params = opt.params

    this._dataURLtoBlob(data, function (err, blob) {
      if (err) {
        opt.onError && opt.onError(err)
        return
      }

      const formData = that._createFormData(opt.fileName || that.fileName, blob, params)

      request({
        type: 'POST',
        url: api,
        dataType: 'text',       // 决绝跨域POST问题
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
          opt.onError && opt.onError(err)
        }
      })
    })
  },

  _createFormData(fileName, file, params) {
    // https://developer.mozilla.org/en-US/docs/Web/API/FormData/append

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
    opt.maxWidth = parseInt(opt.maxWidth) || 1280
    opt.targetType = opt.targetType || 'DATA'

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
    this._log('_compress', opt)
    const that = this

    let img = new Image()
    img.onload = function () {
      if (img.width <= opt.maxWidth) {
        that._log('_compress', "don't need compressing")
        callback(null, imageData)
        return
      }

      const ratio = img.width / img.height
      img.width = opt.maxWidth
      img.height = parseInt(opt.maxWidth / ratio)

      alert(img.width + ', ' + img.height)

      if (!EXIF) {
        callback('EXIF undefinde')
      }

      // try {
        EXIF.getData(img, function () {
          let step = 0     // 旋转步数
          let degree = 0   // 旋转弧度
          let exif = EXIF.pretty(this)
          // that._log('exif', exif)

          if (exif) {
            // var make = EXIF.getTag(this, 'Make')
            const orientation = EXIF.getTag(this, 'Orientation')
            if (orientation) {
              switch (orientation) {
                case 6:       // 相机垂直
                  step = 1    // 图片为270度 需要旋转90度
                  break
                case 3:       // 相机旋转90度
                  step = 2    // 图片为270度 需要旋转180度
                  break;
                case 8:       // 相机旋转180度
                  step = 3    // 图片为270度 需要旋转180度
                  break;
                case 1:       // 相机旋转270度
                  step = 0    // 图片为270度 需要旋转0度
                  break
              }
              degree = 90 * step * Math.PI / 180
            }

            // alert(orientation + ' - ' + step)
          }

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
            alert('to Data')
            // canvas.toDataURL(type, encoderOptions);
            callback(null, canvas.toDataURL('image/jpeg'))   // 默认大于0.9
          }
          else if (opt.targetType.toUpperCase() == 'BLOB') {
            that._log('_compress', 'to BLOB')
            alert('to Blob')
            // canvas.toBlob(callback, mimeType, qualityArgument);
            canvas.toBlob(function (blob) {
              callback(null, blob)
            })
          }

          ctx = null
          canvas = null
        })
      // }
      // catch (err) {
      //   console.log('no exif')
      //   done(err, imageData)
      //   // alert('exif error: ' + err)
      //   // canvas.width = img.width
      //   // canvas.height = img.height
      //   // ctx.drawImage(img, 0, 0, img.width, img.height)
      //   //
      //   // if (typeof callback === 'function') {
      //   //   callback(canvas.toDataURL('image/jpeg'));   // 默认大于0.9
      //   // }
      // }
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

  // https://github.com/ebidel/filer.js/blob/master/src/filer.js#L137
  _dataURLtoBlob(dataURL, callback) {
    const BASE64_MARKER = ';base64,'
    let parts, contentType, raw

    if (dataURL.indexOf(BASE64_MARKER) === -1) {
      parts = dataURL.split(',')
      contentType = parts[0].split(':')[1]
      raw = decodeURIComponent(parts[1])

      try {
        callback(null, new Blob([raw], { type: contentType }))
      }
      catch (err) {
        callback(err)
      }

      return
    }

    parts = dataURL.split(BASE64_MARKER)
    contentType = parts[0].split(':')[1]
    raw = window.atob(parts[1])

    const rawLength = raw.length
    const uInt8Array = new Uint8Array(rawLength)

    for (let i = 0; i < rawLength; i++) {
      uInt8Array[i] = raw.charCodeAt(i)
    }

    try {
      callback(null, new Blob([uInt8Array], { type: contentType }))
    }
    catch (err) {
      callback(err)
    }
  },

  _log(sender, info) {
    if (this.isDebug) {
      console.log('CIImageUploader', sender, info)
    }
  }
}
