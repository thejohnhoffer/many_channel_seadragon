precision mediump float;
uniform vec3 u_tile_color;
uniform sampler2D u_tile;
varying vec2 v_tile_pos;

void main() {

  vec4 image_values = texture2D(u_tile, v_tile_pos);
  vec3 image_color = image_values[1] * u_tile_color;
  gl_FragColor = vec4(image_color, 1.0);
}
