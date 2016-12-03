/**
 * @fileoverview demo
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

import CIImageUploader from 'ci-image-uploader'
CIImageUploader.debug()
window.CIImageUploader = CIImageUploader

let uploadApi = 'http://test2016.jiheapp.com/v1/image/img_upd'

const $file = document.getElementById('file')
const $image = document.getElementById('image')

$file.addEventListener('change', function (evt) {
  const files = evt.target.files
  console.log('$file.change', files)

  if (files[0]) {
    CIImageUploader.compress(files[0], {
      quality: 90,
      maxSize: 1280,
    }, function (err, blob) {
      console.log('compress', err, typeof blob, blob instanceof Blob)
      if (err) {
        alert(JSON.stringify(err))
      }
      else {
        upload(blob)
      }
    })
    // upload(files[0])
  }
})

function upload(file) {
  CIImageUploader.upload(file, {
    api: uploadApi,
    params: {
      token: 'Zjuc4zggxNj7asDZ',
      customer_id: '43841',
      dir: 2
    }
  }, function (err, res) {
    console.log('upload', err, res)
    if (err) {
      alert(JSON.stringify(err))
    }
    else {
      $image.src = res.data.img
    }
  })
}
