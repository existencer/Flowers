#version 300 es

precision highp float;

layout (location = 0) in vec2 aVertexPos;

layout (std140) uniform uboCamera {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};
uniform mat4 uModelMatrix;

out vec2 vTexCoord;

void main() {
  vTexCoord = aVertexPos * 0.5 + vec2(0.5);
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * vec4(aVertexPos, 0.0, 1.0);
}
