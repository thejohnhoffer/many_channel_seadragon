precision mediump float;
uniform vec3 u_tile_color;
uniform vec2 u_tile_range;
uniform sampler2D u_tile;
varying vec2 v_tile_pos;

void main() {

  vec4 pixel_vals = texture2D(u_tile, v_tile_pos);
  float min_ = u_tile_range[0];
  float max_ = u_tile_range[1];

  // Threshhold pixel within range
  float pixel_val = clamp((pixel_vals[0] - min_) / (max_ - min_), 0.0, 1.0);

  // Color pixel value
  vec3 pixel_color = pixel_val * u_tile_color;
  gl_FragColor = vec4(pixel_color, 1.0);
}
