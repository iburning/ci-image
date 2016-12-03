define("CIImageUploader",[],function(){return function(e){function t(a){if(i[a])return i[a].exports;var n=i[a]={exports:{},id:a,loaded:!1};return e[a].call(n.exports,n,n.exports,t),n.loaded=!0,n.exports}var i={};return t.m=e,t.c=i,t.p="",t(0)}([function(e,t){"use strict";function i(e,t){d&&console.log("CIImageUploader",e,t)}function a(){return window.$?$.ajax:null}function n(e,t){var a=new FileReader;a.onload=function(e){i("CIImageUploader.readFile",e),t(null,e.target.result)},a.readAsDataURL(e)}function r(e,t,i){if(e&&t){var a=new FormData;if(a.append(e,t),i)for(var n in i)a.append(n,i[n]);return a}return null}function o(e,t,a){var n=!0;"boolean"==typeof t.isRevolve&&(n=t.isRevolve);var r=new Image;r.onload=function(){function o(e,n,r){var o=document.createElement("canvas"),s=o.getContext("2d");switch(s.clearRect(0,0,o.width,o.height),n){case 0:o.width=e.width,o.height=e.height,s.rotate(r),s.drawImage(e,0,0,e.width,e.height);break;case 1:o.width=e.height,o.height=e.width,s.rotate(r),s.drawImage(e,0,-e.height,e.width,e.height);break;case 2:o.width=e.width,o.height=e.height,s.rotate(r),s.drawImage(e,-e.width,-e.height,e.width,e.height);break;case 3:o.width=e.height,o.height=e.width,s.rotate(r),s.drawImage(e,-e.width,0,e.width,e.height)}"DATA"==t.targetType.toUpperCase()?(i("_compress","to DATA"),a(null,o.toDataURL("image/jpeg"))):"BLOB"==t.targetType.toUpperCase()&&(i("_compress","to BLOB"),o.toBlob(function(e){a(null,e)})),e=null,s=null,o=null}if(r.width<=t.maxSize&&r.height<=t.maxSize)return i("_compress","don't need compressing"),void a(null,e);var h=r.width/r.height;return h>=1?t.width>t.maxSize&&(r.width=t.maxSize,r.height=parseInt(t.maxSize/h)):t.height>t.maxSize&&(r.height=t.maxSize,r.width=parseInt(t.maxSize*h)),n?(console.log("_compress isRevolve",n),void s(r,function(e,t,i){return e?void a(e):void o(r,t,i)})):void o(r,0,0)},r.src=e}function s(e,t){return EXIF?void EXIF.getData(e,function(){var e=0,a=0,n=EXIF.pretty(this);i("exif",n);var r=EXIF.getTag(this,"Orientation");if(i("_getRevolveStep orientation",r),r){switch(r){case 5:case 6:e=1;break;case 3:case 4:e=2;break;case 7:case 8:e=3;break;case 1:case 2:e=0}a=90*e*Math.PI/180}t(null,e,a)}):void t("EXIF is undefined")}function h(e){var t=";base64,";if(e.indexOf(t)==-1){var i=e.split(","),a=i[0].split(":")[1],n=decodeURIComponent(i[1]);return new Blob([n],{type:a})}for(var i=e.split(t),a=i[0].split(":")[1],n=window.atob(i[1]),r=n.length,o=new Uint8Array(r),s=0;s<r;++s)o[s]=n.charCodeAt(s);return new Blob([o],{type:a})}e.exports={var:"0.0.0",api:"",fileName:"file",timeout:1e4,debug:function(){d=!0},upload:function(e,t,i){var n=t.api||this.api,o=t.request||a(),s=parseInt(t.timeout)||this.timeout;if("string"==typeof e&&(e=h(e),!e))return void i("dataURL to Blob fail");var d=r(t.fileName||this.fileName,e,t.params);o({type:"POST",url:n,dataType:"text",data:d,timeout:s,processData:!1,contentType:!1,success:function(e){"string"==typeof e&&(e=JSON.parse(e)),i(null,e)},error:function(e){i(e)}})},compress:function(e,t,i){t.quality=(parseInt(t.quality)||95)/100,t.maxSize=parseInt(t.maxSize)||1280,t.targetType=t.targetType||"DATA",e&&e instanceof File?n(e,function(e,a){e?i(e):o(a,t,i)}):o(e,t,i)}};var d=!1}])});