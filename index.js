var OpenSeadragon = require('openseadragon');
var get_defaults = require("./src/defaults.js");

require('./src/channellist.js');
require('./src/colorstops.js');

// Hard-code tiles of 1024 pixels
window.many_channel = {
  defaults: {
    opacity: 1.0,
    rows: 1,
    tileSize: 1024,
    tileMargin: -1024,
    compositeOperation: "lighter",
    prefixUrl: "images/openseadragon/"
  }
}

window.onload = function() {

  // Set up channel list from the url
  var defaults = get_defaults(window.location.pathname);
  var tileSources = window.read_source_list(defaults);

  // Set up openseadragon viewer
  var viewer = OpenSeadragon({
    maxZoomPixelRatio: defaults.maxZoomPixelRatio,
    debugMode: defaults.debug,
    collectionMode: true,
    id: "many-channel-viewer",
    showZoomControl: false,
    showHomeControl: false,
    showFullPageControl: false,
    loadTilesWithAjax: true,

    opacity: window.many_channel.defaults.opacity,
    collectionRows: window.many_channel.defaults.rows,
    prefixUrl: window.many_channel.defaults.prefixUrl,
    collectionTileSize: window.many_channel.defaults.tileSize,
    collectionTileMargin: window.many_channel.defaults.tileMargin,
    compositeOperation: window.many_channel.defaults.compositeOperation,

    tileSources: tileSources
  });

  // Set up color sliders
  var color_slider = document.getElementById('many-channel-color-slider');
  window.attach_color_events(color_slider, viewer);

}
