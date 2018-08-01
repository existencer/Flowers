#version 300 es

precision highp float;

in vec2 vTexCoord;

uniform sampler2D uTexture;
uniform sampler2D uUVTexture;
uniform mat4 uModelMatrix;

out vec4 color;

void main() {
  vec3 lightDir = normalize(vec3(-1.0, 1.0, 1.0));
  float alpha = 1.0 - texture(uTexture, vTexCoord).r;
  if (alpha < 0.1)
    discard;
  vec4 UVinfo = texture(uUVTexture, vTexCoord) * 2.0 - 1.0;
  vec3 normal = normalize((uModelMatrix * UVinfo).xyz);
  float power = max(dot(normal, lightDir), 0.0);
  color = vec4(vec3(0.76) * (1.0 - power) + vec3(1.0) * power, alpha);
}
