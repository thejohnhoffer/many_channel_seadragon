'use strict';
var AmazonWebSource = require('./amazonwebsource.js');

/**
 * Convert rendering parameters to tiledSource Options
 * @param {Object} channel: Parameters to render channel
 * @param {string} url: Url of this channel's source
 * @param {boolean} selected: If this channel is active
 * @param {Object} aws: Credentials to access aws
 *
 * @return {Oject} tileSource Options
 */

const getTileName = (x, y, level, channel) => {
  return "C" + channel + "-T0-Z0-L" + level + "-Y" + y + "-X" + x + ".png";
}

const getTileUrl = function(l, x, y) {
  var level = this.maxLevel - l;
  var url = this.many_channel_url;
  var channel = this.many_channel_id;

  var name = getTileName(x, y, level, channel);
  return url + '/' + name;
} 

module.exports = function(channel, url, type, selected,
                          credentials) {
  var output = {
    many_channel_color: channel.many_channel_color,
    many_channel_range: channel.many_channel_range,
    many_channel_id: channel.many_channel_id,
    many_channel_active: selected
  }
  // Single image
  if (type == "image") {
    output.buildPyramid = false; 
    output.type = "image";
    output.url = url;
    return output;
  } 

  // Many channels in tiled image
  output.getTileUrl = getTileUrl;
  output.many_channel_url = url;
  output.tileSize = 1024;
  output.height = 4080;
  output.width = 7220;
  output.minLevel = 0;
  output.maxLevel = 3;

  // AWS image source
  if (type == "aws") {
    var aws = new AmazonWebSource(credentials);
    output.makeAjaxRequest = aws.makeAjaxRequest; 
  }

  return output;
};
