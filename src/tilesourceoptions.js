'use strict';

var OpenSeadragon = require('openseadragon');
var UPNG = require('upng-js');

var makeRequest = function(url) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";
    xhr.open("GET", url);
    xhr.onload = function () {
      if (this.status >= 200 && this.status < 300) {
        resolve(xhr.response);
      } else {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      }
    };
    xhr.onerror = function () {
      reject({
        status: this.status,
        statusText: xhr.statusText
      });
    };
    xhr.send();
  });
}

async function getTileUrl(level, x, y) {

	var request = makeRequest(this.many_channel_url);

	return await request.then(function(response){
    return filterResponse(response);
	});
}

var filterResponse = function(response) {
  // Decode png into rgba channels
  var img  = UPNG.decode(response); 
  var h = img.height;
  var w = img.width;

  // Handle grayscale 16-bit pngs
  if (img.ctype == 0 && img.depth == 16) {
    var out_img = new Uint8Array(4 * h * w);

    // Send large byte to red, small byte to green
    for (var i = 0; i < h*w; i++) {
      out_img[4 * i] = img.data[2 * i];
      out_img[4 * i + 1] = img.data[2 * i + 1];
    }

    // Encode as RGBA png and flag in tileSource
    response = UPNG.encodeLL([out_img], w, h, 3, 1, 8);
    this.source.many_channel_bitdepth = 16;
  }
  // Return filestream for png
  var blb = new window.Blob([new Uint8Array(response)]);
  return window.URL.createObjectURL(blb);
}

/**
 * Convert rendering parameters to tiledSource Options
 * @param {Object} channel: Parameters to render channel
 * @param {string} url: Url of this channel's source
 * @param {boolean} selected: If this channel is active
 *
 * @return {Oject} tileSource Options
 */
module.exports = function(channel, url, selected) {
  return {
    getTileUrl: getTileUrl,
    many_channel_color: channel.many_channel_color,
    many_channel_range: channel.many_channel_range,
    many_channel_id: channel.many_channel_id,
    many_channel_active: selected,
    many_channel_bitdepth: 8,
    many_channel_url: url,
    height: 1024*1,
    width:  1024*1,
    tileSize: 1024,
    minLevel: 0,
    maxLevel: 0
  }
};


