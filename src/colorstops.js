var is_active = s => s.many_channel_active;

var get_active_in_world = function(world) {

  for (var i = 0; i < world.getItemCount(); i++) {
    var tileSource = world.getItemAt(i).source;
    if (is_active(tileSource))
      return tileSource;
  }
}

var get_active_in_sources = function(tileSources) {

  return tileSources.filter(is_active)[0];
}

function define_gradient(elem, color, val0, val1) {
  //
  // elem: div element containing canvas and two inputs
  // color: list of 3 rgb integers
  // val0: minimum position of range
  // val1: maximum position of range

  var canvas = elem.querySelector('canvas');
  var context = canvas.getContext('2d');
  var grad = context.createLinearGradient(0, 0, canvas.width, 0);

  // Color stop always starts at black
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(val0, 'rgba(0,0,0,1)');

  // Color stop ends at given color
  var u8_color = color.map(x => Math.round(x * 255));
  var color_string = 'rgba(' + u8_color.join() + ',1)';
  grad.addColorStop(val1, color_string);
  grad.addColorStop(1, color_string);

  context.fillStyle = grad;
  context.fillRect(0, 0, canvas.width, canvas.height); 
}

function update_color_range(e) {
  //
  // this: openseadragon.viewer
  // e: oninput event
  //

  var elem = e.target.parentNode;
  var sliders = elem.querySelectorAll('input');
  var val0 = parseFloat(sliders[0].value);
  var val1 = parseFloat(sliders[1].value);

  // avoid slider overlap
  if (val0 >= val1) {
    if (e.target == sliders[0]) {
      sliders[1].value = val0 + 0.1;
    }
    else {
      sliders[0].value = val1 - 0.1;
    }
    return;
  }

  // set the range in first tiledimage
  var tileSource = get_active_in_world(this.world);
  tileSource.many_channel_range = [val0, val1];

  // Draw to the canvas for feedback
  var color = tileSource.many_channel_color;
  define_gradient(elem, color, val0, val1);

	// trigger world animation 
  for (var i = 0; i < this.world.getItemCount(); i++) {  
    var tiled_image = this.world.getItemAt(i);
    tiled_image._needsDraw = true;
  }
  this.world.update();
}

window.attach_color_events = function(elem, viewer) {
  // 
  // elem: div element containing canvas and two inputs
  // viewer: openseadragon.viewer

  var color_inputs = elem.querySelectorAll('input');
  for (var i = 0; i < color_inputs.length; i++) {
    var color_input = color_inputs[i];
    color_input.oninput = update_color_range.bind(viewer);
  }

  // Set up initial gradient for first tileSource
  var tileSource = get_active_in_sources(viewer.tileSources);
  var color = tileSource.many_channel_color;
  var range = tileSource.many_channel_range;
  define_gradient(elem, color, ...range);
}
