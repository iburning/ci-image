/**
 * @fileoverview demo
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

import CIImageUploader from 'ci-image-uploader'
CIImageUploader.isDebug = true

let uploadApi = 'http://test2016.jiheapp.com/v1/image/img_upd'

const $file = document.getElementById('file')
$file.addEventListener('change', function (evt) {
  const files = evt.target.files
  console.log('$file.change', files)

  if (files[0]) {
    CIImageUploader.compress(files[0], { targetType: 'Blob'}, function (err, blob) {
      console.log('compress', err, typeof blob, blob instanceof Blob)
      upload(blob)
    })

    // upload(files[0])

    function upload(file) {
      CIImageUploader.upload({
        api: uploadApi,
        file: file,
        params: {
          token: 'Zjuc4zggxNj7asDZ',
          customer_id: '43841',
          dir: 2
        },
        didUpload(res) {
          console.log('didUpload', res)
        },
        onError(err) {
          console.log('onError', err)
        }
      })
    }
  }

})
