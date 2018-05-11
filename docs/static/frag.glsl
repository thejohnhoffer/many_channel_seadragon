precision mediump float;
uniform sampler2D u_tile;
uniform int u_bitdepth;

uniform vec3 u_tile_color;
uniform vec2 u_tile_range;
varying vec2 v_tile_pos;

float unpack_u16(vec4 pixel) {
  return (256. * pixel.r + pixel.g) / 257.;
}

void main() {

  vec4 pixel = texture2D(u_tile, v_tile_pos);
  float min_ = u_tile_range[0];
  float max_ = u_tile_range[1];

  // Take 8-bit from red
  float value = pixel.r;

  // Take 16-bit from red, alpha
  if (u_bitdepth == 16) {
    value = unpack_u16(pixel);
  }

  // Threshhold pixel within range
  float pixel_val = clamp((value - min_) / (max_ - min_), 0.0, 1.0);

  // Color pixel value
  vec3 pixel_color = pixel_val * u_tile_color;
  gl_FragColor = vec4(pixel_color, 1.0);
}
