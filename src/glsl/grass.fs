#version 300 es

in highp float vColor;
in highp float vDistance;

out highp vec4 color;

void main() {
  highp vec3 greenColor = vec3(0.45, 0.75, 0.0) * vColor + vec3(0.25, 0.55, 0.0) * (1.0 - vColor);
  highp float power = 350.0 / (vDistance + 300.0);
  color = vec4(greenColor * power + vec3(1.0) * (1.0 - power), 1.0);
}
