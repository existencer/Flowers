#version 300 es

in highp float vColor;

out highp vec4 color;

void main() {
  color = vec4(0.45, 0.75, 0.0, 1.0) * vColor + vec4(0.25, 0.55, 0.0, 1.0) * (1.0 - vColor);
}
