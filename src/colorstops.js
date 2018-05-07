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
  //avoids slider overlap
  var colorstops = e.target.parentNode;
  var sliders = colorstops.querySelectorAll('input');
  var val0 = parseFloat(sliders[0].value);
  var val1 = parseFloat(sliders[1].value);

  if (val0 >= val1) {
    if (e.target == sliders[0]) {
      sliders[1].value = val0 + 0.1;
    }
    else {
      sliders[0].value = val1 - 0.1;
    }
  }

  define_gradient(colorstops, val0, val1);
}

window.attach_color_events = function(colorstops) {

  var color_inputs = colorstops.querySelectorAll('input');
  for (var i = 0; i < color_inputs.length; i++) {
    var color_input = color_inputs[i];
    color_input.oninput = update_color_range;
  }
  define_gradient(colorstops, 0, 1);
}
