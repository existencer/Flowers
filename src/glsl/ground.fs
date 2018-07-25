#version 300 es

in highp vec3 vTexCoords;

uniform samplerCube uSkyBoxTexture;

out highp vec4 color;

void main() {
  // color = vec4(0.2, 0.5, 0.0, 1.0);
  color = vTexCoords.y < 0.0 ?
    vec4(0.2, 0.5, 0.0, 1.0) :
    texture(uSkyBoxTexture, vTexCoords);
}
