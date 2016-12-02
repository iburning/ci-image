/**
 * @fileoverview demo
 * @author: burning <www.cafeinit.com>
 * @version: 2016-12-01
 */

import CIImage from 'ci-image'

var src = 'http://img12.360buyimg.com/cms/jfs/t4087/29/78270449/95294/2bf5e226/583b86e5N5886c370.jpg'
var myImage = new CIImage(src, function (ciImage) {
  console.log(typeof ciImage, ciImage)
  let image = ciImage.image
  console.log(image.width, image.height, image.fileSize)
})
console.log(typeof myImage, myImage)
