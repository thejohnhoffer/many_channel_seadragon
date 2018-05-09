function define_gradient(colorstops, val0, val1) {

  var canvas = colorstops.querySelector('canvas');
  var context = canvas.getContext('2d');
  var grad = context.createLinearGradient(0, 0, canvas.width, 0);
  grad.addColorStop(0, 'rgba(0,0,0,1)');
  grad.addColorStop(val0, 'rgba(0,0,0,1)');
  grad.addColorStop(val1, 'rgba(255,0,0,1)');
  grad.addColorStop(1, 'rgba(255,0,0,1)');

  context.fillStyle = grad;
  context.fillRect(0, 0, canvas.width, canvas.height); 
}

function update_color_range(e) {
  //
  // this: openseadragon.viewer
  // e: oninput event
  //

  var colorstops = e.target.parentNode;
  var sliders = colorstops.querySelectorAll('input');
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

  // Draw to the canvas for feedback
  define_gradient(colorstops, val0, val1);

  // set the range in first openseadragon tiledimage
  var tiledImage = this.world.getItemAt(0);
  tiledImage.source.many_channel_range = [val0, val1];

	// trigger world animation 
  for (var i = 0; i < this.world.getItemCount(); i++) {  
    var tiled_image = this.world.getItemAt(i);
    tiled_image._needsDraw = true;
  }
  this.world.update();
}

window.attach_color_events = function(colorstops, viewer) {
  // 
  // colorstops: div element containing canvas and two inputs
  // viewer: openseadragon.viewer

  var color_inputs = colorstops.querySelectorAll('input');
  for (var i = 0; i < color_inputs.length; i++) {
    var color_input = color_inputs[i];
    color_input.oninput = update_color_range.bind(viewer);
  }
  define_gradient(colorstops, 0, 1);
}
