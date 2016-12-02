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

	/**
	 * @fileoverview CIImage
	 * @author: burning <www.cafeinit.com>
	 * @version: 2016-12-01
	 */

	function CIImage(src, done) {
	  console.log('CIImage.constructor', src, done);
	  this.ver = '0.0.0';
	  this.image = null;

	  if (typeof src == 'string') {
	    this.initWithUrl(src, done);
	  }
	}

	module.exports = CIImage;

	var prototype = CIImage.prototype;

	prototype.initWithUrl = function (src, done) {
	  console.log('CIImage.initWithUrl', src, done);
	  var that = this;
	  var image = new Image();
	  image.onload = function () {
	    that.image = image;
	    done.call(that);
	  };
	  image.src = src;
	};

/***/ }
/******/ ]);