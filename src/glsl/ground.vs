#version 300 es

layout (location = 0) in highp vec2 aVertexPosition;
layout (location = 1) in highp vec3 aSkyBoxPosition;

layout (std140) uniform uboMatrix {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};
uniform highp vec3 uPlayerPosition;

out highp vec3 vTexCoords;

void main() {
  // gl_Position = uProjectionMatrix * uViewMatrix * vec4(
  //   aVertexPosition.x + uPlayerPosition.x,
  //   0.0,
  //   aVertexPosition.y + uPlayerPosition.z,
  //   1.0
  // );
  highp vec3 flagPos = aSkyBoxPosition * 50.0 + vec3(uPlayerPosition.x, 0.0, uPlayerPosition.z);
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(flagPos, 1.0);
  vTexCoords = aSkyBoxPosition;
}
