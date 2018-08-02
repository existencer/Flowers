precision highp float;

varying vec2 vTexCoord;

uniform sampler2D uTexture;
uniform sampler2D uUVTexture;
uniform mat4 uModelMatrix;
uniform bool uIsLightOn;

void main() {
  vec3 lightDir = normalize(vec3(-1.0, 1.0, 1.0));
  float alpha = 1.0 - texture2D(uTexture, vTexCoord).r;
  if (alpha < 0.1)
    discard;
  vec4 UVinfo = texture2D(uUVTexture, vTexCoord) * 2.0 - 1.0;
  mat4 rotateMatrix = mat4(mat3(uModelMatrix));
  vec3 normal = normalize((rotateMatrix * UVinfo).xyz);
  float power = max(dot(normal, lightDir), 0.0);
  if (uIsLightOn) {
    gl_FragColor = vec4(vec3(0.75) + vec3(1.0, 0.9, 0.8) * power * 0.2, alpha);
  } else {
    gl_FragColor = vec4(vec3(0.4) + vec3(0.6, 0.8, 1.0) * power * 0.4, alpha);
  }
}
