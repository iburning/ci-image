/**
 * @fileoverview demo
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

import CIImage from 'ci-image'

let src = 'http://img12.360buyimg.com/cms/jfs/t4087/29/78270449/95294/2bf5e226/583b86e5N5886c370.jpg'
src = './img/rock_star.jpg'

CIImage.loadImage(src, function (img) {
  console.log('loadImage', img, img.exifdata)

  CIImage.getData(img, function (data) {
    console.log('getData', data)
  })
})
