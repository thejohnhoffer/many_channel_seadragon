#version 300 es
in vec4 a_pos;
out vec2 uv;

void main() {
  uv = (a_pos.xy + 1.) / 2.;
  gl_Position = a_pos;
}
