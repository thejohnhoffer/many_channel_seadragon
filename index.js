var OSDGL = require('viawebgl').openSeadragonGL;
var OpenSeadragon = require('openseadragon');
var get_defaults = require("./src/defaults.js")

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
  },

  define_interface: function(_viewer){
    // Prepare user interface elements

    var composite_menu = document.getElementById("many-channel-composite-menu");
    var margin_menu = document.getElementById("many-channel-margin-menu");

    // Move the many channel menus to openseadragon buttons bar
    var anchor = {anchor: OpenSeadragon.ControlAnchor.TOP_LEFT}
    _viewer.addControl(document.getElementById('many-channel-menus'), anchor);

    // Change type of blending
    composite_menu.onchange = function() {
      var world = _viewer.world;
      
      // Actually read selected value from list
      var composite_operation = this.options[ this.selectedIndex ].value;
      if (composite_operation == "Null")
        composite_operation = null;

      // Set composite operation of all tiled images
      for (var i = 0; i < world.getItemCount(); i++) {
        var tiled_image = world.getItemAt(i);
        tiled_image.compositeOperation = composite_operation;
        tiled_image._needsDraw = true;
      }
      world.update();
    };

    // Change size of margins
    margin_menu.onchange = function() {

      var world = _viewer.world;
      var row_count =  window.many_channel.defaults.rows;
      var tile_size =  window.many_channel.defaults.tileSize;

      // Actually read selected value from list
      var margin_size = parseInt(this.options[ this.selectedIndex ].value);

      // Set margin size to selected value from list
      world.arrange({
        tileMargin: margin_size,
        tileSize: tile_size,
        rows: row_count,
      });

      // Pan to the center of the world
      var center = world.getHomeBounds().getCenter();
      _viewer.viewport.panTo(center);
    };
  },

  load_gl: function(program) {
    // Set up parameters to draw each tile

    // Turn on additive blending
    this.gl.enable(this.gl.BLEND);
    this.gl.blendEquation(this.gl.FUNC_ADD);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE);

    // Uniform variable for coloring
    this.u_tile_color = this.gl.getUniformLocation(program, 'u_tile_color');
    this.u_tile_range = this.gl.getUniformLocation(program, 'u_tile_range');
    this.u_bitdepth = this.gl.getUniformLocation(program, 'u_bitdepth');
  },

  draw_gl: function() {
    // Use parameters to draw each tile
 
    // Send color and range to shader
    this.gl.uniform3fv(this.u_tile_color, this.color_3fv);
    this.gl.uniform2fv(this.u_tile_range, this.range_2fv);
    this.gl.uniform1i(this.u_bitdepth, this.bitdepth_1i);

    // Clear before each draw call
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
  },

  draw_tile: function(callback, e) {
    // Read parameters from each tile 

    var tile = e.tile;
    var via = this.viaGL;
    var viewer = this.openSD;
    var image = e.tiledImage;
    var source = image.source;

    // Store channel color and range to send to shader
    via.color_3fv = new Float32Array(source.many_channel_color);
    via.range_2fv = new Float32Array(source.many_channel_range);
    via.bitdepth_1i = source.many_channel_bitdepth;
 
    // Start webGL rendering
    callback(e)
  },

  link_webgl: function(_viewer) {
    // Connect the viewer to webgl shaders

    // Define interface to shaders
    var seaGL = new openSeadragonGL(_viewer);
    seaGL.vShader = 'static/vert.glsl';
    seaGL.fShader = 'static/frag.glsl';

    // Bind webGL event handlers
    seaGL.addHandler('tile-drawing', window.many_channel.draw_tile);
    seaGL.addHandler('gl-drawing', window.many_channel.draw_gl);
    seaGL.addHandler('gl-loaded', window.many_channel.load_gl);

    // Add a custom button
    seaGL.button({
      prefix: window.many_channel.defaults.prefixUrl,
      tooltip: 'Toggle shaders',
      name: 'button'
    });
    seaGL.init();
  }
}

window.onload = function() {

  // Set up channel list from the url
  var defaults = get_defaults(window.location.pathname);
  var tileSources = window.read_source_list(defaults);

  // Set up openseadragon viewer
  var viewer = OpenSeadragon({
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

  // Start up webgl filters
  window.many_channel.link_webgl(viewer);

  // Set up the behavior of demo menus
  window.many_channel.define_interface(viewer);

  // Set up color sliders
  var color_slider = document.getElementById('many-channel-color-slider');
  window.attach_color_events(color_slider, viewer);

}
