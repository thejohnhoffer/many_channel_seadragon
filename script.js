// Try openseadragon on multiple images

window.onload = function() {

  OpenSeadragon({
    id: "many-channel-viewer",
    prefixUrl: "openseadragon_images/",
    compositeOperation: "lighter",
    debugMode: false,
    opacity: 0.5,

    collectionMode: true,
    collectionRows: 1,
    collectionTileSize: 720,
    collectionTileMargin: -720,

    /*Tile sources can be mixed*/
    tileSources: [
      {
        type: 'image',
        url: 'images/thick_bars.png'
      },
      {
        type: 'image',
        url: 'images/thin_bars.png'
      }
    ]
  })
}
