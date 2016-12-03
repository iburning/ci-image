var CIImage =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	/**
	 * @fileoverview CIImage
	 * @author: burning <www.cafeinit.com>
	 * @version: 2016-12-01
	 */

	// import EXIF from 'exif-js'

	exports.default = {
	  var: '0.0.0',

	  loadImage: function loadImage(src, callback) {
	    var img = new Image();
	    img.onload = function () {
	      callback && callback.call(this, img);
	    };
	    img.src = src;
	  },
	  getData: function getData(img, callback) {
	    EXIF.getData(img, callback);
	  },
	  _getData: function _getData(img, callback) {
	    function handleBinaryFile(binFile) {
	      var data = findEXIFinJPEG(binFile);
	      var iptcdata = findIPTCinJPEG(binFile);
	      img.exifdata = data || {};
	      img.iptcdata = iptcdata || {};

	      callback && callback.call(img);
	    }

	    if (img.src) {
	      if (/^data\:/i.test(img.src)) {
	        // Data URI
	        console.log('CIImage._getData URI');
	        // var arrayBuffer = base64ToArrayBuffer(img.src);
	        // handleBinaryFile(arrayBuffer);
	      } else if (/^blob\:/i.test(img.src)) {
	        // Object URL
	        console.log('CIImage._getData URL');
	        // var fileReader = new FileReader();
	        // fileReader.onload = function(e) {
	        //   handleBinaryFile(e.target.result);
	        // };
	        // objectURLToBlob(img.src, function (blob) {
	        //   fileReader.readAsArrayBuffer(blob);
	        // });
	      } else {
	        (function () {
	          console.log('CIImage._getData Request');
	          var http = new XMLHttpRequest();
	          http.onload = function () {
	            if (this.status == 200 || this.status === 0) {
	              handleBinaryFile(http.response);
	            } else {
	              throw 'Could not load image';
	            }
	            http = null;
	          };
	          http.open('GET', img.src, true);
	          http.responseType = 'arraybuffer';
	          http.send(null);
	        })();
	      }
	    } else if (window.FileReader && (img instanceof window.Blob || img instanceof window.File)) {
	      var fileReader = new FileReader();
	      fileReader.onload = function (e) {
	        if (debug) console.log("Got file of length " + e.target.result.byteLength);
	        handleBinaryFile(e.target.result);
	      };

	      fileReader.readAsArrayBuffer(img);
	    }
	  }
	};

/***/ }
/******/ ]);