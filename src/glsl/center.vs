#version 300 es

layout (location = 0) in vec3 aVertexPosition;

layout (std140) uniform uboMatrix {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};

uniform highp mat4 uModelMatrix;

void main() {
  highp vec4 flagPos = vec4(aVertexPosition * 0.1, 1.0);
  gl_Position = uProjectionMatrix * uViewMatrix * uModelMatrix * flagPos;
}
