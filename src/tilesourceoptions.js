'use strict';

var UPNG = require('upng-js');

var filterAjaxResponse = function(response) {

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
  return new window.Blob([new Uint8Array(response)]);
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
    filterAjaxResponse: filterAjaxResponse,
    many_channel_color: channel.many_channel_color,
    many_channel_range: channel.many_channel_range,
    many_channel_id: channel.many_channel_id,
    many_channel_active: selected,
    many_channel_bitdepth: 8,
    crossOriginPolicy: 'Anonymous',
    buildPyramid: false,
    type: 'image',
    url: url
  }
};


