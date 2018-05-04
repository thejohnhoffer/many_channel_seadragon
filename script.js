// Try openseadragon on multiple images

window.many_channel = {
  defaults: {
    opacity: 0.5,
    rows: 1,
    tileSize: 720,
    tileMargin: -720,
    compositeOperation: "lighter"
  }
}

window.onload = function() {

  window.many_channel.osd = OpenSeadragon({
    debugMode: false,
    collectionMode: true,
    id: "many-channel-viewer",
    prefixUrl: "openseadragon_images/",

    opacity: window.many_channel.defaults.opacity,
    collectionRows: window.many_channel.defaults.rows,
    collectionTileSize: window.many_channel.defaults.tileSize,
    collectionTileMargin: window.many_channel.defaults.tileMargin,
    compositeOperation: window.many_channel.defaults.compositeOperation,

    tileSources: [
      {
        type: 'image',
        url: 'images/red.png'
      },
      {
        type: 'image',
        url: 'images/green.png'
      }
    ]
  });
  // Move the many channel menus to openseadragon buttons bar
  var buttons_div = window.many_channel.osd.buttons.element;
  buttons_div.appendChild(document.getElementById('many-channel-menus'));

  var composite_menu = document.getElementById("many-channel-composite-menu");
  var margin_menu = document.getElementById("many-channel-margin-menu");

  composite_menu.onchange = function() {
    var world = window.many_channel.osd.world;
    
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

  margin_menu.onchange = function() {

    var world = window.many_channel.osd.world;
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
    window.many_channel.osd.viewport.panTo(center);
  };
}
