var get_query_default = require("./defaults.js")
var TileSourceOptions = require('./tilesourceoptions.js');

var get_rendering_options = function(channel_hash) {
  // Reads rendering parameters from string
  //
  // hash: string like 0,FF0000,0,1

  var [id, hex, min, max] = channel_hash.split(',');

  return {
    'many_channel_id': parseInt(id),
    'many_channel_range': [min, max].map(parseFloat),
    'many_channel_color': [
      parseInt(hex.substr(0,2), 16) / 255,
      parseInt(hex.substr(2,2), 16) / 255,
      parseInt(hex.substr(4,2), 16) / 255
    ]
  }
}

var get_tilesource_options = function(hash, query) {
  // Return hash givin source url by channel
  // 
  // hash: string like 0,FF0000,0,1/0,00FF00,0.1,0.5/...
  // query: string like src=...&10src=...
  
  // No channels to render
  if (hash == "")
    return [];

  var source_type = "custom";
  var active_source = 0;
  var num_sources = 0;
  var source_urls = {};

  // Set active source, source urls
  query.split('&').forEach(function(entry) {
    var [key, value] = entry.split('=');
    
    // Set active entry
    if (key == 'active') {
      active_source = parseInt(value);
    }
    // Redefine source type
    if (key == 'type') {
      source_type = value;
    }

    // Use entries ending with src
    if (key.slice(-3) == 'src') {

      // Specific source has a number
      if (parseInt(key))
        source_urls[parseInt(key)] = value;

      // Default source has no number
      else
        source_urls.src = value;
    }
  });

  // Rendering parameters for each channel
  var channel_list = hash.split('/').map(get_rendering_options);

  // Create TileSource options for each channel
  return channel_list.map(function(channel, order) {
    
    var source_url = source_urls[order] || source_urls.src;
    var is_active = order == active_source;
    
    // Create a TileSourceOptions Object
    return TileSourceOptions(channel, source_url, source_type, is_active);
  });
}

window.read_source_list = function(elem) {
  // Return list of tileSource channels for openseadragon

  // Set default hash for channel rendering
  var hash = window.location.hash.slice(2);
  hash = hash || "0,FF0000,0,1/0,00FF00,0,1";

  // Set default query for channel urls
  var query = get_query_default(window.location.pathname) || "";
  var search = window.location.search.slice(1)
  if (search != '')
    query += '&' + search;

  // List of tileSource options from ?query#hash
  return get_tilesource_options(hash, query);
}
