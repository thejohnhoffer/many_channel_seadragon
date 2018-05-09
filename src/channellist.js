var make_channel_list = function(hash) {
  // Return list of channel rendering parameters
  //
  // hash: string like 0,FF0000,0,1/0,00FF00,0.1,0.5/...

  if (hash == "")
    return [];

  // All channels separated by slash
  var channels = hash.split('/');
  return channels.map(function(channel) {
    var [id, hex, min, max] = channel.split(',');
    return {
      'many_channel_id': parseInt(id),
      'many_channel_range': [min, max].map(parseFloat),
      'many_channel_color': [
        parseInt(hex.substr(0,2), 16) / 255,
        parseInt(hex.substr(2,2), 16) / 255,
        parseInt(hex.substr(4,2), 16) / 255
      ]
    }
  });
}

var make_url_hash = function(query) {
  // Return hash givin source url by channel
  // 
  // query: string like src=...&10src=...
  
  // Default source as image
  var sources = {
    src: 'image.png',
    active: 0,
  }

  // Queries set sources
  query.split('&').forEach(function(entry) {
    var [key, value] = entry.split('=');
    
    // Set active entry
    if (key == 'active') {
      sources.active = parseInt(value);
    }

    // Use entries ending with src
    if (key.slice(-3) == 'src') {

      // Specific source has a number
      if (parseInt(key))
        sources[parseInt(key)] = value;

      // Default source has no number
      else
        sources.src = value; 
    }
  });

  return sources
}

var channel_to_source = function(channel, order) {
  // Convert rendering parameters to tiled image
  //
  // this: Object hashing channel index to url source
  // channel: rendeing parameters for channel
  // order: order of channel in sequence

  // Set URL for static image source
  return {
    url: this[order] || this.src,
    many_channel_color: channel.many_channel_color,
    many_channel_range: channel.many_channel_range,
    many_channel_id: channel.many_channel_id,
    many_channel_active: order == this.active,
    crossOriginPolicy: 'Anonymous',
    buildPyramid: false,
    type: 'image',
  };
}

window.read_source_list = function(elem) {
  // Return list of tileSource channels for openseadragon
  //
  // elem: the html div listing editable sources

  // Set default hash for channel rendering
  var hash = window.location.hash.slice(2);
  hash = hash || "0,FF0000,0,1/0,00FF00,0,1";

  // Set default query for channel urls
  var search = window.location.search.slice(1)
  var query = "0src=/minerva-test-images/png_tiles/C0-T0-Z0-L0-Y2-X4.png&" +
    "1src=/minerva-test-images/png_tiles/C1-T0-Z0-L0-Y2-X4.png";
  if (search != '')
    query += '&' + search;

  // Parse channel parameters and urls from #hash?query
  var channel_list = make_channel_list(hash);
  var url_hash = make_url_hash(query);

  // Return all channel lists with correct urls
  return channel_list.map(channel_to_source.bind(url_hash));
}
