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
  mat4 rotateMatrix = mat4(mat3(uModelMatrix));
  vec3 normal = normalize((rotateMatrix * UVinfo).xyz);
  float power = max(dot(normal, lightDir), 0.0);
  color = vec4(vec3(0.8) + vec3(1.0) * power * 0.2, alpha);
}
