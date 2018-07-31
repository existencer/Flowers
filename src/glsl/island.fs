#version 300 es

uniform sampler2D uDepthTexture;

in highp vec2 vTexCoord;

out highp vec4 color;

void main() {
  highp float height = texture(uDepthTexture, vTexCoord).r;
  highp float orangeWeight = texture(uDepthTexture, vTexCoord).b;
  // color = vec4(vec3(0.0627, 0.4549, 0.2392) * height + vec3(0.6268, 0.8717, 0.5798) * (1.0 - height), 1.0);
  highp vec3 greenColor = vec3(0.25, 0.55, 0.0) * height + vec3(0.3268, 0.6717, 0.2798) * (1.0 - height);
  color = vec4(greenColor * (1.0 - orangeWeight) + vec3(0.6211, 0.6747, 0.1428) * orangeWeight, 1.0);
}
