var OpenSeadragon = require('openseadragon');
require('./openSeadragonGL')
require('./colorstops')

// Settings to overlap 720x720 pngs
window.many_channel = {
  defaults: {
    opacity: 1.0,
    rows: 1,
    tileSize: 720,
    tileMargin: -720,
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
        composite_operation = null

      // Set composite operation of all tiled images
      for (var i = 0; i < world.getItemCount(); i++) { 
        var tiled_image = world.getItemAt(i);
        tiled_image.compositeOperation = composite_operation
        tiled_image.reset();
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
  },

  draw_gl: function() {
    // Use parameters to draw each tile
 
    // Send color to shader
    var color_3fv = new Float32Array(this.rgb_color);
    this.gl.uniform3fv(this.u_tile_color, color_3fv);

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

    // Store channel color to send to shader
    via.rgb_color = source.many_channel_color;
 
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

  var viewer = OpenSeadragon({
    debugMode: false,
    collectionMode: true,
    id: "many-channel-viewer",
    showZoomControl: false,
    showHomeControl: false,
    showFullPageControl: false,

    opacity: window.many_channel.defaults.opacity,
    collectionRows: window.many_channel.defaults.rows,
    prefixUrl: window.many_channel.defaults.prefixUrl,
    collectionTileSize: window.many_channel.defaults.tileSize,
    collectionTileMargin: window.many_channel.defaults.tileMargin,
    compositeOperation: window.many_channel.defaults.compositeOperation,

    tileSources: [
      {
        type: 'image',
        url: 'images/bw_red.png',
        many_channel_color: [1, 0, 0],
        buildPyramid: false
      },
      {
        type: 'image',
        url: 'images/bw_green.png',
        many_channel_color: [0, 1, 0],
        buildPyramid: false
      }
    ]
  });
  // Start up webgl filters
  window.many_channel.link_webgl(viewer);

  // Set up the behavior of demo menus
  window.many_channel.define_interface(viewer);

  // Set up color sliders
  var color_slider = document.getElementById('many-channel-color-slider');
  window.attach_color_events(color_slider);
}
