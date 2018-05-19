#version 300 es
precision highp int;
precision highp float;
precision highp usampler2D;

uniform usampler2D u_tile;
uniform vec3 u_tile_color;
uniform vec2 u_tile_range;
uniform uint u16;

in vec2 v_tile_pos;

out vec4 color;

void main() {

  uint num = texture(u_tile, v_tile_pos).r;

  // Flip endianness
  uint val = (num >> 8) | (num << 8) & u16;
  float value = float(val) / float(u16);

  float min_ = u_tile_range[0];
  float max_ = u_tile_range[1];

  // Threshhold pixel within range
  float pixel_val = clamp((value - min_) / (max_ - min_), 0.0, 1.0);

  // Color pixel value
  vec3 pixel_color = pixel_val * u_tile_color;
  color = vec4(pixel_color, 1.0);
}
