/**
 * @fileoverview CIImage
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

// import EXIF from 'exif-js'

export default {
  var: '0.0.0',

  loadImage(src, callback) {
    const img = new Image()
    img.onload = function () {
      callback && callback.call(this, img)
    }
    img.src = src
  },


  getData(img, callback) {
    EXIF.getData(img, callback)
  },

  _getData(img, callback) {
    function handleBinaryFile(binFile) {
      var data = findEXIFinJPEG(binFile)
      var iptcdata = findIPTCinJPEG(binFile);
      img.exifdata = data || {}
      img.iptcdata = iptcdata || {}

      callback && callback.call(img)
    }

    if (img.src) {
      if (/^data\:/i.test(img.src)) {         // Data URI
        console.log('CIImage._getData URI')
        // var arrayBuffer = base64ToArrayBuffer(img.src);
        // handleBinaryFile(arrayBuffer);
      }
      else if (/^blob\:/i.test(img.src)) {    // Object URL
        console.log('CIImage._getData URL')
        // var fileReader = new FileReader();
        // fileReader.onload = function(e) {
        //   handleBinaryFile(e.target.result);
        // };
        // objectURLToBlob(img.src, function (blob) {
        //   fileReader.readAsArrayBuffer(blob);
        // });
      }
      else {
        console.log('CIImage._getData Request')
        let http = new XMLHttpRequest()
        http.onload = function () {
          if (this.status == 200 || this.status === 0) {
            handleBinaryFile(http.response);
          }
          else {
            throw 'Could not load image'
          }
          http = null
        }
        http.open('GET', img.src, true)
        http.responseType = 'arraybuffer'
        http.send(null)
      }
    }
    else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
        var fileReader = new FileReader();
        fileReader.onload = function(e) {
            if (debug) console.log("Got file of length " + e.target.result.byteLength);
            handleBinaryFile(e.target.result);
        };

        fileReader.readAsArrayBuffer(img);
    }
  }
}
