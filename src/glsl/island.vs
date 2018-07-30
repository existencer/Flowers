#version 300 es

layout (location = 0) in highp vec2 aVertexPosition;

uniform uint uPrecision;
uniform sampler2D uDepthTexture;
layout (std140) uniform uboMatrix {
  highp mat4 uViewMatrix;
  highp mat4 uProjectionMatrix;
};

void main() {
  uint offsetX = gl_InstanceID % uPrecision;
  uint offsetY = gl_InstanceID / uPrecision;
  highp vec2 location = aVertexPosition + vec2(offsetX, offsetY);
  highp float depth = texture(uDepthTexture, location);
  gl_Position = uProjectionMatrix * uViewMatrix * vec4(location.x, depth ,location.y, 1.0);
}
