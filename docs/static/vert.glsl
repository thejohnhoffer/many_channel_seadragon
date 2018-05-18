#version 300 es
in vec4 a_pos;
in vec2 a_tile_pos;
out vec2 v_tile_pos;

void main() {
  v_tile_pos = a_tile_pos;
  gl_Position = a_pos;
}
