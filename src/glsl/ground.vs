#version 300 es

layout (location = 0) in highp vec2 aVertexPosition;

layout (std140) uniform uboMatrix {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};
uniform highp vec3 uPlayerPosition;

void main() {
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(
    aVertexPosition.x + uPlayerPosition.x,
    0.0,
    aVertexPosition.y + uPlayerPosition.z,
    1.0
  );
}
